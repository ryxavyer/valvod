'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ValVodSVG from '../../public/valvod.svg';
import FeedbackModal from './feedbackModal';
import { ArrowLeft, Library, SearchIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import Search from './search';
import { Button } from './ui/button';

interface NavigationProps {
    user: User | null;
}

const Navigation = ({ user }: NavigationProps) => {
    const [searchOpen, setSearchOpen] = useState(false);

    // this breaks hot reload in dev?
    // window.addEventListener('resize', () => {
    //     setSearchOpen(false);
    // });

    return (
        <div className='fixed z-20 t-0 l-0 h-[100px] bg-background border-secondary border-r-0 border-t-0 border-l-0 border-b-2 w-full flex flex-row items-center justify-between px-6 md:px-10'>
            <div className='flex flex-col items-center justify-center w-full space-y-4'>
                {!searchOpen
                ?
                <div className='flex flex-row items-center justify-between w-full space-x-2'>
                    <div className='flex flex-row items-center justify-end space-x-2'>
                        <Link
                            href="/"
                            className='mr-8'
                        >
                            <ValVodSVG title='VALVOD' alt='VALVOD' className='w-[50px] h-[50px] accent-fill'/>
                            <div className='relative w-0 h-0'>
                                <span className='absolute top-[-21px] left-[45px] text-xs text-accent font-normal rounded-md'>BETA</span>
                            </div>
                        </Link>
                        {/* empty div to center search - correctly set to balance 2 buttons on right */}
                        <div className='hidden h-10 px-[75px] py-2 md:block'></div>
                    </div>
                    <Search className='hidden w-full max-w-[600px] sm:flex flex-row px-6 py-4 md:px-0'/>
                    <div className='flex flex-row items-center justify-end space-x-2'>
                        {!user
                        ?
                            <div className='flex flex-row items-center justify-end w-full space-x-2'>
                                <Button
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    type="button"
                                    variant="secondary"
                                    className="px-4 py-2 rounded-lg border-secondary border bg-background sm:hidden"
                                >
                                    <SearchIcon className="h-4 w-4 shrink-0 opacity-100" />
                                </Button>
                                <Link
                                    href="/auth/login"
                                    className={`flex flex-row items-center justify-center w-[100px] px-4 py-2 border border-secondary rounded-lg text-sm hover:bg-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                                >
                                    <span className='text-md font-semibold'>LOG IN</span>
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className={`flex flex-row items-center justify-center w-[100px] px-4 py-2 bg-accent border border-accent rounded-lg text-sm hover:opacity-90 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                                >
                                    <span className='text-md font-semibold'>SIGN UP</span>
                                </Link>
                            </div>
                        :
                            <div className='flex flex-row items-center justify-end w-full space-x-1'>
                                <Button
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    type="button"
                                    variant="secondary"
                                    className="px-4 py-2 rounded-lg border-secondary border bg-background sm:hidden"
                                >
                                    <SearchIcon className="h-4 w-4 shrink-0 opacity-100" />
                                </Button>
                                <Link
                                    href="/library"
                                    className={`flex flex-row items-center justify-center w-full h-10 max-w-[120px] px-4 py-2 bg-background border border-secondary rounded-lg text-sm hover:bg-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                                >
                                    <Library className='w-4 h-4 shrink-0 opacity-100 sm:mr-2'/>
                                    <span className="hidden text-md font-normal sm:block">Library</span>
                                </Link>
                                {user && <FeedbackModal className='rounded-lg'/>}
                            </div>
                        }
                    </div>
                </div>
                :
                <div className='flex flex-row items-center justify-between w-full space-x-2'>
                    <Button
                        className='hover:bg-secondary'
                        variant='ghost' 
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        <ArrowLeft className='h-5 w-5 shrink-0 opacity-100'/>
                    </Button>
                    <Search className='w-full flex flex-row px-6 py-4'/>
                </div>
                }
            </div>
        </div>
    );
}

export default Navigation;
