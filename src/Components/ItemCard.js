import { useState } from "react"
import { supabase } from "../supabaseClient"
import dayjs from 'dayjs';
import Item from "./Item"
import { DateTimePicker } from "@mui/x-date-pickers"
import { Alert, TextField } from "@mui/material"
import { DEFAULT_MSG_LENGTH } from "../Utils/errorUtils";

const ItemCard = ({ theme, session, lists, items, listId, updateItems }) => {
    const [newItem, setNewItem] = useState("")
    const [dueDate, setDueDate] = useState(null)
    const [errorTimeout, setErrorTimeout] = useState(null)
    const [error, setError] = useState(null)

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

    const updateNewItem = (e) => {
        const input = (e.target.value).toString()
        setNewItem(input)
    }

    const saveNewItem = async (e) => {
        e.preventDefault()
        const cleanedItem = newItem.trim()
        const cleanedDueDate = dueDate ? dayjs(dueDate).toISOString() : null
        if (cleanedItem === "") {
            handleError("You must give new items a name")
            return
        }
        try {
            const { user } = session
            const { error } = await supabase
                .from('items')
                .insert([
                    { user_id: user.id, list_id: listId, task: cleanedItem, due_date: cleanedDueDate },
                ])
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }

        setNewItem("")
        setDueDate(null)
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

    const dueDateCompareFn = (item1, item2) => { 
        if (!item1.due_date && !item2.due_date) {
            return new Date(item1.created_at) < new Date(item2.created_at) ? -1 : 1
        }
        if (!item1.due_date) {
            return 1
        }
        if (!item2.due_date) {
            return -1
        }
        if (new Date(item1.due_date) < new Date(item2.due_date)) {
            return -1
        }
        if (new Date(item1.due_date) > new Date(item2.due_date)) {
            return 1
        }

        return new Date(item1.created_at) < new Date(item2.created_at) ? -1 : 1
    }

    return (
        <div className="mx-auto w-full md:w-1/2 lg:w-1/2">
            {error && <Alert variant='outlined' severity='error' sx={{ width:"100%", marginY:2, marginX:"auto" }}>{error}</Alert>}
            <form onSubmit={(e) => saveNewItem(e)} className="flex flex-row">
                <TextField disabled={lists.length === 0} size="small" variant="standard" fullWidth autoComplete="off" id="item_card_text_input"
                           label={lists.length === 0 ? 'You must have lists to add items' : 'Add an item'} value={newItem} onChange={(e) => updateNewItem(e)}
                           sx={{ marginRight:"4px", 
                                 '& .MuiInputLabel-root': {
                                fontSize:"14px",
                            } 
                        }}>
                </TextField>
                <DateTimePicker
                    disabled={lists.length === 0}
                    renderInput={(props) => <TextField size="small" variant="standard" autoComplete="off"
                    sx={{ marginLeft:"4px", width:"325px", 
                          '& .MuiInputLabel-root': {
                            fontSize:"14px",
                          }  
                    }} {...props}/>}
                    label="Add a Due Date"
                    disablePast
                    value={dueDate}
                    onChange={(newValue) => {
                        setDueDate(newValue)
                    }}
                    onAccept={(newDate) => {
                        setTimeout(() => {
                            document.getElementById("item_card_text_input").focus()
                        }, 300)
                    }}
                />
                <button type='submit' hidden className="w-12 bg-transparent px-2 self-center text-center text-white text-lg text-opacity-100" title="Add Item">{'+'}</button>
            </form>
            <div className="flex flex-col">
                {items.sort(dueDateCompareFn).map((item) => {
                    return <Item theme={theme} session={session} item={item} deleteItem={deleteItem} handleError={handleError} key={item.id}/>
                })}
            </div>
        </div>
    )

}

export default ItemCard;