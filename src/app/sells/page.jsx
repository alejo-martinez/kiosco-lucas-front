'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/axios.config';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AdminRoute from '@/components/AdminRoute';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function Sells() {
    const router = useRouter();
    const params = useSearchParams();
    const userParam = params.get('user');
    const queryParam = params.get('query')

    const { user, logout } = useSession();
    const [tickets, setTickets] = useState([]);
    const [setings, setSetings] = useState({});
    const [actualDate, setActualDate] = useState(null);
    const [users, setUsers] = useState([]); 
    const [userFilter, setUserFilter] = useState(null);

    const formatDateForUser = () => {
        const date = new Date();
        const options = { weekday: "long", day: "numeric", month: "long" };
        setActualDate(date.toLocaleDateString("es-ES", options))
    };

    const fetchsUsers = async()=>{
        try {
            const response = await api.get(`/api/user/`);
            const data = response.data;
            setUsers(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchsUsers();
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

    const handleChangeUserFilter = (e)=>{
        if(e.target.value) router.push(`/sells/?user=${e.target.value}`)
        else router.push('/sells')
    }

    // console.log(setings)
    const fetchData = async () => {
        try {
            const response = await api.get(`/api/ticket/${userParam ? `?usuario=${userParam}&page=${queryParam | 1}` : `?page=${queryParam | 1}`}`);
            const data = response.data;
            setTickets(data.payload.docs);
            setSetings(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [userParam, queryParam]);

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
                    </div>
                }
            </div>

            <div className='col-span-2'>
                <div>
                    <div>
                        <select onChange={handleChangeUserFilter}>
                            <option value="">Selecciona un usuario</option>
                            {users?.map((option, index) => (
                                <option key={index} value={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className='flex justify-center items-center mt-8'>
                        {setings?.hasPrevPage &&
                            <div className='flex'>
                                <button className='text-slate-800 mr-4'>
                                    <Link href={`/sells?page=${setings.prevPage}`}>
                                        <ChevronLeftIcon className='h-4 w-4' />
                                    </Link>
                                </button>
                            </div>
                        }
                        <div>
                            <p className='text-slate-800 font-bold'>
                                {queryParam | 1}
                            </p>
                        </div>
                        {setings?.hasNextPage &&
                            <div className='flex'>
                                <button className='text-slate-800 ml-4'>
                                    <Link href={`/sells?${user && user._id}&page=${setings.nextPage}`}>
                                        <ChevronRightIcon className='h-4 w-4' />
                                    </Link>

                                </button>
                            </div>
                        }
                    </div> */}
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

export default AdminRoute(Sells);