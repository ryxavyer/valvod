import { Box, LinearProgress, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { calculateTotalLevelXP, getLevelColorClass, getLevelProgressClass } from '../../Utils/levelUtils'

const Level = ({ theme, session, initialLevel, initialXP }) => {
    const [level, setLevel] = useState(Math.round(initialLevel))
    const [levelClass, setLevelClass] = useState(getLevelProgressClass(initialLevel, initialXP))
    const [xp , setXP] = useState(Math.round(initialXP))
    const { user } = session
    const levelListener = supabase  // eslint-disable-line
        .channel(`users:id=eq.${user.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, (payload) => {
            const updates = payload.new
            if (updates && updates.level && updates.xp !== undefined) {
                setLevel(Math.round(updates.level))
                setLevelClass(getLevelProgressClass(updates.level, updates.xp))
                setXP(Math.round(updates.xp))
            }
        })
        .subscribe()

    useEffect(() => {
    }, [level, levelClass])

    return (
        <div className='flex flex-col justify-around w-36 mx-2'>
            <div className={`rounded-lg w-3/12 ${getLevelColorClass(level)} self-center text-center`}>{level}</div>
            <Box sx={{ width: '100%' }}>
                <Tooltip title={`${Math.trunc(xp)}/${Math.trunc(calculateTotalLevelXP(level))}`} arrow>
                    <LinearProgress variant="determinate" value={Math.trunc(xp/calculateTotalLevelXP(level)*100)}/>
                </Tooltip>
            </Box>
        </div>
    )
}

export default Level;