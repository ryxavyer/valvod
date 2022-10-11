import { useState } from "react"
import { supabase } from '../supabaseClient'
import { validateUsername } from "../Utils/usernameValidation"
import ErrorMessage from "./ErrorMessage"

const CreateUsername = ({ session, setUsername }) => {
    const [error, setError] = useState(null)
    const [usernameInput, setUsernameInput] = useState("")

    const updateUsername = (e) => {
        const input = (e.target.value).toString().trim()
        setUsernameInput(input)
    }

    const saveUsername = async (e) => {
        e.preventDefault()
        const { user } = session
        const cleanedUsername = usernameInput.trim().toLowerCase()
        validateUsername(cleanedUsername).then( async (data) => {
            if (data.success) {
                const { error } = await supabase
                    .from('users')
                    .update({ username: cleanedUsername })
                    .eq('id', user.id)
                if (error) {
                    setError(data.error)
                }
            } else {
                setError(data.error)
            }
            setUsername(cleanedUsername)
        })
    }

    return (
        <div className="flex flex-col flex-wrap justify-center w-full h-screen">
            <div className="text-xl self-center text-center">What do your friends call you?</div>
            <form className="flex flex-col" onSubmit={(e) => saveUsername(e)}>
                <input className="w-72 bg-transparent border-b-2 self-center text-center my-5 py-1 focus:outline-none" value={usernameInput} onChange={(e) => updateUsername(e)}></input>
                {error && <ErrorMessage error={error}/>}
                <button className="w-56 rounded-full bg-routyneGold self-center my-12 py-2 hover:bg-routyneGoldLight" onClick={(e) => saveUsername(e)}>GET STARTED</button>
            </form>
        </div>
    )

}

export default CreateUsername;