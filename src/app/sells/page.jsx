'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/axios.config';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';

function Sells() {

  const {user, logout} = useSession();
  const [tickets, setTickets] = useState([]);
  const [setings, setSetings] = useState({});

  const router = useRouter();

  const formatDate = (date) =>{
    const options = { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Mostrar en formato de 24 horas
        timeZone: 'America/Argentina/Buenos_Aires' // Especifica la zona horaria de Argentina
    };
    return new Date(date).toLocaleDateString('es-AR', options);
  }

  const closeSession = async(e)=>{
    try {
      e.preventDefault();
      const response = await logout();
      toast.success(response.message,{
        closeButton:false,
        duration: 1400,
        hideProgressBar:true
      })
      setTimeout(()=>{
        router.push('/login')
      }, 1500)
    } catch (error) {
      toast.error(error,{
        duration:3000,
        hideProgressBar:true,
        closeButton:true,
        pauseOnHover:true
      })
    }
  }


const fetchData = async () => {
    try {
        const response = await api.get('/api/ticket/');
        const data = response.data;
        setTickets(data.payload.docs);
        console.log(data.payload);
        setSetings(data.payload);
    } catch (error) {
        console.log(error);
    }
}

useEffect(() => {
    fetchData();
}, []);

    return (
        <div>
            <div className='flex justify-end'>
                {user &&
                    <div className='flex flex-col justify-end p-3'>
                        <span>Usuario activo: {user.name}</span>
                        <button onClick={closeSession} className='rounded w-fit p-1 bg-red-700 text-white hover:cursor-pointer'>Cerrar sesión</button>
                        {user.role === 'admin' &&
                            <div className='flex flex-col'>
                                <Link href={'/panel/add/product'} className='p-2 bg-blue-800 text-white rounded mt-3'>Agregar productos</Link>
                                <Link href={'/panel'} className='p-2 bg-blue-800 text-white rounded mt-3'>Panel de productos</Link>
                                <Link href={'/'} className='p-2 bg-blue-800 text-white rounded mt-3 text-center'>Inicio</Link>
                            </div>
                        }
                    </div>
                }
            </div>
            <div>
                <div>
                    <div className='flex justify-center items-center mt-12 mb-10'>
                        {setings?.hasPrevPage &&
                            <div className='flex'>
                                <button className='text-slate-800 mr-4'>
                                    <Link href={`/panel?query=${setings.prevPage}`}>
                                        <ChevronLeftIcon className='h-4 w-4' />
                                    </Link>
                                </button>
                            </div>
                        }
                        <div>
                            <p className='text-slate-800 font-bold'>
                                {setings?.page}
                            </p>
                        </div>
                        {setings?.hasNextPage &&
                            <div className='flex'>
                                <button className='text-slate-800 ml-4'>
                                    <Link href={`/panel?query=${setings.nextPage}`}>
                                        <ChevronRightIcon className='h-4 w-4' />
                                    </Link>

                                </button>
                            </div>
                        }
                    </div>
                </div>
                <table className="w-full table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-200 border-b">
                            <th className="w-1/5 p-2 text-center">Día de la venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((value, index) => {
                            return (
                                <tr key={index} className="border-b">
                                    <td className="w-1/5 p-2 text-center"><Link href={`/sells/${value._id}`}>{formatDate(value.created_at)} hs</Link></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Sells;