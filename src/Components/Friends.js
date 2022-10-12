import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import checkmarkPNG from "../static/checkmark.png"
import ErrorMessage from './ErrorMessage'
import { FRIEND_STATUS } from '../Utils/friendStatus'
import SuccessMessage from './SuccessMessage'
import { NO_SESSION_ERROR } from '../Utils/errorUtils'
import FriendDiv from './FriendDiv'
import LoadingSpinner from './LoadingSpinner'
import { STATUS } from '../Utils/status'

export const Friends = ({ session }) => {
    const [loading, setLoading] = useState(false)
    const [messageTimeout, setMessageTimeout] = useState(null)
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [formOpen, setFormOpen] = useState(false)
    const [friendInput, setFriendInput] = useState("")
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])

    useEffect(() => {
        fetchFriendsList().then(() => {  setupListeners() })
    }, []) // eslint-disable-line

    const handleSuccess = (message) => {
        setSuccess(message)
        if (messageTimeout) {
            clearTimeout(messageTimeout)
        }
        setMessageTimeout(setTimeout(() => {
            setSuccess(null)
            }, 5000)
        )
    }

    const handleError = (error) => {
        setError(error)
        if (messageTimeout) {
            clearTimeout(messageTimeout)
        }
        setMessageTimeout(setTimeout(() => {
            setError(null)
            }, 5000)
        )
    }

    const sortFriendsByStatus = (a, b) => {
        if (a.status === STATUS.OFFLINE) return 1
        if (b.status === STATUS.OFFLINE) return -1

        return 0
    }

    const fetchFriendsList = async () => {
        const { user } = session
        setLoading(true)
        try {
            if (!user) throw Error(NO_SESSION_ERROR)

            const friends = await queryFriendships(FRIEND_STATUS.A)
            if (!friends) setFormOpen(true)
            !friends ? setFriends([]) : setFriends(friends.sort(sortFriendsByStatus))

            const requests = await queryRequests()
            !requests ? setRequests([]) : setRequests(requests)

            return friends
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        } finally {
            setLoading(false)
        }
    }

    const setupListeners = () => {
        const { user } = session
        const requesterListener = supabase  // eslint-disable-line
            .channel(`public:friendship:requester_id=eq.${user.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'friendship', filter: `requester_id=eq.${user.id}`}, fetchFriendsList)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'friendship', filter: `requester_id=eq.${user.id}`}, fetchFriendsList)
            .subscribe()
        const requesteeListener = supabase  // eslint-disable-line
            .channel(`public:friendship:requester_id=eq.${user.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'friendship', filter: `requestee_id=eq.${user.id}`}, fetchFriendsList)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'friendship', filter: `requestee_id=eq.${user.id}`}, fetchFriendsList)
            .subscribe()
    }

    const queryFriendships = async (status) => {
        const { user } = session
        try {
            if (!user) throw Error(NO_SESSION_ERROR)

            const requesterFriendshipsData = await supabase
                .from('friendship')
                .select('*')
                .eq('requester_id', user.id)
                .eq("status", status)

            if (requesterFriendshipsData.error) throw requesterFriendshipsData.error

            const requesteeFriendshipsData = await supabase
                .from('friendship')
                .select('*')
                .eq('requestee_id', user.id)
                .eq("status", status)

            if (requesteeFriendshipsData.error) throw requesteeFriendshipsData.error

            const friendshipIds = []
            if (requesterFriendshipsData.data) friendshipIds.push.apply(friendshipIds, requesterFriendshipsData.data.map((friendship) => {return friendship.requestee_id}))
            if (requesteeFriendshipsData.data) friendshipIds.push.apply(friendshipIds, requesteeFriendshipsData.data.map((friendship) => {return friendship.requester_id}))

            let { data, error } = await supabase
                .from('users')
                .select('*')
                .in("id", friendshipIds)

            if (error) throw error

            return data
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    }

    const queryRequests = async () => {
        const { user } = session
        try {
            let friendshipData = await supabase
              .from('friendship')
              .select('*')
              .eq('requestee_id', user.id)
              .eq("status", FRIEND_STATUS.R)

            if (friendshipData.error) throw friendshipData.error

            const requestIds = []
            if (friendshipData.data) requestIds.push.apply(requestIds, friendshipData.data.map((friendship) => {return friendship.requester_id}))

            let requesterData = await supabase
                .from('users')
                .select('*')
                .in("id", requestIds)
            
            if (requesterData.error) throw requesterData.error

            return requesterData.data
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    }

    const updateRequestStatus = async (requestId, accepted) => {
        const { user } = session
        try {
            if (!user) throw Error(NO_SESSION_ERROR)
            const now = new Date().toISOString()
            // update status in db
            const { data, error } = await supabase  // eslint-disable-line
                .from('friendship')
                .update({ status: (accepted ? FRIEND_STATUS.A : FRIEND_STATUS.D), last_modified: now})
                .eq('requester_id', requestId)
                .eq('requestee_id', user.id)

            if (error) throw error
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    }

    const toggleFormOpen = () => {
        setFormOpen(!formOpen)
    }

    const updateFriendInput = (e) => {
        const input = (e.target.value).toString().trim()
        setFriendInput(input)
    }

    const validateFriendInput = async () => {
        const { user } = session
        try {
            if (!user) throw Error(NO_SESSION_ERROR)

            // check username exists
            let { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("username", friendInput)
                .single()

            if (error) throw Error(`User ${friendInput} doesn't exist`)

            let sessionUsername = await supabase
                .from('users')
                .select('username')
                .eq("id", user.id)
                .single()
            if (sessionUsername.error) throw sessionUsername.error
            // make sure usernames are unique
            if (sessionUsername.username === data.username) throw Error(`You cannot add yourself as a friend`)

            return data
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return undefined
        }
    }

    const addFriendSubmit = async (e) => {
        const { user } = session
        e.preventDefault()
        const requestee = await validateFriendInput()
        if (requestee) {
            try {
                if (!user) throw Error(NO_SESSION_ERROR)

                // get accepted and requested friendships from db
                const accepted = await queryFriendships(FRIEND_STATUS.A)
                const requested = await queryFriendships(FRIEND_STATUS.R)
                // check for existing accepted friendship
                const existingAccepted = accepted.find(friend => (friend.id === requestee.id || friend.id === requestee.id))
                if (existingAccepted) throw Error(`You are already friends with ${requestee.username}`)
                // check for existing requested friendship where user is the requester
                const existingRequested = requested.find(friend => friend.id === requestee.id)
                if (existingRequested) throw Error(`You have already sent a request to ${requestee.username}`)
                // check for existing requested friendship where user is the requestee
                const doubleSidedRequest = requested.find(friend => friend.id === requestee.id)
                if (doubleSidedRequest) {
                    // update in db
                    const { data, error } = await supabase  // eslint-disable-line
                        .from('friendship')
                        .update({ status: FRIEND_STATUS.A })
                        .eq('requester_id', requestee.id)
                        .eq('requestee_id', user.id)

                    if (error) throw error
                } else {
                    // insert in db
                    const { data, error } = await supabase  // eslint-disable-line
                        .from('friendship')
                        .insert({ requester_id: user.id, requestee_id: requestee.id, status: FRIEND_STATUS.R })

                    if (error) throw error
                }

                handleSuccess("Friend request sent")
                setFriendInput("")
            }
            catch (error) {
                handleError(error.error_description || error.message)
                return
            }
        }
    }

    return (
        <div className='hidden my-8 flex-col w-1/3 bg-defaultBody z-[100] lg:max-w-md lg:flex'>
            <div className='flex flex-row'>
                <div className='text-xl ml-5 my-2'>Friends</div>
                <button className='w-10 h-6 ml-52 text-md text-center self-center rounded bg-white bg-opacity-5 hover:bg-opacity-10' onClick={() => toggleFormOpen()}>+</button>
            </div>
            {loading 
             ? <LoadingSpinner divHeight={"16"} spinnerSize={"12"}/> 
             :
                <div>
                    <div className='flex flex-col mx-6'>
                        {error && <ErrorMessage error={error}/>}
                        {success && <SuccessMessage message={success}/>}
                        {formOpen &&
                            <div>
                                <form className="flex flex-row" onSubmit={(e) => addFriendSubmit(e)}>
                                    <input className="bg-transparent w-full border-b-2 self-center py-1 placeholder:text-white placeholder:text-sm focus:outline-none placeholder:opacity-50" placeholder='Add a friend by username...' value={friendInput} onChange={(e) => updateFriendInput(e)}></input>
                                    <button type='submit' hidden className="w-24 rounded-lg bg-routyneGold self-center py-2 hover:bg-routyneGoldLight">ADD</button>
                                </form>
                            </div>
                        }
                        {friends.length !== 0 && 
                        friends.map((friend, index) => {
                            return (
                                <div key={index}>
                                    <FriendDiv friend={friend}/>
                                </div>
                            )
                        })}
                    </div>
                    <div className='my-2'></div>
                    { requests.length !== 0 && 
                        <div>
                            <div className='flex flex-row'>
                                <div className='text-xl ml-7 my-2'>Requests</div>
                            </div>
                            <div className='flex flex-col mx-6'>
                                {requests.map((request, index) => {
                                    return (
                                        <div key={request.id} className='flex flex-row'>
                                            <div className='w-full h-auto mb-4 px-2 py-2 rounded-l bg-white bg-opacity-5 self-center text-md align-middle'>
                                                <div className='flex flex-row mx-2'>
                                                    <div>{request.username}</div>
                                                </div>
                                            </div>
                                            <button className="h-auto px-4 mb-4 text-xs bg-white bg-opacity-5 hover:bg-emerald-800" onClick={() => updateRequestStatus(request.id, true)}>
                                                <img className='w-4' src={checkmarkPNG} alt="accept"></img>
                                            </button>
                                            <button className="h-auto px-4 mb-4 rounded-r text-xs bg-white bg-opacity-5 hover:bg-red-900" onClick={() => updateRequestStatus(request.id, false)}>
                                                X
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Friends;