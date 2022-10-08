import { supabase } from '../supabaseClient';
import routinePNG from '../static/routine.png';
import googlePNG from '../static/google.png';

export default function Auth() {
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            })
            console.log(data)
            if (error) throw error
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
        }
    }

    return (
        <div className='flex flex-col flex-wrap justify-center w-full h-screen'>
            <div>
                <img className='object-cover w-36 h-full mx-auto' src={routinePNG} alt="routine"></img>
            </div>
            <div className='self-center text-center'>
                <p className='text-xl'>Keep track of your daily tasks and get more done.</p>
            </div>
            <button className='flex flex-row flex-wrap justify-center bg-white text-gray-600 rounded w-56 self-center py-2 my-20' onClick={(event) => handleLogin(event)}>
                <img className='w-6' src={googlePNG} alt=""></img>
                <div className='self-center text-center ml-4'>
                    <p>Sign in with Google</p>
                </div>
            </button>
        </div>
    )
}