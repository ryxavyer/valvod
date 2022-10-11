import { supabase } from '../supabaseClient';
import routynePNG from '../static/routyne.png';
import googlePNG from '../static/google.png';

export default function Auth() {
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({  // eslint-disable-line
                provider: 'google',
            })
            if (error) throw error
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
        }
    }

    return (
        <div>
            <div className='flex justify-center w-full h-screen'>
                <div className="flex flex-col my-32">
                    <div className='self-center'>
                        <img className='w-36 h-36 md:w-48 md:h-48' src={routynePNG} alt="routine"></img>
                    </div>
                    <div className=''>
                        <div className='text-2xl text-white md:text-3xl'>Keep track of your daily tasks.</div>
                        <div className='text-2xl text-[#d9b284] md:text-3xl'>Get more done.</div>
                        <button className='flex flex-row justify-center bg-white text-gray-600 rounded w-full self-center py-2 mt-10' onClick={(event) => handleLogin(event)}>
                            <img className='w-6' src={googlePNG} alt=""></img>
                        </button>
                        <div className='text-sm self-center text-center mt-5'>Created by <a className="text-[#d9b284]" href="https://www.linkedin.com/in/ryxavyer/" target="_blank" rel="noreferrer">Ryan Fernandez</a></div>
                    </div>
                </div>
            </div>
        </div>
    )
}