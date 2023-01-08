import PaletteIcon from '@mui/icons-material/Palette'
import { Select, Button, MenuItem, Menu } from '@mui/material'
import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { ALL_THEMES } from '../../Utils/themeUtils'


const Theme = ({ theme, setTheme, session, handleError }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpen = (e) => {
        setIsOpen(true)
        setAnchorEl(e.currentTarget)
    }

    const handleChange = async (e) => {
        e.preventDefault()
        setTheme(e.target.value)
        const {user} = session
        try{ 
            const { error } = await supabase
            .from('users')
            .update([
                { chosen_theme: (e.target.value).toString() },
            ])
            .eq("id", user.id)

            if (error) throw error
        }
        catch (error) {
            handleError(error.error_message || error.description)
            return
        }
    }

    return (
        <div>
            <Button title="Theme" onClick={(e) => handleOpen(e)}
                    sx={{ minWidth:"50px" }}
            >
                <PaletteIcon sx={{ fontSize:"30px" }}/>
            </Button>
            {isOpen && 
                <Menu open={isOpen} anchorEl={anchorEl} onClose={() => setIsOpen(false)} 
                      sx={{ top:"10px",
                            '& .MuiList-root': {
                                paddingTop:"0px", paddingBottom:"0px",
                            } 
                          }}
                >
                    <Select value={theme} fullWidth onChange={(e) => handleChange(e)}>
                        {Object.entries(ALL_THEMES).map(([k, v], i) => {
                            return(
                            <MenuItem key={k} value={k}>{k}</MenuItem>
                            )
                        })}
                    </Select>
                </Menu>
            }
        </div>
    )

}

export default Theme;