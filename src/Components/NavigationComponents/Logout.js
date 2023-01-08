import { supabase } from '../../supabaseClient'
import { STATUS } from '../../Utils/status'
import LogoutIcon from '@mui/icons-material/Logout'
import { Button } from '@mui/material'

const Logout = ({ theme, handleStatusUpdate, handleError }) => {
    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            handleStatusUpdate(STATUS.OFFLINE)
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            handleError(error.error_description || error.message)
            return
        } finally {
        }
    }

    return (
        <Button title="Logout" onClick={(event) => handleLogout(event)}
                sx={{ minWidth:"50px" }}
        >
            <LogoutIcon style={{ marginLeft: "3px"}}/>
        </Button>
    )

}

export default Logout;