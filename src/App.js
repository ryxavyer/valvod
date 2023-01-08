import './index.css'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Components/Auth'
import Homepage from './Components/Homepage'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { getThemeObject } from './Utils/themeUtils'

export default function App() {
  const [session, setSession] = useState(null)
  const [mode, setMode] = useState('coffee')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const theme = useMemo(() => createTheme(getThemeObject(mode)), [mode])

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            {!session ? (
              <Auth />
            ) : (
              <Homepage key={session.user.id} session={session} theme={mode} setTheme={setMode}/>
            )}
          </div>
        </LocalizationProvider>
      </ThemeProvider>
  )
}