import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { getStatusImg } from '../../Utils/status'

const Username = ({ session, username, initialStatus }) => {
    const [status, setStatus] = useState(initialStatus)
    const { user } = session
    const statusListener = supabase  // eslint-disable-line
        .channel(`public:users:id=eq.${user.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, payload => {
            const updates = payload.new
            if (updates && updates.status) {
                setStatus(updates.status)
            }
        })
        .subscribe()

    useEffect(() => {
    }, [status])

    return (
        <div className='hidden flex-row rounded bg-white bg-opacity-5 self-center px-2 py-2 mx-2 md:flex'>
            {getStatusImg(status)}
            <div className=' mx-1 self-center'>{username ? username : ""}</div>
        </div>
    )

}

export default Username;