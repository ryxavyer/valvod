import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'
import notificationPNG from '../../static/notifications.png'
import ErrorMessage from '../ErrorMessage';
import { getTimeToDisplay } from '../../Utils/dateUtils';
import { DEFAULT_MSG_LENGTH } from '../../Utils/errorUtils';

const NotificationPing = ({ hasUnread }) => {
    return (
        <div>
        {hasUnread && 
            <div>
                <span className="animate-ping-slow absolute inline-flex h-3 w-3 mx-6 -my-3 rounded-full bg-routyneGoldLight opacity-75"></span>
                <span className="absolute inline-flex rounded-full h-3 w-3 mx-6 -my-3 bg-routyneGold"></span>
            </div>
        }
        </div>
    )
}

const Updates = ({ session }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [hasUnread, setHasUnread] = useState(false)
    const [errorTimeout, setErrorTimeout] = useState(null)
    const [error, setError] = useState(null)
    const [updates, setUpdates] = useState([])
    const updatesListener = supabase  // eslint-disable-line
        .channel('public:updates')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table:'updates' }, payload => {
            fetchUpdates()
        })
        .subscribe()

    useEffect(() => {
        fetchUpdates()
    }, []) // eslint-disable-line

    const handleError = (error) => {
        setError(error)
        if (errorTimeout) {
            clearTimeout(errorTimeout)
        }
        setErrorTimeout(setTimeout(() => {
            setError(null)
            }, DEFAULT_MSG_LENGTH)
        )
    }

    const checkForUnread = async (updates) => {
        const { user } = session
        try {
            if (!user) throw Error("No session found. Refresh and try again.")

            let { data, error } = await supabase
                .from('users')
                .select('last_update_seen')
                .eq('id', user.id)
                .single()
            
            if (error) throw error

            if (!data) {
                setHasUnread(true)
            } else {
                const lastSeenDate = new Date(data.last_update_seen)
                const latestUpdateDate = new Date(updates[0].created_at)
                setHasUnread(lastSeenDate < latestUpdateDate)
            }
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    }

    const fetchUpdates = async () => {
        try {
            let { data, error } = await supabase
                .from('updates')
                .select('*')

            if (error) throw error

            if (!data) {
                setUpdates([])
                return
            }
            // display results with most recent at the top
            data.reverse()
            setUpdates(data)
            checkForUnread(data)
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    }

    const updateLastSeen = async () => {
        const { user } = session
        try {
            if (!user) throw Error("No session found. Refresh and try again.")

            // update user last_update_seen
            const now = new Date().toISOString()
            const { data, error } = await supabase  // eslint-disable-line
                .from('users')
                .update({ last_update_seen: now })
                .eq('id', user.id)

            if (error) throw error
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    }

    const toggleOpen = () => {
        if (hasUnread && !isOpen === true) {
            updateLastSeen()
            setHasUnread(false)
        }
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <button onClick={() => toggleOpen()}>
                <div className='flex flex-row rounded bg-white bg-opacity-5 self-center px-2 py-2 mx-2 hover:bg-opacity-10'>
                    <NotificationPing hasUnread={hasUnread}/>
                    <img className='w-6' src={notificationPNG} alt="Updates"></img>
                </div>
            </button>
            {isOpen && 
                <div className='w-1/2 h-2/4 overflow-y-auto bg-defaultBody rounded fixed border-2 border-routyneGold top-20 left-[40%] z-[200] lg:w-1/4 lg:left-[70%]'>
                    <div className='flex flex-row'>
                        <div className='text-xl ml-7 my-4'>Updates</div>
                        <button className='text-xs w-8 h-8 absolute right-0 bg-white bg-opacity-0 hover:bg-opacity-5' onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <div className='my-2'></div>
                    <div className='flex flex-col'>
                        {error && <ErrorMessage error={error}/>}
                    {updates.map((update, index) => {
                        return (
                            <div key={update.id} className='w-11/12 h-auto mb-4 px-2 py-2 rounded bg-white bg-opacity-5 self-center text-md align-middle'>
                                <div className='text-sm'>
                                    <div>{update.update}</div>
                                </div>
                                <div className="text-xs float-right mt-2">
                                    {getTimeToDisplay(update.created_at)}
                                </div>
                            </div>
                        )})}
                    </div>
                    <div className='my-2'></div>
                </div>
            }
        </div>
    )

}

export default Updates;