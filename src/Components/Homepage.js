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
import { getCurrentChallenges, updateChallengeProgress } from '../Utils/challengeUtils'

const Homepage = ({ session, theme, setTheme }) => {
  const [loading, setLoading] = useState(true)
  const [errorTimeout, setErrorTimeout] = useState(null)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState(null)
  const [status, setStatus] = useState(STATUS.OFFLINE)
  const [level, setLevel] = useState(null)
  const [xp, setXP] = useState(0)
  const [challenges, setChallenges] = useState({})
  const [selectedList, setSelectedList] = useState(null)
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState([])
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

  const handleListClick = async (index, id, list) => {
    if (selectedList !== null && (index === selectedList.index || id === selectedList.id)) return
    setSelectedList(list)
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
      await fetchLists()
      await fetchChallenges()
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
        setSelectedList(null)
        return
      }
      // check for missing list indices (old users or other misc errors)
      const missingIndices = data.filter((list) => list.index === null)
      const hasDuplicateIndices = new Set(data.map((list) => list.index)).size < data.length
      if (missingIndices.length) {
        let listUpdates = []
        if (missingIndices.length === data.length || hasDuplicateIndices) {
          // set indicies in order of data ids
          data.forEach((list, index) => { list.index = index })
          listUpdates = data
        }
        else {
          // set missing indices to follow existing indices
          const existingIndices = data.filter((list) => list.index !== null)
          let nextIndex = 0
          if (existingIndices.length) {
            nextIndex = existingIndices.sort((a, b) => a.index - b.index)[existingIndices.length-1].index + 1
          }
          missingIndices.forEach((list, index) => { list.index = nextIndex + index })
          // scale the indices down if there are any gaps (e.g. 0 2 3 or 1 2 3)
          const newData = existingIndices.concat(missingIndices)
          const needsScaleDown = newData[0].index !== 0 || newData[0].index + newData.length - 1 !== newData[newData.length-1].index
          if (needsScaleDown) {
            newData.forEach((list, index) => { list.index = index })
          }
          data = newData
          listUpdates = needsScaleDown ? newData : missingIndices
        }
        // save changes
        for (const list of listUpdates) {
          const { data: updatedData, error: updatedError } = await supabase  // eslint-disable-line
            .from('lists')
            .update({ index: list.index })
            .eq('id', list.id)
            .eq('user_id', user.id)
          if (updatedError) throw updatedError
        }
      }
      data.sort((a, b) => a.index - b.index)
      setLists(data)
      if (selectedList === null) {
        setSelectedList(data[0])
        fetchItems(data[0].id)
      } else {
        const selectedIndex = data.findIndex((list) => list.id === selectedList.id)
        if (selectedIndex === -1) {
          // outdated selectedList
          setSelectedList(data[0])
          fetchItems(data[0].id)
          return
        }
        fetchItems(data[selectedIndex].id)
      }
    } catch (error) {
      handleError(error.error_description || error.message)
      return
    }
  }

  const fetchChallenges = async () => {
    const { user } = session
    const currentChallenges = await getCurrentChallenges(user)
    setChallenges(currentChallenges)
  }

  const updateChallenges = async (xpEarned, workBreakPair) => {
    const { user } = session
    const { xpGained, updatedChallenges } = await updateChallengeProgress(user, xpEarned, workBreakPair)
    if (updatedChallenges) {
      setChallenges(updatedChallenges)
    }
    return xpGained
  }

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
                <Navigation theme={theme} setTheme={setTheme} session={session} username={username} status={status} level={level} xp={xp} challenges={challenges} handleStatusUpdate={handleStatusUpdate} handleError={handleError}/>
                <Box component="main" sx={{ padding: 3, overflow: 'auto', marginTop:"80px" }}>
                  {error && <Alert variant='outlined' severity='error' sx={{ width:"30%", marginY:2, marginX:"auto" }}>{error}</Alert>}
                  <Session session={session} setInSessionView={setInSessionView} activeListName={selectedList.name} updateChallenges={updateChallenges}/>
                  <ItemCard theme={theme} session={session} lists={lists} items={items} listId={selectedList.id} updateItems={fetchItems} handleError={handleError}/>
                </Box>
              </div>
            :
              <div>
                <Navigation theme={theme} setTheme={setTheme} session={session} username={username} status={status} level={level} xp={xp} challenges={challenges} handleStatusUpdate={handleStatusUpdate} handleError={handleError}/>
                {error && <Alert variant='outlined' severity='error' sx={{ width:"50%", marginTop:"120px", marginX:"auto" }}>{error}</Alert>}
                <Box component="main" sx={{ padding: 3, overflow: 'auto', marginTop: error ? "0px" : "80px" }}>
                  <Box sx={{ display:"flex", flexDirection:"row", flexWrap:'wrap', }}>
                    <ListCard theme={theme} session={session} lists={lists} setLists={setLists} updateLists={fetchLists} selectedList={selectedList} handleListClick={handleListClick} handleSessionClick={handleSessionClick} handleError={handleError}/>
                    <ItemCard theme={theme} session={session} lists={lists} items={items} listId={selectedList.id} updateItems={fetchItems} handleError={handleError}/>
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