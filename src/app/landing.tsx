import React from 'react';
import { Button } from '@src/components/ui/button';
import { Card, CardContent, CardHeader } from '@src/components/ui/card';
import Link from 'next/link';
import Header from '@src/components/header';

export default function Landing() {
  return (
    <div>
        <div className='flex flex-col w-full h-screen'>
            <div className='flex flex-row justify-between w-[90%] mx-auto py-8 md:w-[80%] xl:w-[60%]'>
                <Header />
                <Link href='/login'>
                    <Button size="sm" variant="default">Get started</Button>
                </Link>
            </div>
            <div className="flex flex-col items-center w-full">
                <div className='w-[90%] md:w-[90%] xl:w-[70%]'>
                    <div className='py-8 md:py-24'>
                        <p className='flex justify-center text-[42px] font-bold leading-loose'>Spamming games isn't the answer.</p>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='text-[28px] font-normal leading-loose'><span className='accent-text'>Upgrade</span>{" your VOD review and get better faster."}</span>
                            {/* <span className='text-[28px] font-normal leading-loose'><span className='accent-text'>Stop</span>{" relying on RNG & start utilizing advantages you're throwing away."}</span> */}
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-between md:flex-row'>
                        <Card className='flex flex-col basis-[32%] my-2 min-h-[400px]'>
                            <CardHeader className='flex flex-row items-center'>
                                {/* <BiSolidCustomize className='text-lg mr-2 accent-fill' /> */}
                                Up-To-Date & Curated VODs
                            </CardHeader>
                            <CardContent>
                                <p className='text-sm'>Tailored to your agent or role</p>
                                <p className='text-sm secondary-text'>so you can spend less time searching and more time studying.</p>
                            </CardContent>
                        </Card>
                        <Card className='flex flex-col basis-[32%] my-2 min-h-[400px]'>
                            <CardHeader className='flex flex-row items-center'>
                                {/* <SiProgress className='text-lg mr-2 accent-fill' /> */}
                                Built-In VOD Analysis
                            </CardHeader>
                            <CardContent>
                                <p className='text-sm'>Keep track of what's important</p>
                                <p className='text-sm secondary-text'>using built-in annotation tools and assists from our computer vision model.</p>
                            </CardContent>
                        </Card>
                        <Card className='flex flex-col basis-[32%] my-2 min-h-[400px]'>
                            <CardHeader className='flex flex-row items-center'>
                                {/* <FaUserFriends className='text-lg mr-2 accent-fill' /> */}
                                Connect with Friends
                            </CardHeader>
                            <CardContent>
                                <p className='text-sm'>Share what you learn</p>
                                <p className='text-sm secondary-text'>and help each other improve.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
