import { supabase } from '../supabaseClient'
import onlinePNG from '../static/online.png'
import workingPNG from '../static/working.png'
import offlinePNG from '../static/offline.png'

export const STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    WORKING: "working",
}

export const getStatusColor = (status) =>  {
    switch(status) {
        case STATUS.ONLINE: return "text-lime-600"
        case STATUS.OFFLINE: return "text-white"
        case STATUS.WORKING: return "text-routyneGold"
        default: return "text-white"
    }
}

export const getStatusImg = (status) =>  {
    switch(status) {
        case STATUS.ONLINE: return <img className='w-6 h-6 self-center' src={onlinePNG} alt='online'></img>
        case STATUS.OFFLINE: return <img className='w-6 h-6 self-center' src={offlinePNG} alt='offline'></img>
        case STATUS.WORKING: return <img className='w-6 h-6 self-center' src={workingPNG} alt='working'></img>
        default: return <img className='w-6 h-6 self-center' src={offlinePNG} alt='offline'></img>
    }
}

export const changeStatus = async (user, status, activeListName) => {
    // update user status/activeList in the database
    if (status === STATUS.WORKING && activeListName) {
        const { error } = await supabase
            .from('users')
            .update({ status: status, active_list_name: activeListName })
            .eq('id', user.id)
    
        if (error) {
            console.log(error)
        }
    } else {
        const { error } = await supabase
            .from('users')
            .update({ status: status })
            .eq('id', user.id)
    
        if (error) {
            console.log(error)
        }
    }
}