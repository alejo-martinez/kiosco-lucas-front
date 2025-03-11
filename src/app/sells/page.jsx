'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/axios.config';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

function Sells() {
    const router = useRouter();

    const { user, logout } = useSession();
    const [tickets, setTickets] = useState([]);
    const [setings, setSetings] = useState({});
    const [actualDate, setActualDate] = useState(null);


    const formatDateForUser = () => {
        const date = new Date();
        const options = { weekday: "long", day: "numeric", month: "long" };
        setActualDate(date.toLocaleDateString("es-ES", options))
    };
    useEffect(() => {
        formatDateForUser();
    }, []);

    const formatDate = (date) => {
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
        <div className='grid grid-cols-[0.2fr_4fr_1.5fr] grid-rows-[auto_1fr_auto] h-screen gap-2 p-2'>
            <div className='row-span-2 bg-gray-200 p-4'>
                <Sidebar />
            </div>
            <div className='flex col-span-2 bg-gray-200 p-4 justify-end'>
                {user &&
                    <div className='flex flex-col p-3'>
                        <span>Usuario activo: {user.name}</span>
                        <span>{actualDate}</span>
                        <div className=''>
                            <Link href={"/panel"} className='text-center p-1 bg-blue-200 rounded font-bold'>Volver</Link>
                        </div>
                    </div>
                }
            </div>

            <div className='col-span-2'>
                <div>
                    <div className='flex justify-center items-center mt-8'>
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
                            <th className="w-1/5 p-2 text-center">Cantidad vendida</th>
                            <th className="w-1/5 p-2 text-center">Total</th>
                            <th className="w-1/5 p-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((value, index) => {
                            let quantity = 0;
                            for (let index = 0; index < value.products.length; index++) {
                                const element = value.products[index];
                                quantity += element.quantity;
                                
                            }
                            return (
                                <tr key={index} className="border-b">
                                    <td className="w-1/5 p-2 text-center">{formatDate(value.created_at)}</td>
                                    <td className="w-1/5 p-2 text-center">{quantity > 1 ? `${quantity} productos` : `${quantity} producto`}</td>
                                    <td className="w-1/5 p-2 text-center">${value.amount}</td>
                                    <td className="w-1/5 p-2 text-center"><Link href={`/sells/${value._id}`}>Ver detalles</Link></td>
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