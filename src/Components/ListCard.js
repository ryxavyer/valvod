import { useState } from "react"
import { supabase } from "../supabaseClient"
// import WarningIcon from '@mui/icons-material/Warning'
import StartIcon from '@mui/icons-material/Start'
import { getThemeObject } from "../Utils/themeUtils"
import { Alert, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material"
import { DEFAULT_MSG_LENGTH } from "../Utils/errorUtils"
import { Edit } from "@mui/icons-material"

const ListCard = ({ theme, session, lists, listWarnings, updateLists, selectedIndex, setSelectedIndex, handleListClick, handleSessionClick }) => {
    const [newList, setNewList] = useState("")
    const [errorTimeout, setErrorTimeout] = useState(null)
    const [error, setError] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [modalList, setModalList] = useState({})
    const themeObject = getThemeObject(theme)
    const themePrimary = themeObject.palette.primary[500]
    const themeSecondary = themeObject.palette.secondary.main

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

    const updateNewList = (e) => {
        const input = (e.target.value).toString()
        setNewList(input)
    }

    const saveNewList = async (e) => {
        e.preventDefault()
        const cleanedList = newList.trim()
        if (cleanedList === "") {
            handleError("You must give new lists a name")
            return
        }
        try {
            const { user } = session
            const { error } = await supabase
                .from('lists')
                .insert([
                    { user_id: user.id, name: cleanedList },
                ])
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }

        setNewList("")
        updateLists()
    }

    const openEditModal = (list) => {
        setEditModalOpen(true)
        setModalList(list)
        setNewName(list.name)
    }
    
    const handleNewNameSave = (id) => {
        updateListName(id)
        setEditModalOpen(false)
    }

    const handleDeleteModalOpen = () => {
        setEditModalOpen(false)
        setDeleteModalOpen(true)
    }

    const handleDeleteModalConfirm = (id) => {
        deleteList(id)
        setDeleteModalOpen(false)
    }

    const updateListName = async (id) => {
        const cleanedNewName = newName.trim()
        try {
            const { error } = await supabase
                .from("lists")
                .update({name: cleanedNewName})
                .eq("id", id)
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }
        updateLists()
    }

    const deleteList = async (id) => {
        try {
            const { error } = await supabase
                .from('lists')
                .delete()
                .eq('id', id)
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        }
        updateLists()
    }

    const updateNewName = (e) => {
        const input = (e.target.value).toString()
        setNewName(input)
    }

    return (
        <div className="mx-auto w-full md:w-1/3 lg:w-1/4 2xl:w-1/4">
            {error && <Alert variant='outlined' severity='error' sx={{ width:"100%", marginY:2, marginX:"auto" }}>{error}</Alert>}
            <form onSubmit={(e) => saveNewList(e)} className="flex flex-row">
                <TextField size="small" variant="standard" fullWidth autoComplete="off"
                           label='Add a list' value={newList} onChange={(e) => updateNewList(e)}
                           sx={{ '& .MuiInputLabel-root': {
                                    fontSize:"14px",
                                } 
                            }}>
                </TextField>
                <button type='submit' hidden title="Add List" className="w-10 bg-transparent px-2 self-center text-center text-lg text-white">{'+'}</button>
            </form>
            <div className="flex flex-col">
                {lists.map((list, index) => {
                    return (
                        <div className="mb-2" key={`${list.id}_div`}>
                            <div className='flex flex-row justify-end w-full'>
                                <Card sx={{ display:"flex", cursor:"pointer", boxShadow:"none", borderRadius:"0px", minWidth:"50px", maxWidth:"1000px", width:"100%", overflowWrap:true, backgroundColor:index === selectedIndex ? themePrimary : themeSecondary, backgroundImage:"none" }} key={list.id} onClick={() => handleListClick(index, list.id)}>
                                    <Typography sx={{ paddingX:"8px", paddingY:"10px", minWidth:"25px", maxWidth:"950px", width:"100%", overflowWrap:"break-word", }}>{list.name}</Typography>
                                </Card>
                                {/* {list.id in listWarnings &&
                                    <div>
                                        <WarningIcon style={{ height:"100%", fontSize:"16px", paddingRight:"2px", color:themeObject.palette.warning.main, backgroundColor:index === selectedIndex ? themePrimary : themeSecondary, }}/>
                                    </div>
                                } */}
                                <div>
                                    <Button title="Start Session" sx={{ minWidth:"20px", height:"100%", borderRadius:"0px", backgroundColor:index === selectedIndex ? themePrimary : themeSecondary, color:"#fff", transition:"none"}} onClick={() => handleSessionClick(index, list.id)}>
                                        <StartIcon style={{ fontSize:"18px", marginRight:"0px" }}/>
                                    </Button>
                                </div>
                                <div>
                                    <Button title="Edit List" sx={{ minWidth:"30px", height:"100%", borderRadius:"0px", backgroundColor:index === selectedIndex ? themePrimary : themeSecondary, color:"#fff", transition:"none"}} onClick={() => openEditModal(list)}>
                                        <Edit fontSize="12px"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <Dialog sx={{'& .MuiDialog-paper': {minWidth: "450px",}}} open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                    <DialogTitle>Editing "{modalList.name}"</DialogTitle>
                    <DialogContent>
                        <TextField variant="standard" fullWidth autoComplete="off" label="List Name" value={newName} onChange={(e) => updateNewName(e)}></TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="success" disableElevation disabled={modalList.name === newName || newName.trim() === ""} onClick={() => handleNewNameSave(modalList.id)}>Save Changes</Button>
                        <Button variant="outlined" color="error" disableElevation onClick={() => handleDeleteModalOpen()}>Delete This List</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                    <DialogTitle>Are you sure you want to delete "{modalList.name}"?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            This action will delete the list and all associated items. You will not be able to undo it at this time.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" disableElevation onClick={() => setDeleteModalOpen(false)}>Save My List</Button>
                        <Button variant="outlined" color="error" disableElevation onClick={() => handleDeleteModalConfirm(modalList.id)}>Yes I'm Sure</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )

}

export default ListCard;