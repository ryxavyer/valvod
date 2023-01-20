import { useState } from "react"
import { supabase } from "../supabaseClient"
// import WarningIcon from '@mui/icons-material/Warning'
import StartIcon from '@mui/icons-material/Start'
import { getThemeObject } from "../Utils/themeUtils"
import { Alert, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material"
import { DEFAULT_MSG_LENGTH } from "../Utils/errorUtils"

const ListCard = ({ theme, session, lists, listWarnings, updateLists, selectedIndex, setSelectedIndex, handleListClick, handleSessionClick }) => {
    const [newList, setNewList] = useState("")
    const [errorTimeout, setErrorTimeout] = useState(null)
    const [error, setError] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteModalList, setDeleteModalList] = useState("")
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

    const openDeleteModal = (list) => {
        setDeleteModalOpen(true)
        setDeleteModalList(list)
    }

    const handleDeleteModalConfirm = (id) => {
        deleteList(id)
        setDeleteModalOpen(false)
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
                                    <Button title="Delete List" sx={{ minWidth:"30px", height:"100%", borderRadius:"0px", backgroundColor:index === selectedIndex ? themePrimary : themeSecondary, color:"#fff", transition:"none"}} onClick={() => openDeleteModal(list)}>
                                        X
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                    <DialogTitle>Are you sure you want to delete "{deleteModalList.name}"?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            This action will delete the list and all associated items.<br></br>You will not be able to undo it at this time.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" disableElevation onClick={() => setDeleteModalOpen(false)}>Save My List</Button>
                        <Button variant="outlined" color="error" disableElevation onClick={() => handleDeleteModalConfirm(deleteModalList.id)}>Yes I'm Sure</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )

}

export default ListCard;