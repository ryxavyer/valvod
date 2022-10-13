import { useState } from "react"
import { supabase } from '../supabaseClient'
import { DEFAULT_MSG_LENGTH } from "../Utils/errorUtils"
import { validateUsername } from "../Utils/usernameValidation"
import ErrorMessage from "./ErrorMessage"

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
            <div className="text-xl self-center text-center">What do your friends call you?</div>
            {error && <ErrorMessage error={error}/>}
            <form className="flex flex-col" onSubmit={(e) => saveUsername(e)}>
                <input className="w-72 bg-transparent border-b-2 self-center text-center my-5 py-1 focus:outline-none" value={usernameInput} onChange={(e) => updateUsername(e)}></input>
                <button className="w-48 rounded bg-routyneGold self-center my-12 py-2 hover:bg-routyneGoldLight" onClick={(e) => saveUsername(e)}>GET STARTED</button>
            </form>
        </div>
    )

}

export default CreateUsername;