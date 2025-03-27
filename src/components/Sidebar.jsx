'use client';

import React from 'react';
import { useSession } from '@/context/SessionContext';
import { HomeIcon, Cog8ToothIcon, BanknotesIcon, PlusCircleIcon, ClipboardIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function Sidebar() {
    const router = useRouter()
    const { user, logout } = useSession();

    const closeSession = async (e) => {
        try {
            e.preventDefault();
            const response = await logout();
            toast.success(response.message, {
                closeButton: false,
                duration: 1400,
                hideProgressBar: true
            })
            router.push('/login')
            // setTimeout(() => {
            // }, 1500)
        } catch (error) {
            toast.error(error, {
                duration: 3000,
                hideProgressBar: true,
                closeButton: true,
                pauseOnHover: true
            })
        }
    }

    return (
        <div className='flex flex-col justify-between items-center h-full'>
            <div>

                <div className='flex items-center'>
                    <Link href={"/"} className='text-center'>
                        <HomeIcon width={50} />
                        Inicio
                    </Link>
                </div>
                { user && 
                user.role === 'admin' &&
                    <div>

                        <div className='flex items-center'>

                            <Link href={"/panel"} className='text-center'>
                                <Cog8ToothIcon width={50} />
                                Panel
                            </Link>
                        </div>
                        <div className='flex items-center'>

                            <Link href={"/sells"} className='text-center'>
                                <BanknotesIcon width={50} />
                                Ventas
                            </Link>
                        </div>
                        <div className='flex items-center'>
                            <Link href={"/panel/add/product"} className='text-center'>
                                <PlusCircleIcon width={50} />
                                Crear
                            </Link>
                        </div>
                    </div>
                }
                        <div className='flex items-center'>
                            <Link href={"/resumes/diary"} className='text-center'>
                                <ClipboardIcon width={50} />
                                Resúmenes
                            </Link>
                        </div>
            </div>
            <div className='flex flex-wrap'>
                <button onClick={closeSession} className='rounded w-fit p-1 bg-red-700 text-white hover:cursor-pointer'>Cerrar sesión</button>
            </div>
        </div>
    )
}

export default Sidebar;