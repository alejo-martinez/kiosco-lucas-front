'use client';

import React from 'react';
import { useSession } from '@/context/SessionContext';
import { HomeIcon, Cog8ToothIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

function Sidebar() {

    const { user } = useSession();

    return (
        <div className='flex flex-col'>
            <div className='flex items-center'>
                <Link href={"/"} className='text-center'>
                    <HomeIcon width={50}/>
                    Inicio
                </Link>
            </div>
            <div className='flex items-center'>

                <Link href={"/panel"} className='text-center'>
                    <Cog8ToothIcon width={50}/>
                    Panel de productos
                </Link>
            </div>
            <div className='flex items-center'>

                <Link href={"/sells"} className='text-center'>
                    <BanknotesIcon width={50}/>
                    Ventas
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;