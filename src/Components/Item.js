import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import CheckIcon from '@mui/icons-material/Check'
import { Button, Card, TextField, Typography } from "@mui/material"
import { getThemeObject } from "../Utils/themeUtils"
import { Add } from "@mui/icons-material"

const Item = ({ theme, session, item, deleteItem, handleError }) => {
    const [subitems, setSubitems] = useState([])
    const [subitemFormOpen, setSubitemFormOpen] = useState(false)
    const [newSubitem, setNewSubitem] = useState("")
    const themeObject = getThemeObject(theme)
    const themeSecondary = themeObject.palette.secondary.main

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
            <div className="flex flex-col mb-2">
                <div className='flex flex-row justify-end w-full'>
                    <Card sx={{ display:"flex", boxShadow:"none", borderRadius:"0px", minWidth:"200px", maxWidth:"1000px", width:"100%", overflowWrap:true, backgroundColor:themeSecondary, backgroundImage:"none" }} key={`${item.id}_task_div`}>
                        <Typography sx={{ paddingX:"8px", paddingY:"10px", minWidth:"150px", maxWidth:"950px", width:"100%", overflowWrap:"break-word", }}>{item.task}</Typography>
                    </Card>
                    <div>
                        <Button title="Add sub-items" sx={{ minWidth:"40px", height:"100%", borderRadius:"0px", backgroundColor:themeSecondary, color:"#fff", transition:"none"}} onClick={() => handleFormOpen()}>
                            <Add style={{ fontSize:"18px", marginRight:"0px" }}/>
                        </Button>
                    </div>
                    <div>
                        <Button title="Mark Complete" sx={{ minWidth:"50px", height:"100%", borderRadius:"0px", backgroundColor:themeSecondary, color:"#fff", transition:"none"}} onClick={() => deleteItem(item.id)}>
                            <CheckIcon style={{ fontSize:"16px"}}/>
                        </Button>
                    </div>
                </div>
                {item.due_date &&
                    <div className="flex">
                        <Typography color="text.secondary" sx={{ fontSize:"12px", }} key={`${item.id}_date_text`}>
                            {`${new Date(item.due_date).toLocaleDateString()} @ ${new Date(item.due_date).toLocaleTimeString()}`}
                        </Typography>
                    </div>
                }
            </div>
            <div className="flex flex-col ml-8" key={`${item.id}_subitems_div`}>
                {subitemFormOpen && 
                    <form onSubmit={(e) => saveNewSubitem(e)} className="flex flex-row">
                        <TextField id={`${item.id}_newSubitemInput`} size="small" variant="standard" fullWidth
                           label='Add a sub-item' value={newSubitem} onChange={(e) => updateNewSubitem(e)}
                           sx={{ '& .MuiInputLabel-root': {
                                    fontSize:"14px",
                                } 
                            }}>
                        </TextField>
                        <button type='submit' hidden className="w-12 bg-transparent px-2 pt-2.5 self-center text-center text-white text-opacity-100" title="Add item">{'↵'}</button>
                    </form>
                }
                {subitems.map((subitem) => {
                    return (
                        <div className='flex flex-row mb-2 justify-end w-full' key={`${item.id}_task_div`}>
                            <Card sx={{ display:"flex", boxShadow:"none", borderRadius:"0px", minWidth:"200px", maxWidth:"1000px", width:"100%", overflowWrap:true, backgroundColor:themeSecondary, backgroundImage:"none" }} key={`${item.id}_task_card`}>
                                <Typography sx={{ paddingX:"8px", paddingY:"10px", minWidth:"400px", maxWidth:"450px", overflowWrap:"break-word", }}>{subitem.task}</Typography>
                            </Card>
                            <div>
                                <Button title="Mark Complete" key={`${subitem.id}_button`} sx={{ minWidth:"50px", height:"100%", borderRadius:"0px", backgroundColor:themeSecondary, color:"#fff", transition:"none"}} onClick={() => deleteSubitem(subitem.id)}>
                                    <CheckIcon style={{ fontSize:"16px"}}/>
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Item;