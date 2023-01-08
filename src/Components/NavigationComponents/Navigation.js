import Logout from './Logout'
import Username from './Username'
import Level from './Level'
import Updates from './Updates'
import Theme from './Theme'
import { AppBar, Divider, Typography, Toolbar, Box } from '@mui/material'

const Navigation = ({ theme, setTheme, session, username, status, level, xp, setInSessionView, handleStatusUpdate, handleError }) => {

    return (
        <AppBar position="fixed" color={theme === 'light' ? "background" : ""} sx={{ backgroundImage:"none", boxShadow:"none", zIndex: (theme) => theme.zIndex.drawer + 1,  }}>
            <Toolbar>
                <Box width="100%" padding="20px">
                    <Typography color="primary" sx={{ fontSize:"30px", lineHeight:"32px", float:"left", paddingTop:"2px", display:{ xs: 'none', sm: 'block'}, }}>routyne</Typography>
                    <Box display="flex" justifyContent="flex-end">                       
                        <Level theme={theme} session={session} initialLevel={level} initialXP={xp}/>
                        <Username theme={theme} session={session} username={username} initialStatus={status}/>
                        <Divider orientation='vertical' flexItem sx={{  marginX:"10px" }}/>
                        <Updates theme={theme} session={session}/>
                        <Theme theme={theme} setTheme={setTheme} session={session}/>
                        <Logout theme={theme} handleStatusUpdate={handleStatusUpdate} setError={handleError}/>
                    </Box> 
                </Box>
            </Toolbar>
            <Divider></Divider>
        </AppBar>
      )
}

export default Navigation;