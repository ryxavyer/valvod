import { useState } from "react"
import { supabase } from "../supabaseClient"
import checkmarkPNG from "../static/checkmark.png"

const ItemCard = ({ session, lists, items, listId, updateItems, setError }) => {
    const [newItem, setNewItem] = useState('')

    const updateNewItem = (e) => {
        setNewItem(e.target.value)
    }

    const saveNewItem = async (e) => {
        e.preventDefault()
        if (newItem === '') {
            setError("You must give new items a name")
            return
        }
        try {
            const { user } = session
            const { error } = await supabase
                .from('items')
                .insert([
                    { user_id: user.id, list_id: listId, task: newItem },
                ])
            if (error) throw error
        } catch (error) {
            setError(error.error_description || error.message)
            return
        }

        setNewItem('')
        updateItems(listId)
    }

    const deleteItem = async (id) => {
        try {
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', id)
            if (error) throw error
        } catch (error) {
            setError(error.error_description || error.message)
            return
        }

        updateItems(listId)
    }

    return (
        <div className='flex flex-col w-4/6 mx-auto my-8 md:w-3/4 md:px-4 lg:w-1/2'>
            {lists.length !== 0 &&
                <form onSubmit={saveNewItem} className="flex flex-row">
                    <input className="bg-transparent w-full border-b-2 self-center py-1 placeholder:text-white placeholder:text-sm focus:outline-none placeholder:opacity-50" placeholder='Add an item...' value={newItem} onChange={(e) => updateNewItem(e)}></input>
                    <button type='submit' hidden className="w-1 rounded-lg bg-routyneGold self-center py-2 hover:bg-routyneGoldLight">CREATE</button>
                </form>
            }
            <div className="flex flex-col">
                {items.map((item) => {
                    return (
                        <div className="flex flex-row mb-2" key={`${item.id}_div`}>
                            <div className='bg-itemColor rounded-sm w-full p-2.5 focus:outline-none' key={item.id}>
                                {item.task}
                            </div>
                            <button className="h-full rounded-sm text-xs bg-white bg-opacity-5 self-center p-4 hover:bg-emerald-800" key={`${item.id}_button`} onClick={() => deleteItem(item.id)}>
                                <img className='w-4' src={checkmarkPNG} alt="Mark complete"></img>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default ItemCard;