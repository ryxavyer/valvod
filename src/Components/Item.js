import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import CheckmarkPNG from "../static/checkmark.png"

const Item = ({ session, item, deleteItem, handleError }) => {
    const [subitems, setSubitems] = useState([])
    const [subitemFormOpen, setSubitemFormOpen] = useState(false)
    const [newSubitem, setNewSubitem] = useState("")

    useEffect(() => {
        fetchSubitems()
    }, [])  // eslint-disable-line

    const updateNewSubitem = (e) => {
        const input = (e.target.value).toString()
        setNewSubitem(input)
    }

    const handleFormOpen = () => {
        setSubitemFormOpen(!subitemFormOpen)
        if (!subitemFormOpen) {
            setTimeout(() => {
                document.getElementById(`${item.id}_newSubitemInput`).focus()
            }, 300)
        }
    }

    const fetchSubitems = async () => {
        try {    
            const { user } = session
            let { data, error } = await supabase
                .from('subitems')
                .select('*')
                .eq('user_id', user.id)
                .eq('item_id', item.id)
        
            if (error) throw error
        
            if (!data.length) {
                setSubitems([])
                return
            }
            setSubitems(data)
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }
    }

    const saveNewSubitem = async (e) => {
        e.preventDefault()
        const cleanedSubitem = newSubitem.trim()
        if (cleanedSubitem === "") {
            handleError("You must give new sub-items a name")
            return
        }
        try {
            const { user } = session
            const { error } = await supabase
                .from('subitems')
                .insert([
                    { user_id: user.id, item_id: item.id, task: cleanedSubitem },
                ])
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }
        setNewSubitem("")
        fetchSubitems()
    }

    const deleteSubitem = async (id) => {
        try {
            const { error } = await supabase
                .from('subitems')
                .delete()
                .eq('id', id)
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }
        fetchSubitems(item.id)
    }
    
    return (
        <div className="flex flex-col" key={`${item.id}_outer_div`}>
            <div className={`flex flex-row mt-2`} key={`${item.id}_item_div`}>
                <div className='bg-itemColor rounded-l-sm w-full p-2.5 focus:outline-none' key={`${item.id}_task_div`}>
                    {item.task}
                </div>
                <div className="flex flex-row" key={`${item.id}_buttons_div`}>
                    <button className="h-full rounded-r-sm text-md bg-white bg-opacity-5 self-center py-2 px-4 hover:bg-opacity-10" key={`${item.id}_subitem_button`} title="Add sub-items" onClick={() => handleFormOpen()}>
                        +
                    </button>
                    <button className="h-full rounded-r-sm bg-white bg-opacity-5 self-center py-2 px-4 hover:bg-emerald-800" key={`${item.id}_delete_button`} title="Mark Complete" onClick={() => deleteItem(item.id)}>
                        <img className="w-8" src={CheckmarkPNG} alt="Mark Complete" key={`${item.id}_checkmark`}></img>
                    </button>
                </div>
            </div>
            <div className="flex flex-col ml-8" key={`${item.id}_subitems_div`}>
                {subitemFormOpen && 
                    <form onSubmit={(e) => saveNewSubitem(e)} className="flex flex-row">
                        <input id={`${item.id}_newSubitemInput`} autoComplete="off" className="bg-transparent w-full self-center pt-2 placeholder:text-white placeholder:text-sm focus:outline-none placeholder:opacity-50" placeholder={'Add a sub-item'} value={newSubitem} onChange={(e) => updateNewSubitem(e)}></input>
                        <button type='submit' className="w-12 bg-transparent px-2 pt-2.5 self-center text-center text-white text-opacity-100" title="Add item">{'↵'}</button>
                    </form>
                }
                {subitems.map((subitem) => {
                    return (
                        <div className="flex flex-row mt-2" key={`${subitem.id}_div`}>
                            <div className='bg-itemColor rounded-l-sm w-full p-2.5 focus:outline-none' key={`${subitem.id}_task_div`}>
                                {subitem.task}
                            </div>
                            <div key={`${subitem.id}_buttons_div`}>
                                <button className="h-full rounded-r-sm bg-white bg-opacity-5 self-center py-2 px-4 hover:bg-emerald-800" key={`${subitem.id}_button`} title="Mark Complete" onClick={() => deleteSubitem(subitem.id)}>
                                    <img className="w-[18px]" src={CheckmarkPNG} alt="Mark Complete" key={`${subitem.id}_checkmark`}></img>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Item;