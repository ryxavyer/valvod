import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { STATUS, changeStatus } from '../Utils/status'
import ErrorMessage from './ErrorMessage'
import Navigation from './NavigationComponents/Navigation'
import CreateUsername from './CreateUsername'
import ListCard from './ListCard'
import ItemCard from './ItemCard'
import Friends from './Friends'
import { DEFAULT_MSG_LENGTH, NO_SESSION_ERROR } from '../Utils/errorUtils'
import LoadingSpinner from './LoadingSpinner'
import Session from './Session'

const Homepage = ({ session }) => {
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
  const [inSessionView, setInSessionView] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, []) // eslint-disable-line

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

  const handleListClick = (index, id) => {
    if (index === selectedIndex || id === selectedListId) return
    setSelectedIndex(index)
    setSelectedListId(id)
    fetchItems(id)
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
      setUsername(data.username)
      setLevel(data.level)
      setXP(data.xp)
      fetchLists()
    } catch (error) {
        setError(error.error_description || error.message)
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
      {loading ? <LoadingSpinner divHeight={"screen"} spinnerSize={"24"}/> 
      :
        <div>
          {!username ? 
            <CreateUsername session={session} setUsername={setUsername}/> 
          :
          <div>
            {inSessionView ? 
              <div>
                <Navigation session={session} username={username} status={status} level={level} xp={xp} handleStatusUpdate={handleStatusUpdate} setError={setError}/>
                <Session session={session} setInSessionView={setInSessionView} activeListName={lists[selectedIndex].name}/>
                <ItemCard session={session} lists={lists} items={items} listId={selectedListId} updateItems={fetchItems} handleError={handleError}/>
              </div>
             :
              <div>
                <Navigation session={session} username={username} status={status} level={level} xp={xp} handleStatusUpdate={handleStatusUpdate} setError={setError}/>
                {lists.length !== 0 && items.length !== 0 &&
                  <button className="w-full mb-4 h-12 self-center text-sm rounded bg-white bg-opacity-5 hover:bg-opacity-10 focus:outline-white" onClick={() => setInSessionView(true)}>
                    Start a Session
                  </button>
                }
                {error && <ErrorMessage error={error}/>}
                <div className='flex flex-col mx-auto md:flex-row md:max-w-[1200px]'>
                  <ListCard session={session} lists={lists} updateLists={fetchLists} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} handleListClick={handleListClick} handleError={handleError}/>
                  <ItemCard session={session} lists={lists} items={items} listId={selectedListId} updateItems={fetchItems} handleError={handleError}/>
                  <Friends session={session} handleError={handleError}/>
                </div>
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