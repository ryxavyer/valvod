import React from "react"
import { Button, Card, Typography } from "@mui/material"
import { Edit } from "@mui/icons-material"
import StartIcon from '@mui/icons-material/Start'

const DraggableList = ({ index, list, selectedList, themePrimary, themeSecondary, openEditModal, handleSessionClick, handleListClick }) => {
    return (
        <div className="mb-2" key={`${list.id}_div`} onClick={() => handleListClick(index, list.id, list)}>
            <div className='flex flex-row justify-end w-full'>
                <Card sx={{ display:"flex", boxShadow:"none", borderRadius:"0px", minWidth:"50px", maxWidth:"1000px", width:"100%", overflowWrap:true, backgroundColor:list.id === selectedList.id ? themePrimary : themeSecondary, backgroundImage:"none" }} key={list.id}>
                    <Typography sx={{ paddingX:"8px", paddingY:"10px", minWidth:"25px", maxWidth:"950px", width:"100%", overflowWrap:"break-word", }}>{list.name}</Typography>
                </Card>
                <div>
                    <Button title="Start Session" sx={{ minWidth:"20px", height:"100%", borderRadius:"0px", backgroundColor:list.id === selectedList.id ? themePrimary : themeSecondary, color:"#fff", transition:"none"}} onClick={() => handleSessionClick(index, list.id)}>
                        <StartIcon style={{ fontSize:"18px", marginRight:"0px" }}/>
                    </Button>
                </div>
                <div>
                    <Button title="Edit List" sx={{ minWidth:"30px", height:"100%", borderRadius:"0px", backgroundColor:list.id === selectedList.id ? themePrimary : themeSecondary, color:"#fff", transition:"none"}} onClick={() => openEditModal(list)}>
                        <Edit fontSize="12px"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DraggableList