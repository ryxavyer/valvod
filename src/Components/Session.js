import { useState, useEffect } from "react"
import { getCorrespondingBreak, POMODORO_TIMER } from "../Utils/sessionUtils"
import GoldDivider from "./GoldDivider"
import alarm from "../audio/alarm.mp3"
import { NO_SESSION_ERROR } from "../Utils/errorUtils"
import ErrorMessage from "./ErrorMessage"
import { supabase } from "../supabaseClient"
import { getUpdatedLevelProgress } from "../Utils/levelUtils"
import { changeStatus, STATUS } from "../Utils/status"

const WORKING_DEFAULT = 25*60
const BREAK_DEFAULT = 5*60
const TIME_DEFAULT = {h: "00", m: "25", s: "00"}

const Session = ({ session, setInSessionView, activeListName }) => {
    const [error, setError] = useState(null)
    const [time, setTime] = useState(TIME_DEFAULT)
    const [timer, setTimer] = useState(0)
    const [workingSeconds, setWorkingSeconds] = useState(WORKING_DEFAULT)
    const [initialWorkingSeconds, setInitialWorkingSeconds] = useState(WORKING_DEFAULT)
    const [breakSeconds, setBreakSeconds] = useState(BREAK_DEFAULT)
    const [initialBreakSeconds, setInitialBreakSeconds] = useState(BREAK_DEFAULT)
    const [isBreak, setIsBreak] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [totalWorkingSeconds, setTotalWorkingSeconds] = useState(0)

    const sessionEndAlarm = new Audio(alarm)
    sessionEndAlarm.volume = 0.2

    useEffect(() => {
        if (isWorking && workingSeconds === 0) {
            clearTimeout(timer)
            handleWorkBreakShift()
            return
        }
        if (isBreak && breakSeconds === 0) {
            clearTimeout(timer)
            handleWorkBreakShift()
            return
        }
        if (isWorking || isBreak) {
            setTimer(setTimeout(() => {
                countDown()
            }, 1000))
        }
        return () => clearTimeout(timer)
    }, [time]) // eslint-disable-line

    const resetState = () => {
        setIsWorking(false)
        setIsBreak(false)
        if (timer !== 0) clearTimeout(timer)
        setTimer(0)
        setWorkingSeconds(initialWorkingSeconds)
        setWorkSelect(initialWorkingSeconds/60)
        setBreakSeconds(initialBreakSeconds)
        setBreakSelect(initialBreakSeconds/60)
        setTime(secondsToTime(initialWorkingSeconds))
    }

    const handleError = (error) => {
        setError(error)
        setTimeout(() => {
            setError(null)
        }, 5000)
    }

    const handleExit = () => {
        resetState()
        setInSessionView(false)
    }

    const secondsToTime = (secs) => {
        let hours = Math.floor(secs / (60 * 60))
        const divisor_for_minutes = secs % (60 * 60)
        let minutes = Math.floor(divisor_for_minutes / 60)
        const divisor_for_seconds = divisor_for_minutes % 60
        let seconds = Math.ceil(divisor_for_seconds)

        if (hours < 10) hours = `0${hours}`
        if (minutes < 10) minutes = `0${minutes}`
        if (seconds < 10) seconds = `0${seconds}`

        return {h: hours.toString(), m: minutes.toString(), s: seconds.toString()}
    }

    const setWorkSelect = (v) => {
        const workSelect = document.getElementById("work_select")
        workSelect.value = v
    }

    const setBreakSelect = (v) => {
        const breakSelect = document.getElementById("break_select")
        breakSelect.value = v
    }

    const handleWorkSelectChange = (e) => {
        const selected = e.target.value
        const selectedWork = Number(selected)
        const newBreakSeconds = getCorrespondingBreak(selectedWork)*60

        setBreakSelect(getCorrespondingBreak(selectedWork))
        setBreakSeconds(newBreakSeconds)
        setInitialBreakSeconds(newBreakSeconds)
        setWorkingSeconds(selectedWork*60)
        setInitialWorkingSeconds(selectedWork*60)

        setTime(secondsToTime(selectedWork*60))
    }

    const handleBreakSelectChange = (e) => {
        const selected = e.target.value
        const selectedBreak = Number(selected)

        setBreakSeconds(selectedBreak*60)
        setInitialBreakSeconds(selectedBreak*60)
    }

    const handleWorkBreakShift = () => {
        sessionEndAlarm.play()
        setTimeout(() => {
            isWorking ? setBreakSeconds(initialBreakSeconds) : setWorkingSeconds(initialWorkingSeconds)
            setIsWorking(!isWorking)
            setIsBreak(!isBreak)
            setTime(secondsToTime(isWorking ? initialBreakSeconds : initialWorkingSeconds))
        }, 3000)
    }

    const countDown = () => {
        let newSeconds = 0
        if (isWorking) newSeconds = workingSeconds - 1
        if (isBreak) newSeconds = breakSeconds - 1
        const newTotal = isWorking ? totalWorkingSeconds + 1 : totalWorkingSeconds
        if (isWorking) setWorkingSeconds(newSeconds)
        if (isBreak) setBreakSeconds(newSeconds)
        setTotalWorkingSeconds(newTotal)
        setTime(secondsToTime(newSeconds))
    }

    const handleSessionXP = async () => {
        const { user } = session
        try {
            if (!user) throw Error(NO_SESSION_ERROR)

            let { data, error } = await supabase
                .from("users")
                .select("level,xp")
                .eq("id", user.id)
                .single()
            
            if (error) throw error

            let currLevel = Number(data.level)
            let currXP = Number(data.xp) + Math.ceil(totalWorkingSeconds / 60)

            let { updatedLevel, updatedXP} = getUpdatedLevelProgress(currLevel, currXP)
            let updatedSessionData = await supabase
                .from("users")
                .update({level: updatedLevel, xp: updatedXP})
                .eq("id", user.id)

            if (updatedSessionData.error) throw updatedSessionData.error
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    } 

    const startSession = () => {
        const { user } = session
        setIsWorking(true)
        changeStatus(user, STATUS.WORKING, activeListName)
        setTime(secondsToTime(workingSeconds))
    }

    const endSession = () => {
        const { user } = session
        changeStatus(user, STATUS.ONLINE)
        handleSessionXP()
        resetState()
    }

    return (
        <div>
            {!isWorking && !isBreak &&
                <button className="w-full h-12 self-center text-sm rounded bg-white bg-opacity-5 hover:bg-opacity-10 focus:outline-white" onClick={() => handleExit()}>
                    Exit Session
                </button>
            }
            {error && <ErrorMessage error={error}/>}
            <div className="flex flex-col">
                <div className="mt-8 text-6xl self-center">
                    {time.h !== "00" ? `${time.h}:${time.m}:${time.s}` : `${time.m}:${time.s}`}
                </div>
                <div className={isWorking || isBreak ? "flex flex-row my-6 self-center hidden" : "flex flex-row my-6 self-center"}>
                    <div className="pr-1">Work for</div>
                    <select id="work_select" className="h-6 w-14 text-md rounded bg-white bg-opacity-5 hover:bg-opacity-10 focus:outline-white" onChange={(e) => handleWorkSelectChange(e)}>
                        {POMODORO_TIMER.WORK_LIST.map((value, index) => {
                            return (<option key={`work_${index}`} className="text-black">{value}</option>)
                        })}
                    </select>
                    <div className="px-1">min</div>
                    <GoldDivider/>
                    <div className="px-1">Break for</div>
                    <select id="break_select" className="h-6 w-12 text-md rounded bg-white bg-opacity-5 hover:bg-opacity-10 focus:outline-white" onChange={(e) => handleBreakSelectChange(e)}>
                        {POMODORO_TIMER.BREAK_LIST.map((value, index) => {
                            return (<option key={`break_${index}`} className="text-black">{value}</option>)
                        })}
                    </select>
                    <div className="pl-1">min</div>
                </div>
                <div className="self-center">
                {isWorking || isBreak
                 ? 
                    <button className="h-10 w-36 mt-4 text-md rounded bg-red-800 bg-opacity-40 hover:bg-opacity-60 focus:outline-white" onClick={() => endSession()}>
                        End Session
                    </button>
                 :
                    <button className="h-10 w-36 text-md rounded bg-white bg-opacity-5 hover:bg-opacity-10 focus:outline-white" onClick={() => startSession()}>
                        Start Session
                    </button>
                }
                </div>
            </div>
        </div>
    )

}

export default Session;