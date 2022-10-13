import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { getLevelColorClass, getLevelProgressClass } from '../../Utils/levelUtils'

const Level = ({ session, initialLevel, xp }) => {
    const [level, setLevel] = useState(initialLevel)
    const [levelClass, setLevelClass] = useState(getLevelProgressClass(initialLevel, xp))
    const { user } = session
    const levelListener = supabase  // eslint-disable-line
        .channel(`users:id=eq.${user.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, (payload) => {
            const updates = payload.new
            if (updates && updates.level && updates.xp !== undefined) {
                setLevel(updates.level)
                setLevelClass(getLevelProgressClass(updates.level, updates.xp))
            }
        })
        .subscribe()

    useEffect(() => {
    }, [level, levelClass])

    return (
        <div className='hidden flex-col justify-around w-36 mx-2 sm:flex'>
            <div className={`rounded-lg w-3/12 ${getLevelColorClass(level)} self-center text-center`}>{level}</div>
            <div className='rounded-full w-full bg-white bg-opacity-5 self-center text-center'>
                <div className={`rounded-full bg-green-500 text-xs leading-none py-1 ${levelClass}`}></div>
            </div>
        </div>
    )
}

export default Level;