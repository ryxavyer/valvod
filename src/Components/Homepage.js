import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { STATUS, changeStatus } from '../status'
import ErrorMessage from './ErrorMessage'
import Navigation from './NavigationComponents/Navigation'
import CreateUsername from './CreateUsername'
import ListCard from './ListCard'
import ItemCard from './ItemCard'
import Friends from './Friends'

const Homepage = ({ session }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [status, setStatus] = useState(STATUS.OFFLINE)
  const [level, setLevel] = useState(null)
  const [xp, setXP] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedListId, setSelectedListId] = useState(null)
  const [lists, setLists] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchUserInfo()
  }, []) // eslint-disable-line

  const handleError = (error) => {
    setError(error)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  const handleStatusUpdate = (status) => {
    const { user } = session
    setStatus(status)
    changeStatus(user, status)
  }

  const handleListClick = (index, id) => {
    setSelectedIndex(index)
    setSelectedListId(id)
    fetchItems(id)
  }

  const fetchUserInfo = async () => {
    const { user } = session
    setLoading(true)
    try {
        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

      if (error) throw error

      if (data) {
          handleStatusUpdate(STATUS.ONLINE)
          setUsername(data.username)
          setLevel(data.level)
          setXP(data.xp)
          fetchLists()
      }
    } catch (error) {
        setError(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchLists = async () => {
    const { user } = session
    setLoading(true)
    try {
      let { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      if (data.length) {
          setLists(data)
          if (selectedListId === null) {
            setSelectedListId(data[0].id)
            fetchItems(data[0].id)
          }
          fetchItems(data[selectedIndex].id)
      }
    } catch (error) {
      setError(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async (listId) => {
    const { user } = session
    setLoading(true)
    try {
      let { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .eq('list_id', listId)

      if (error) throw error

      if (data) {
        setItems(data)
      }
    } catch (error) {
        setError(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {!username ? 
        <CreateUsername session={session} setUsername={setUsername}/> :
        <div>
          <Navigation username={username} status={status} level={level} xp={xp} handleStatusUpdate={handleStatusUpdate} setError={setError}/>
          {error && <ErrorMessage error={error}/>}
          <div className='flex flex-col md:flex-row'>
            <ListCard session={session} lists={lists} updateLists={fetchLists} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} handleListClick={handleListClick} setError={handleError}/>
            <ItemCard session={session} items={items} listId={selectedListId} updateItems={fetchItems} setError={setError}/>
            <Friends session={session}/>
          </div>
        </div>
      }
    </div>
  )
}

export default Homepage