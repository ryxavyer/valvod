import { supabase } from '../../supabaseClient'
import { STATUS } from '../../status'

const Logout = ({ handleStatusUpdate, setError }) => {
    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            handleStatusUpdate(STATUS.OFFLINE)
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            setError(error)
        } finally {
        }
    }

    return (
        <button className="w-24 rounded bg-white bg-opacity-5 self-center py-2 mx-2 hover:bg-opacity-10" onClick={(event) => handleLogout(event)}>
            logout
        </button>
    )

}

export default Logout;