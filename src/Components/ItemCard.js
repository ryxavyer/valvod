import { useState } from "react"
import { supabase } from "../supabaseClient"
import Item from "./Item"

const ItemCard = ({ session, lists, items, listId, updateItems, handleError }) => {
    const [newItem, setNewItem] = useState("")

    const updateNewItem = (e) => {
        const input = (e.target.value).toString()
        setNewItem(input)
    }

    const saveNewItem = async () => {
        const cleanedItem = newItem.trim()
        if (cleanedItem === "") {
            handleError("You must give new items a name")
            return
        }
        try {
            const { user } = session
            const { error } = await supabase
                .from('items')
                .insert([
                    { user_id: user.id, list_id: listId, task: cleanedItem },
                ])
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }

        setNewItem("")
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
            handleError(error.error_description || error.message)
            return
        }

        updateItems(listId)
    }

    return (
        <div className='flex flex-col w-4/6 mx-auto my-8 md:w-3/4 md:px-4 lg:w-1/2'>
            <form onSubmit={(e) => saveNewItem()} className="flex flex-row">
                <input disabled={lists.length === 0} className="bg-transparent w-full self-center placeholder:text-white placeholder:text-sm focus:outline-none placeholder:opacity-50" placeholder={lists.length === 0 ? 'You must have lists to add items' : 'Add an item'} value={newItem} onChange={(e) => updateNewItem(e)}></input>
                <button type='submit' className="w-12 bg-transparent px-2 self-center text-center text-white text-opacity-100" title="Add item">{'↵'}</button>
            </form>
            <div className="flex flex-col">
                {items.map((item) => {
                    return <Item session={session} item={item} deleteItem={deleteItem} handleError={handleError} key={item.id}/>
                })}
            </div>
        </div>
    )

}

export default ItemCard;