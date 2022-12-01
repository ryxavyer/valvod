import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import checkmarkPNG from "../static/checkmark.png"
import { FRIEND_STATUS } from '../Utils/friendStatus'
import SuccessMessage from './SuccessMessage'
import { DEFAULT_MSG_LENGTH, NO_SESSION_ERROR } from '../Utils/errorUtils'
import FriendDiv from './FriendDiv'
import LoadingSpinner from './LoadingSpinner'
import { STATUS } from '../Utils/status'

export const Friends = ({ session, handleError }) => {
    const [loading, setLoading] = useState(false)
    const [messageTimeout, setMessageTimeout] = useState(null)
    const [success, setSuccess] = useState(null)
    const [offlineOpen, setOfflineOpen] = useState(false)
    const [requestsOpen, setRequestsOpen] = useState(false)
    const [friendInput, setFriendInput] = useState("")
    const [onlineFriends, setOnlineFriends] = useState([])
    const [offlineFriends, setOfflineFriends] = useState([])
    const [requests, setRequests] = useState([])

    useEffect(() => {
        setLoading(true)
        fetchFriendsList().then(() => {  
            setupListeners()
            setLoading(false)
        })
    }, []) // eslint-disable-line

    const handleSuccess = (message) => {
        setSuccess(message)
        if (messageTimeout) {
            clearTimeout(messageTimeout)
        }
        setMessageTimeout(setTimeout(() => {
            setSuccess(null)
            }, DEFAULT_MSG_LENGTH)
        )
    }

    const fetchFriendsList = async () => {
        const { user } = session
        try {
            if (!user) throw Error(NO_SESSION_ERROR)

            const friends = await queryFriendships(FRIEND_STATUS.A, false)
            !friends ? setOnlineFriends([]) : setOnlineFriends(friends.filter(friend => friend.status === STATUS.ONLINE || friend.status === STATUS.WORKING))
            !friends ? setOfflineFriends([]) : setOfflineFriends(friends.filter(friend => friend.status === STATUS.OFFLINE))

            const requests = await queryRequests()
            !requests ? setRequests([]) : setRequests(requests)

            return friends
        }
        catch (error) {
            handleError(error.error_description || error.message)
            return
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

    const queryFriendships = async (status, returnFriendships) => {
        // if returnFriendships is true, return a list of friendship records
        // if returnFriendships is false, return a list of user records

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

            if (returnFriendships) {
                return [...requesterFriendshipsData.data, ...requesteeFriendshipsData.data]
            }

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
                const now = new Date()

                // get friendships from db
                const accepted = await queryFriendships(FRIEND_STATUS.A, true)
                const requested = await queryFriendships(FRIEND_STATUS.R, true)
                const declined = await queryFriendships(FRIEND_STATUS.D, true)
                // check for existing accepted friendship
                const existingAccepted = accepted.find(friendship => (friendship.requester_id === requestee.id || friendship.requestee_id === requestee.id))
                if (existingAccepted) throw Error(`You are already friends with ${requestee.username}`)
                // check for existing requested friendship where user is the requester
                const existingRequestSent = requested.find(friendship => friendship.requester_id === user.id && friendship.requestee_id === requestee.id)
                if (existingRequestSent) throw Error(`You have already sent a request to ${requestee.username}`)
                // check for existing requested friendship where user is the requestee
                const doubleSidedRequest = requested.find(friendship => (friendship.requester_id === requestee.id && friendship.requestee_id === user.id))
                if (doubleSidedRequest) {
                    // update in db to accepted
                    const { data, error } = await supabase  // eslint-disable-line
                        .from('friendship')
                        .update({ status: FRIEND_STATUS.A, last_modified: now.toISOString() })
                        .eq('requester_id', requestee.id)
                        .eq('requestee_id', user.id)

                    if (error) throw error

                    handleSuccess("Friend added")
                    setFriendInput("")
                    return
                }
                // check for existing declined friendship and if 5 min has passed since last try
                const existingDeclined = declined.find(friendship => (friendship.requester_id === requestee.id || friendship.requestee_id === requestee.id))
                const fiveMinutesAgo = new Date(now.getTime() - 5*60000)
                const declinedEligible = existingDeclined && (existingDeclined.last_modified <= fiveMinutesAgo)
                if (declinedEligible) {
                    const userIsRequester = existingDeclined.requester_id === user.id
                    // update in db to requested
                    const { data, error } = await supabase  // eslint-disable-line
                        .from('friendship')
                        .update({ status: FRIEND_STATUS.R, last_modified: now.toISOString() })
                        .eq('requester_id', userIsRequester ? user.id : requestee.id)
                        .eq('requestee_id', userIsRequester ? requestee.id : user.id)

                    if (error) throw error

                    handleSuccess("Friend request sent")
                    setFriendInput("")
                    return
                }
                if (!declinedEligible && existingDeclined !== undefined) throw Error("You must wait 5 minutes before sending another request")

                // insert request in db
                const { data, error } = await supabase  // eslint-disable-line
                    .from('friendship')
                    .insert({ requester_id: user.id, requestee_id: requestee.id, status: FRIEND_STATUS.R })

                if (error) throw error

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
            <div>
                <div className='flex flex-col mx-6'>
                    {success && <SuccessMessage message={success}/>}
                    <div>
                        <form className="flex flex-row" onSubmit={(e) => addFriendSubmit(e)}>
                            <input className="bg-transparent w-full self-center placeholder:text-white placeholder:text-sm focus:outline-none placeholder:opacity-50" placeholder='Add a friend by username...' value={friendInput} onChange={(e) => updateFriendInput(e)}></input>
                            <button type='submit' className="w-12 bg-transparent px-2 mb-2 self-center text-center text-white text-opacity-100" title="Add friend">{'↵'}</button>
                        </form>
                    </div>
                </div>
            </div>
            {loading 
                ? <LoadingSpinner divHeight={"16"} spinnerSize={"12"}/> 
                :
                <div>
                    <div className='flex flex-col mx-6'>
                        {onlineFriends.length !== 0 && 
                            onlineFriends.map((friend, index) => {
                                return (
                                    <div key={index}>
                                        <FriendDiv friend={friend}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {offlineFriends.length !== 0 &&
                        <div className='flex flex-col mx-6'>
                            <div className='flex flex-row'>
                                <button className='bg-transparent text-md my-1' onClick={() => setOfflineOpen(!offlineOpen)}>Offline</button>
                                <span className='ml-1 text-xs rounded-lg bg-white bg-opacity-5 px-2 self-center text-center'>{offlineFriends.length}</span>
                            </div>
                            {offlineOpen &&
                                <div>
                                    {offlineFriends.map((friend, index) => {
                                        return (
                                            <div key={index}>
                                                <FriendDiv friend={friend}/>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    }
                    {requests.length !== 0 && 
                        <div className='flex flex-col mx-6'>
                            <div className='flex flex-row'>
                                <button className='bg-transparent text-md my-1' onClick={() => setRequestsOpen(!requestsOpen)}>Requests</button>
                                <span className='ml-1 text-xs rounded-lg bg-white bg-opacity-5 px-2 self-center text-center'>{requests.length}</span>
                            </div>
                            {requestsOpen &&
                                <div>
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
                            }
                        </div>
                    }
                </div>
                }
        </div>
    )
}

export default Friends;