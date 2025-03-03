import React from 'react';
import Link from 'next/link';
import ValvodSVG from '../../public/valvod.svg';

const Header = () => {
  return (
    <div className='flex items-center'>
        <Link href={"/"} className='flex flex-row items-center'>
            <ValvodSVG title='routyne' alt='routyne' className='w-[20px] h-[20px] accent-fill mr-2'/>
            <p className='text-2xl font-bold leading-none'>VALVOD</p>
            <p className='text-xs font-light mt-1 ml-1'>(beta)</p>
        </Link>
    </div>
  );
}

export default Header;
