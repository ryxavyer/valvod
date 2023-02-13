import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { STATUS, changeStatus } from '../Utils/status'
import Navigation from './NavigationComponents/Navigation'
import CreateUsername from './CreateUsername'
import ListCard from './ListCard'
import ItemCard from './ItemCard'
import Friends from './Friends'
import { DEFAULT_MSG_LENGTH, NO_SESSION_ERROR } from '../Utils/errorUtils'
import LoadingSpinner from './LoadingSpinner'
import Session from './Session'
import { Alert, Box } from '@mui/material'

const Homepage = ({ session, theme, setTheme }) => {
  const [loading, setLoading] = useState(true)
  const [errorTimeout, setErrorTimeout] = useState(null)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState(null)
  const [status, setStatus] = useState(STATUS.OFFLINE)
  const [level, setLevel] = useState(null)
  const [xp, setXP] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedListId, setSelectedListId] = useState(null)
  const [lists, setLists] = useState([])
  const [items, setItems] = useState([])
  // const [listWarnings, setListWarnings] = useState({})
  const [inSessionView, setInSessionView] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, []) // eslint-disable-line

  // this is not very consistent
  window.addEventListener('beforeunload', () => {
    handleStatusUpdate(STATUS.OFFLINE)
  })

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

  const handleStatusUpdate = (status) => {
    const { user } = session
    setStatus(status)
    changeStatus(user, status)
  }

  const handleListClick = async (index, id) => {
    if (index === selectedIndex || id === selectedListId) return
    setSelectedIndex(index)
    setSelectedListId(id)
    await fetchItems(id)
  }

  const handleSessionClick = async (index, id) => {
    await handleListClick(index, id)
    setInSessionView(true)
  }

  const fetchUserInfo = async () => {
    const { user } = session
    setLoading(true)
    try {
        if (!user) throw Error(NO_SESSION_ERROR)

        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

      if (error) throw error

      handleStatusUpdate(STATUS.ONLINE)
      setTheme(data.chosen_theme)
      setUsername(data.username)
      setLevel(data.level)
      setXP(data.xp)
      fetchLists()
    } catch (error) {
        handleError(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchLists = async () => {
    const { user } = session
    try {
      if (!user) throw Error(NO_SESSION_ERROR)

      let { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      if (!data.length) {
        setLists([])
        setItems([])
        setSelectedIndex(0)
        setSelectedListId(null)
        return
      }

      setLists(data)
      // getListWarnings(data)
      if (selectedListId === null || data[selectedIndex] === undefined) {
        setSelectedIndex(0)
        setSelectedListId(data[0].id)
        fetchItems(data[0].id)
      } else {
        fetchItems(data[selectedIndex].id)
      }
    } catch (error) {
      handleError(error.error_description || error.message)
      return
    }
  }

  // const getListWarnings = async (listData) => {
  //   const listIds = listData.map((l) => l.id)
  //   try{
  //     let { data, error } = await supabase
  //       .from('items')
  //       .select('list_id, due_date')
  //       .in('list_id', listIds)

  //     if (error) throw error
      
  //     const warnings = {}
  //     const twoDaysFromNow = new Date(new Date().getTime()+(2*24*60*60*1000))
  //     data.forEach((i, index) => {
  //       if (i.due_date && new Date(i.due_date) <= twoDaysFromNow) {
  //         warnings[i.list_id] = true
  //       }
  //     })
  //     setListWarnings(warnings)
  //   }
  //   catch (error) {
  //     handleError(error.error_description || error.message)
  //     return
  //   }
  // }

  const fetchItems = async (listId) => {
    const { user } = session
    try {
      if (!user) throw Error(NO_SESSION_ERROR)

      let { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .eq('list_id', listId)

      if (error) throw error

      if (!data.length) {
        setItems([])
        return
      }
      setItems(data)
    } catch (error) {
        handleError(error.error_description || error.message)
        return
    }
  }

  return (
    <div>
      {loading ? <LoadingSpinner divHeight={"screen"} spinnerSize={"12"}/> 
      :
        <div>
          {!username ? 
            <CreateUsername session={session} setUsername={setUsername}/> 
          :
          <div>
            {inSessionView ? 
              <div>
                <Navigation theme={theme} setTheme={setTheme} session={session} username={username} status={status} level={level} xp={xp} handleStatusUpdate={handleStatusUpdate} handleError={handleError}/>
                <Box component="main" sx={{ padding: 3, overflow: 'auto', marginTop:"80px" }}>
                  {error && <Alert variant='outlined' severity='error' sx={{ width:"30%", marginY:2, marginX:"auto" }}>{error}</Alert>}
                  <Session session={session} setInSessionView={setInSessionView} activeListName={lists[selectedIndex].name}/>
                  <ItemCard theme={theme} session={session} lists={lists} items={items} listId={selectedListId} updateItems={fetchItems} handleError={handleError}/>
                </Box>
              </div>
             :
              <div>
                <Navigation theme={theme} setTheme={setTheme} session={session} username={username} status={status} level={level} xp={xp} setInSessionView={setInSessionView} handleStatusUpdate={handleStatusUpdate} handleError={handleError}/>
                <Box component="main" sx={{ padding: 3, overflow: 'auto', marginTop:"80px" }}>
                  <Box sx={{ display:"flex", flexDirection:"row", flexWrap:'wrap', }}>
                    {error && <Alert variant='outlined' severity='error' sx={{ width:"30%", marginY:2, marginX:"auto" }}>{error}</Alert>}
                    <ListCard theme={theme} session={session} lists={lists} updateLists={fetchLists} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} handleListClick={handleListClick} handleSessionClick={handleSessionClick} handleError={handleError}/>
                    <ItemCard theme={theme} session={session} lists={lists} items={items} listId={selectedListId} updateItems={fetchItems} handleError={handleError}/>
                    <Friends theme={theme} session={session} handleError={handleError}/>
                  </Box>
                </Box>
              </div>
            }
          </div>
          }
        </div>
      }
    </div>
  )
}

export default Homepage