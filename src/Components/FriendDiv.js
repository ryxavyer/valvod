import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { makeSessionEndReadable } from "../Utils/dateUtils";
import { getLevelColorClass } from "../Utils/levelUtils";
import { getStatusImg, STATUS } from "../Utils/status";

const FriendDiv = ({ friend }) => {
    const [statusIMG, setStatusIMG] = useState(getStatusImg(friend.status))
    const [status, setStatus] = useState(friend.status)
    const [level, setLevel] = useState(friend.level)
    const [activeList, setActiveList] = useState(friend.active_list_name)
    const [timeLeft, setTimeLeft] = useState(makeSessionEndReadable(friend.current_session_end))
    const [timeLeftInterval, setTimeLeftInterval] = useState(null)
    const statusUpdateListener = supabase  // eslint-disable-line
        .channel(`public:users:id=eq.${friend.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${friend.id}` }, payload => {
            const updates = payload.new
            if (updates && updates.status && updates.level) {
                clearInterval(timeLeftInterval)
                setLevel(updates.level)
                setStatus(updates.status)
                setStatusIMG(getStatusImg(updates.status))
                if (updates.active_list_name) {
                    setActiveList(updates.active_list_name)
                }
                if (updates.status === STATUS.WORKING) {
                    setTimeLeft(makeSessionEndReadable(updates.current_session_end))
                    if (updates.current_session_end){
                        setTimeLeftInterval(
                            setInterval(() => {
                                setTimeLeft(makeSessionEndReadable(updates.current_session_end))
                            }, 60000)
                        )
                    }
                }
            }
        })
        .subscribe()

    useEffect(() => {
        if (friend.status === STATUS.WORKING && friend.current_session_end) {
            setTimeLeftInterval(
                setInterval(() => {
                    setTimeLeft(makeSessionEndReadable(friend.current_session_end))
                }, 60000)
            )
        }
    }, [])  // eslint-disable-line
    
    return (
        <div key={friend.id} className='flex flex-row'>
            <div className='w-full h-auto mb-4 px-2 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                <div className="text-xs mr-1 float-left">
                    {statusIMG}
                </div>
                <div className='flex flex-col mr-2'>
                    <div className='flex flex-row mr-2'>
                        <div className="leading-6">{friend.username}</div>
                        <div className={`ml-1 text-xs rounded-lg px-2 ${getLevelColorClass(friend.level)} self-center text-center`}>Level {level}</div>
                    </div>
                    {status === STATUS.WORKING && <p className='text-xs'>{activeList} - {timeLeft}</p>}
                </div>
            </div>
        </div>
    )

}

export default FriendDiv;