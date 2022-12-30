// import { useEffect } from 'react'
// import { supabase } from '../../supabaseClient'
// import { THEMES, changeBodyBackground } from '../../Utils/themeUtils'

const Theme = ({ session, handleError }) => {
    const handleThemeChange = async (e) => {
        e.preventDefault()
    }

    // const loadBodyBackground = async () => {
    //     const { user } = session
    //     try {

    //     }
    //     catch (error) {
    //         handleError(error.error_description || error.message)
    //         return
    //     }
    // }

    // useEffect(() => {
    //     loadBodyBackground()
    // }, [])

    return (
        <button className="w-10 rounded bg-white bg-opacity-5 self-center text-2xl py-1 mx-2 hover:bg-opacity-10" title="Settings" onClick={(event) => handleThemeChange(event)}>
            {'⚙'}
        </button>
    )

}

export default Theme;