import ValVodSVG from '@public/valvod.svg';
import ResetPasswordForm from './form';
import { createClient } from '@src/lib/supabase';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Change Password | VALVOD",
  description: "Update the password set for your account."
}

export default async function ChangePassword({ searchParams }: { searchParams: { code?: string, error?: string, error_description?: string } }) {
  // Check for errors in the URL (expired link, invalid link, etc.)
  if (searchParams.error) {
    let errorMessage = 'Invalid or expired reset link';
    if (searchParams.error_description) {
      errorMessage = searchParams.error_description.replace(/\+/g, ' ');
    }
    // Redirect to forgot password page with error message
    redirect(`/auth/forgot-password?error=${encodeURIComponent(errorMessage)}`);
  }

  // Exchange the code for a session if present
  if (searchParams.code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code);
    if (error) {
      // If code exchange fails, redirect to forgot password page
      redirect(`/auth/forgot-password?error=${encodeURIComponent('Reset link is invalid or has expired. Please try again.')}`);
    }
  } else {
    // No code provided - redirect to forgot password page
    redirect('/auth/forgot-password?error=' + encodeURIComponent('No reset code provided. Please request a new link.'));
  }
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
            <p className='text-2xl py-8'>Set a New Password</p>
              <div className='flex flex-col w-full'>
                <ResetPasswordForm/>
                {/* padding div to center form fields rather than title + form */}
                <div className='pb-[20%]'></div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
