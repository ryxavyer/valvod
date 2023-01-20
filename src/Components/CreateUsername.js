import { Alert, Button, Input } from "@mui/material"
import { useState } from "react"
import { supabase } from '../supabaseClient'
import { DEFAULT_MSG_LENGTH } from "../Utils/errorUtils"
import { validateUsername } from "../Utils/usernameValidation"

const CreateUsername = ({ session, setUsername }) => {
    const [error, setError] = useState(null)
    const [errorTimeout, setErrorTimeout] = useState(null)
    const [usernameInput, setUsernameInput] = useState("")

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

    const updateUsername = (e) => {
        const input = (e.target.value).toString().trim()
        setUsernameInput(input)
    }

    const saveUsername = async (e) => {
        e.preventDefault()
        const { user } = session
        const cleanedUsername = usernameInput.trim().toLowerCase()
        validateUsername(cleanedUsername).then(async (data) => {
            if (data.success) {
                const { error } = await supabase
                    .from('users')
                    .update({ username: cleanedUsername })
                    .eq('id', user.id)

                if (error) {
                    handleError(error)
                    return
                }
                setUsername(cleanedUsername)
            } else {
                handleError(data.validationError)
                return
            }
        })
    }

    return (
    <div className="flex flex-col flex-wrap justify-center w-full h-screen">
        {error && <Alert variant="outlined" severity='error' sx={{ marginX:"auto", marginY:2, width:"25%" }}>{error}</Alert>}
        <div className="text-xl self-center text-center">What do your friends call you?</div>
        <form className="flex flex-col w-1/4 self-center" onSubmit={(e) => saveUsername(e)}>
            <Input sx={{marginY:4,}} fullWidth value={usernameInput} onChange={(e) => updateUsername(e)}></Input>
            <Button variant='outlined' onClick={(e) => saveUsername(e)}>GET STARTED</Button>
        </form>
    </div>
    )

}

export default CreateUsername;