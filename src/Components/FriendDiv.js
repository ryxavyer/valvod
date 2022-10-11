import { useState } from "react";
import { supabase } from "../supabaseClient";
import { getLevelColorClass } from "../Utils/levelUtils";
import { getStatusImg, STATUS } from "../Utils/status";

const FriendDiv = ({ friend }) => {
    const [statusIMG, setStatusIMG] = useState(getStatusImg(friend.status))
    const [status, setStatus] = useState(friend.status)
    const [level, setLevel] = useState(friend.level)
    const [activeList, setActiveList] = useState(friend.active_list_name)
    const statusUpdateListener = supabase  // eslint-disable-line
        .channel(`public:users:id=eq.${friend.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${friend.id}` }, payload => {
            const updates = payload.new
            if (updates && updates.status && updates.level) {
                setLevel(updates.level)
                setStatus(updates.status)
                setStatusIMG(getStatusImg(updates.status))
                if (updates.active_list_name) {
                    setActiveList(updates.active_list_name)
                }
            }
        })
        .subscribe()

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
                    {status === STATUS.WORKING && <p className='text-xs'>{activeList}</p>}
                </div>
            </div>
        </div>
    )

}

export default FriendDiv;