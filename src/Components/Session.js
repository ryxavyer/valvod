import { useState, useEffect, useCallback, useRef } from "react"
import { getCorrespondingBreak, POMODORO_TIMER } from "../Utils/sessionUtils"
import alarm from "../audio/alarm.mp3"
import { DEFAULT_MSG_LENGTH, NO_SESSION_ERROR } from "../Utils/errorUtils"
import { supabase } from "../supabaseClient"
import { getUpdatedLevelProgress } from "../Utils/levelUtils"
import { changeStatus, STATUS } from "../Utils/status"
import { Alert, Button, Divider, MenuItem, Select } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import ReactCanvasConfetti from 'react-canvas-confetti'

const confettiCanvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
}

const DEFAULT_DOCUMENT_TITLE = "routyne"
const WORKING_DEFAULT = 25*60
const BREAK_DEFAULT = 5*60
const TIME_DEFAULT = {h: "00", m: "25", s: "00"}

const Session = ({ session, setInSessionView, activeListName }) => {
    const [error, setError] = useState(null)
    const [time, setTime] = useState(TIME_DEFAULT)
    const [timer, setTimer] = useState(0)
    const [workingSeconds, setWorkingSeconds] = useState(WORKING_DEFAULT)
    const [workSelectValue, setWorkSelectValue] = useState(WORKING_DEFAULT/60)
    const [initialWorkingSeconds, setInitialWorkingSeconds] = useState(WORKING_DEFAULT)
    const [breakSeconds, setBreakSeconds] = useState(BREAK_DEFAULT)
    const [breakSelectValue, setBreakSelectValue] = useState(BREAK_DEFAULT/60)
    const [initialBreakSeconds, setInitialBreakSeconds] = useState(BREAK_DEFAULT)
    const [isBreak, setIsBreak] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [totalWorkingSeconds, setTotalWorkingSeconds] = useState(0)
    const refAnimationInstance = useRef(null)

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

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance
    }, [])

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
          refAnimationInstance.current({
            ...opts,
            particleCount: Math.floor(200 * particleRatio)
          })
      }, [])
    
      const fireConfetti = useCallback(() => {
        makeShot(0.25, {
            spread: 50,
            startVelocity: 60,
            angle: 30,
            origin: { y: 0.3, x:0, },
        })
        makeShot(0.50, {
            spread: 60,
            startVelocity: 80,
            angle: 20,
            origin: { y: 0.3, x:0, },
        })
        makeShot(0.50, {
            spread: 60,
            startVelocity: 80,
            angle: 20,
            origin: { y: 0.5, x:0, },
        })
        makeShot(0.50, {
            spread: 60,
            startVelocity: 80,
            angle: 20,
            origin: { y: 0.8, x:0, },
        })

        makeShot(0.25, {
            spread: 50,
            startVelocity: 60,
            angle: 170,
            origin: { y: 0.3, x:1, },
        })
        makeShot(0.50, {
            spread: 60,
            startVelocity: 80,
            angle: 150,
            origin: { y: 0.3, x:1, },
        })
        makeShot(0.50, {
            spread: 60,
            startVelocity: 80,
            angle: 150,
            origin: { y: 0.5, x:1, },
        })
        makeShot(0.50, {
            spread: 60,
            startVelocity: 80,
            angle: 150,
            origin: { y: 0.8, x:1, },
        })
      }, [makeShot])

    const resetState = () => {
        setIsWorking(false)
        setIsBreak(false)
        if (timer !== 0) clearTimeout(timer)
        setTimer(0)
        setWorkingSeconds(initialWorkingSeconds)
        setWorkSelectValue(initialWorkingSeconds/60)
        setBreakSeconds(initialBreakSeconds)
        setBreakSelectValue(initialBreakSeconds/60)
        updateTime(secondsToTime(initialWorkingSeconds))
        document.title = DEFAULT_DOCUMENT_TITLE
    }

    const handleError = (error) => {
        setError(error)
        setTimeout(() => {
            setError(null)
        }, DEFAULT_MSG_LENGTH)
    }

    const handleExit = () => {
        resetState()
        setInSessionView(false)
    }

    const getSessionEndTimestamp = (seconds) => {
        const now = new Date()
        const sessionEnd = new Date(now.getTime() + seconds*1000)
        return sessionEnd.toISOString()
    }

    const updateTime = (newTime) => {
        document.title = newTime.h !== "00" ? `${newTime.h}:${newTime.m}:${newTime.s} - routyne` : `${newTime.m}:${newTime.s} - routyne`
        setTime(newTime)
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

    const handleWorkSelectChange = (e) => {
        const selected = e.target.value
        const selectedWork = Number(selected)
        const newBreakSeconds = getCorrespondingBreak(selectedWork)*60

        setBreakSelectValue(getCorrespondingBreak(selectedWork))
        setBreakSeconds(newBreakSeconds)
        setInitialBreakSeconds(newBreakSeconds)
        setWorkingSeconds(selectedWork*60)
        setWorkSelectValue(selectedWork)
        setInitialWorkingSeconds(selectedWork*60)

        updateTime(secondsToTime(selectedWork*60))
    }

    const handleBreakSelectChange = (e) => {
        const selected = e.target.value
        const selectedBreak = Number(selected)

        setBreakSeconds(selectedBreak*60)
        setInitialBreakSeconds(selectedBreak*60)
        setBreakSelectValue(selectedBreak)
    }

    const handleWorkBreakShift = () => {
        const { user } = session
        sessionEndAlarm.play()
        changeStatus(user, STATUS.WORKING, activeListName, isWorking ? null : getSessionEndTimestamp(initialWorkingSeconds))
        setTimeout(() => {
            isWorking ? setBreakSeconds(initialBreakSeconds) : setWorkingSeconds(initialWorkingSeconds)
            setIsWorking(!isWorking)
            setIsBreak(!isBreak)
            updateTime(secondsToTime(isWorking ? initialBreakSeconds : initialWorkingSeconds))
        }, 3000)
    }

    const countDown = () => {
        let newSeconds = 0
        if (isWorking) newSeconds = workingSeconds - 1
        if (isBreak) newSeconds = breakSeconds - 1

        const newTotal = isWorking ? totalWorkingSeconds + 1 : totalWorkingSeconds
        setTotalWorkingSeconds(newTotal)

        if (isWorking) setWorkingSeconds(newSeconds)
        if (isBreak) setBreakSeconds(newSeconds)
        updateTime(secondsToTime(newSeconds))
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

            let { updatedLevel, updatedXP } = getUpdatedLevelProgress(currLevel, currXP)
            if (currLevel !== updatedLevel) {
                fireConfetti()
            }
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
        changeStatus(user, STATUS.WORKING, activeListName, getSessionEndTimestamp(initialWorkingSeconds))
        updateTime(secondsToTime(workingSeconds))
    }

    const endSession = () => {
        const { user } = session
        changeStatus(user, STATUS.ONLINE, null, null)
        handleSessionXP()
        resetState()
    }

    return (
        <div>
            <ReactCanvasConfetti refConfetti={getInstance} style={confettiCanvasStyles} />
            <div className="absolute">
                <Button disabled={isWorking || isBreak} variant="outlined" title="Exit Session" onClick={() => handleExit()}
                        sx={{ padding:2, marginX:2.5,  }}>
                    <ArrowBack/>
                </Button>
            </div>
            <div className="flex flex-col">
                {error && <Alert variant='outlined' severity='error' sx={{ width:"30%", marginY:2, marginX:"auto" }}>{error}</Alert>}
                <div className="text-6xl self-center">
                    {time.h !== "00" ? `${time.h}:${time.m}:${time.s}` : `${time.m}:${time.s}`}
                </div>
                <div className={isWorking || isBreak ? "flex flex-row my-6 self-center hidden" : "flex flex-row my-6 self-center"}>
                    <div className="pr-1">Work for</div>
                    <Select id="work_select" value={workSelectValue} onChange={(e) => handleWorkSelectChange(e)} className="h-7 w-15">
                        {POMODORO_TIMER.WORK_LIST.map((value, index) => {
                            return <MenuItem value={value} key={`work_${index}`}>{value}</MenuItem>
                        })}
                    </Select>
                    <div className="px-1">min</div>
                    <Divider orientation='vertical' flexItem sx={{  marginX:"10px" }}/>
                    <div className="px-1">Break for</div>
                    <Select id="break_select" value={breakSelectValue} onChange={(e) => handleBreakSelectChange(e)} className="h-7 w-15">
                        {POMODORO_TIMER.BREAK_LIST.map((value, index) => {
                            return <MenuItem value={value} key={`break_${index}`}>{value}</MenuItem>
                        })}
                    </Select>
                    <div className="pl-1">min</div>
                </div>
                <div className="self-center">
                {isWorking || isBreak
                 ? 
                    <Button variant="outlined" disableElevation color="error" onClick={() => endSession()}
                            sx={{ marginY:2, }}>
                        End Session
                    </Button>
                 :
                    <Button variant="contained" disableElevation onClick={() => startSession()}
                            sx={{ marginBottom:2, }}>
                        Start Session
                    </Button>
                }
                </div>
            </div>
        </div>
    )

}

export default Session;