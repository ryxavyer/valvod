import { supabase } from '../supabaseClient'
import routynePNG from '../static/routyne_transparent.png'
import googlePNG from '../static/google.png'
import githubPNG from '../static/github-light.png'
import { Alert, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { DEFAULT_MSG_LENGTH } from '../Utils/errorUtils'

export default function Auth() {
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [errorTimeout, setErrorTimeout] = useState(null)
    const [isOneTime, setIsOneTime] = useState(false)
    const [otpEmail, setOtpEmail] = useState('')
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
            handleMessage(error.error_description || error.message, 'error')
        }
    }

    const handleOTP = async (e) => {
        e.preventDefault()
        if (!otpEmail) {
            handleMessage("Enter an email to recieve a magic link", 'error')
            return
        }

        try {
            let { data, error } = await supabase.auth.signInWithOtp({  // eslint-disable-line
                email: otpEmail
            })

            if (error) throw error

            setOtpEmail('')
            handleMessage("Your magic link has been sent", 'success')
        } catch (error) {
            handleMessage(error.error_description || error.message, 'error')
        }
    }

    const handleMessage = (msg, type) => {
        if (type === 'error') {
            setError(msg)
            if (errorTimeout) {
            clearTimeout(errorTimeout)
            }
            setErrorTimeout(setTimeout(() => {
                setError(null)
            }, DEFAULT_MSG_LENGTH)
            )
        }

        if (type === 'success') {
            setSuccess(msg)
            if (errorTimeout) {
            clearTimeout(errorTimeout)
            }
            setErrorTimeout(setTimeout(() => {
                setSuccess(null)
            }, DEFAULT_MSG_LENGTH)
            )
        }
      }

    const updateOtpEmail = (e) => {
        const input = (e.target.value).toString()
        setOtpEmail(input)
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
                        <div className='flex flex-row mt-10'>
                            <Button sx={{background:"#161B22", border: 1, borderColor: '#161B22', 
                                         '&:hover': {
                                            backgroundColor: '#161B22',
                                            border: 1,
                                            borderColor: 'secondary',
                                          },}} fullWidth onClick={(event) => handleLogin(event, 'github')}>
                                <img className='w-6' src={githubPNG} alt="Sign in with Github"></img>
                            </Button>
                            <Button sx={{background:"white",
                                         '&:hover': {
                                            backgroundColor: 'white',
                                            border: 1,
                                            borderColor: 'secondary',
                                          },}} fullWidth onClick={(event) => handleLogin(event, 'google')}>
                                <img className='w-6' src={googlePNG} alt="Sign in with Google"></img>
                            </Button>
                        </div>
                        <div className='flex flex-col my-2 self-center'>
                            {!isOneTime && <Button onClick={() => setIsOneTime(true)}>Or get a magic link</Button>}
                            {isOneTime &&
                                <div>
                                    {success && <Alert variant='outlined' severity='success' sx={{ marginY:2, marginX:"auto" }}>{success}</Alert>}
                                    {error && <Alert variant='outlined' severity='error' sx={{ marginY:2, marginX:"auto" }}>{error}</Alert>}
                                    <form onSubmit={(e) => handleOTP(e)}>
                                        <div className='flex flex-col mt-2'>
                                            <TextField label="Email" type='email' onChange={(e) => updateOtpEmail(e)} value={otpEmail}></TextField>
                                            <Button sx={{ marginY:1, }} variant='outlined' type='submit'>Send me a magic link</Button>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}