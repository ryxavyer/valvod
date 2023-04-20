import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import { getTimeToDisplay } from '../../Utils/dateUtils'
import { DEFAULT_MSG_LENGTH } from '../../Utils/errorUtils'
import { Alert, Badge, Button, Card, CardContent, Divider, Menu, Typography } from '@mui/material'

const Updates = ({ session }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [hasUnread, setHasUnread] = useState(false)
    const [errorTimeout, setErrorTimeout] = useState(null)
    const [error, setError] = useState(null)
    const [updates, setUpdates] = useState([])
    const [unreadUpdates, setUnreadUpdates] = useState(0)

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
                setUnreadUpdates(updates.filter((u) => new Date(u.created_at) > lastSeenDate).length)
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

    const handleOpen = (e) => {
        if (hasUnread && !isOpen === true) {
            updateLastSeen()
            setHasUnread(false)
        }
        setIsOpen(!isOpen)
        setAnchorEl(e.currentTarget)
    }

    const updatesListener = supabase  // eslint-disable-line
        .channel('public:updates')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table:'updates' }, fetchUpdates)
        .subscribe()


    return (
        <div>
            <Badge badgeContent={unreadUpdates} color="unread" invisible={!hasUnread}
                   sx={{'& .MuiBadge-badge': { top:10, right:10, }, }}>
                <Button title="Updates" onClick={(e) => handleOpen(e)}
                        sx={{ minWidth:"50px" }}
                >
                    <NewReleasesIcon sx={{ fontSize:"30px" }}/>
                </Button>
            </Badge>
            <Menu open={isOpen} anchorEl={anchorEl} onClose={() => setIsOpen(false)}
                    sx={{ maxWidth:"1000px", top:"10px",
                        '& .MuiList-root': {
                            paddingTop:"0px", paddingBottom:"0px", 
                        }  
                        }}
            >
                {error &&
                    <Card sx={{ width:"400px", }}>
                        <Alert variant="outlined" severity='error' sx={{ margin:2, }}>{error}</Alert>
                    </Card>
                }
                {updates.map((update, index) => {
                    return (
                        <div key={`update_${index}_div`}>
                            <Card key={`update_${index}_card`} sx={{ width:"400px", paddingBottom:"4px" }}>
                                <CardContent key={`update_${index}_content`}>
                                        <Typography sx={{ fontSize:"14px" }} key={`update_${index}_text`}>
                                            {update.update}
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ fontSize:"12px", float:"right" }} key={`update_${index}_date`}>
                                            {getTimeToDisplay(update.created_at)}
                                        </Typography>
                                </CardContent>
                            </Card>
                            {index !== updates.length-1 ? <Divider/> : ""}
                        </div>
                    )})}
            </Menu>
        </div>
    )

}

export default Updates;