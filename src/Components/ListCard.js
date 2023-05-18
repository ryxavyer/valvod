import { useState } from "react"
import { supabase } from "../supabaseClient"
import { getThemeObject } from "../Utils/themeUtils"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import DraggableList from "./DraggableList"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const ListCard = ({ theme, session, lists, setLists, updateLists, selectedList, handleListClick, handleSessionClick, handleError }) => {
    const [newList, setNewList] = useState("")
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [modalList, setModalList] = useState({})
    const [listUpdateTimer, setListUpdateTimer] = useState(null)
    const themeObject = getThemeObject(theme)
    const themePrimary = themeObject.palette.primary[500]
    const themeSecondary = themeObject.palette.secondary.main

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
          return
        }
        const start = source.droppableId;
        const finish = destination.droppableId;
        if (start === finish) {
            const newList = [...lists]
            const [removed] = newList.splice(source.index, 1)
            newList.splice(destination.index, 0, removed)
            setLists(newList)

            if (listUpdateTimer) {
                clearTimeout(listUpdateTimer)
            }

            setListUpdateTimer(
                setTimeout(async () => {
                    for (let i = 0; i < newList.length; i++) {
                        const list = newList[i]
                        const {data, error} = await supabase  // eslint-disable-line
                            .from('lists')
                            .update({ index: i })
                            .eq('id', list.id)

                        if (error) {
                            handleError("Error saving list order")
                        }
                        setListUpdateTimer(null)
                    }
                }, 1000)
            )
        }
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
                {lists.length && 
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="lists">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {lists.map((list, index) => (
                                        <Draggable key={list.id} draggableId={list.id.toString()} index={index}>
                                            {(provided) => (
                                                <div className="mb-2" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <DraggableList key={list.id} list={list} index={list.index} selectedList={selectedList} themePrimary={themePrimary} themeSecondary={themeSecondary} openEditModal={openEditModal} handleSessionClick={handleSessionClick} handleListClick={handleListClick}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                }
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