'use client';
import { Button } from '@src/components/ui/button'
import { login, signup, oauth } from '@src/utils/authactions'
import ValVodSVG from '@public/valvod.svg';
import DiscordSVG from '@public/discord.svg';
import TwitchSVG from '@public/twitch.svg';
import GoogleSVG from '@public/google.svg';
import { Separator } from '@src/components/ui/separator';
import { Input } from '@src/components/ui/input';
import Link from 'next/link';
import { PasswordInput } from './ui/passwordinput';
import { useToast } from '@src/hooks/use-toast';

export enum Page {
  LOGIN = "Login",
  SIGNUP = "Signup",
}

interface AuthProps {
    page: Page;
    embed?: boolean;
}

export default function Auth({ page, embed=false }: AuthProps) {
  const { toast } = useToast();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>, formData: FormData) {
    e.preventDefault();
    const { success, message } = await login(formData);
    toast({
      title: message,
      variant: success ? "success" : "destructive",
    })
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>, formData: FormData) {
    e.preventDefault();
    const { success, message } = await signup(formData);
    toast({
      title: message,
      variant: success ? "success" : "destructive",
    })
  }
  return (
    <div className={`flex flex-col w-full ${embed ? 'h-auto' : 'h-screen'}`}>
      <div className='flex flex-row w-full my-auto'>
          {!embed &&
            <div className='hidden h-screen select-none items-center justify-center overflow-hidden bg-neutral-900 basis-[33%] lg:flex lg:basis-[40%]'>
              <div className='flex flex-col space-y-[-100px]'>
                <div className='flex items-center justify-center overflow-hidden w-[496px] h-[496px]'>
                  <ValVodSVG title='VALVOD' alt='VALVOD' className='w-[500px] min-w-[500px] h-[500px] min-h-[500px] fill-transparent stroke-accent stroke-[3px]'/>
                </div>
                <ValVodSVG title='VALVOD' alt='VALVOD' className='w-[500px] min-w-[500px] h-[500px] min-h-[500px] fill-accent'/>
                <div className='flex items-center justify-center overflow-hidden w-[496px] h-[496px]'>
                  <ValVodSVG title='VALVOD' alt='VALVOD' className='w-[500px] min-w-[500px] h-[500px] min-h-[500px] fill-transparent stroke-accent stroke-[3px]'/>
                </div>
              </div>
            </div>
          }
          <div className='flex flex-col justify-center items-center basis-[100%] lg:basis-[66%]'>
            <div className='flex flex-col items-center justify-center w-[350px] md:w-[450px]'>
              {!embed && <p className='text-2xl py-8'>{`${page == Page.LOGIN ? 'Login' : 'Signup'}`}</p>}
              <div className='flex flex-row w-full justify-between'>
                <form className='flex basis-[31%]'>
                  <input type='hidden' name='provider' value={'google'}/>
                  <Button size="lg" variant="outline" className='w-full' formAction={oauth}>
                      <GoogleSVG className='w-6 fill-white' alt="Sign in with Google" />
                  </Button>
                </form>
                <form className='flex basis-[31%]'>
                  <input type='hidden' name='provider' value={'discord'} />
                  <Button size="lg" variant="outline" className='w-full' formAction={oauth}>
                      <DiscordSVG className='w-6 fill-white' alt="Sign in with Discord" />
                  </Button>
                </form>
                <form className='flex basis-[31%]'>
                  <input type='hidden' name='provider' value={'twitch'} />
                  <Button size="lg" variant="outline" className='w-full' formAction={oauth}>
                      <TwitchSVG className='w-6 fill-white' alt="Sign in with Twitch" />
                  </Button>
                </form>
              </div>
              <Separator orientation='horizontal' decorative className='w-full my-6'/>
              <div className='flex flex-col w-full'>
                <form className='flex flex-col w-full' onSubmit={(e) => page == Page.LOGIN ? handleLogin(e, new FormData(e.currentTarget)) : handleSignup(e, new FormData(e.currentTarget))}>
                  <Input className='w-full mb-4' id="email" name="email" type="email" placeholder='Email' required />
                  {page == Page.SIGNUP
                  ?
                    <PasswordInput className='w-full mb-4' id="password" name="password" type="password" placeholder='Password' required />
                  :
                    <Input className='w-full mb-4' id="password" name="password" type="password" placeholder='Password' required />
                  }
                  <Button size='lg' variant='default' type='submit'>{`${page == Page.LOGIN ? 'Log In' : 'Sign Up'}`}</Button>
                </form>
                <div className='py-4'>
                    {page == Page.LOGIN 
                    ?
                        <div className='flex flex-row w-full items-center justify-between'>
                            <Link href={"/auth/forgot-password"} className='text-sm text-accent font-semibold p-0 hover:underline'>
                                Forgot your password?
                            </Link>
                            <Link href={"/auth/signup"} className='text-sm text-accent font-semibold p-0 hover:underline'>
                                Create an account
                            </Link>
                        </div>
                    :
                      <div className='flex'>
                        <Link href={"/auth/login"} className='text-sm text-accent font-semibold p-0 hover:underline'>
                            Already have an account?
                        </Link>
                      </div>
                    }
                </div>
                {/* padding div to center form part */}
                <div className='pb-[20%]'></div>
                <p className='absolute flex justify-center bottom-10 w-[350px] md:w-[450px] text-[10px] md:text-xs secondary-text'>
                  {`By using VALVOD, you agree to our `}
                  <Link href={"/terms"} className='accent-text font-semibold hover:underline mx-1'>Terms of Service</Link>
                  {` and `}
                  <Link href={"/privacy-policy"} className='accent-text font-semibold hover:underline ml-1'>Privacy Policy</Link>
                  {`.`}
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
