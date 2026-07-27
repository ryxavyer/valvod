import Link from 'next/link';
import ValVodSVG from '@public/valvod.svg';
import { Button } from '@src/components/ui/button';

export const metadata = {
  title: "Sign In Failed | VALVOD",
  description: "We couldn't complete your sign in."
}

export default function AuthCodeError({ searchParams }: { searchParams: { reason?: string } }) {
  const reason = searchParams.reason?.replace(/\+/g, ' ');

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
          <div className='flex flex-col items-center justify-center w-[350px] md:w-[450px]'>
            <p className='text-2xl py-4'>{"We couldn't sign you in"}</p>
            <p className='text-sm secondary-text text-center pb-8'>
              {reason || 'The sign in link was invalid or has already been used. Please try again.'}
            </p>
            <div className='flex flex-col w-full gap-3'>
              <Button size='lg' variant='default' asChild>
                <Link href='/auth/login'>Back to login</Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href='/'>Go to homepage</Link>
              </Button>
            </div>
            <div className='pb-[20%]'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
