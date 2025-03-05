'use client';

import React, { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Sidebar() {

    const { user, logout } = useSession();
    const router = useRouter();
    const closeSession = async (e) => {
        try {
            e.preventDefault();
            const response = await logout();
            toast.success(response.message, {
                closeButton: false,
                duration: 1400,
                hideProgressBar: true
            })
            setTimeout(() => {
                router.push('/login')
            }, 1500)
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
        <div className='border-r h-screen'>
            {user &&
                <div className='flex flex-col justify-end p-3'>
                    <button onClick={closeSession} className='rounded bg-red-700 text-white hover:cursor-pointer'>Cerrar sesión</button>
                    {user.role === 'admin' &&
                        <Link href={'/panel/add/product'} className='text-center p-2 bg-blue-800 text-white rounded mt-3'>Agregar productos</Link>
                    }
                </div>
            }
        </div>
    )
}

export default Sidebar;