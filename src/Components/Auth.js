import { supabase } from '../supabaseClient'
import routynePNG from '../static/routyne_transparent.png'
import googlePNG from '../static/google.png'
import githubPNG from '../static/github-light.png'

export default function Auth() {
    const getURL = () => {
        let url =
          process.env.REACT_APP_VERCEL_URL ??
          'http://localhost:3000/'
        // include `https://` when not localhost
        url = url.includes('http') ? url : `https://${url}`
        // include trailing `/`
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
        return url
    }
    const handleLogin = async (e, provider) => {
        e.preventDefault()
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({  // eslint-disable-line
                provider: provider,
                options: {
                    redirectTo: getURL()
                }
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
                <div className="flex flex-col my-36">
                    <div className='self-center'>
                        <img className='w-36 h-36 md:w-48 md:h-48' src={routynePNG} alt="routyne"></img>
                    </div>
                    <div className=''>
                        <div className='text-2xl text-white md:text-3xl'>Keep track of your daily tasks.</div>
                        <div className='text-2xl text-[#d9b284] md:text-3xl'>Get more done.</div>
                        <div className='flex flex-row'>
                            <button className='flex justify-center bg-[#161B22] text-gray-600 rounded w-1/2 self-center py-2 mt-10 mr-1' onClick={(event) => handleLogin(event, 'github')}>
                                <img className='w-6' src={githubPNG} alt="Sign in with Github"></img>
                            </button>
                            <button className='flex justify-center bg-white text-gray-600 rounded w-1/2 self-center py-2 mt-10 ml-1' onClick={(event) => handleLogin(event, 'google')}>
                                <img className='w-6' src={googlePNG} alt="Sign in with Google"></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}