import ValVodSVG from '@public/valvod.svg';
import ForgotPasswordForm from './form';

export const metadata = {
  title: "Forgot Password | VALVOD",
  description: "Reset the password set for your account.",
}

export default function ForgotPassword() {
  return (
    <div className='flex flex-col w-full h-screen'>
      <div className='flex flex-row w-full my-auto'>
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
          <div className='flex flex-col justify-center items-center basis-[100%] lg:basis-[66%]'>
            <div className='flex flex-col items-center justify-center w-[450px]'>
            <p className='text-2xl py-8'>{"Forgot your password?"}</p>
              <div className='flex flex-col w-full'>
                <ForgotPasswordForm />
                {/* padding div to center form part */}
                <div className='pb-[20%]'></div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
