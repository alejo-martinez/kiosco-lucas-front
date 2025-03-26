'use client';

import React, { useState, useEffect } from 'react'
import api from '@/app/utils/axios.config';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useSession } from '@/context/SessionContext';
import Link from 'next/link';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import AdminRoute from '@/components/AdminRoute';


function Resumes() {
    const { cat } = useParams();
    const searchParams = useSearchParams();
    const paramValue = searchParams.get("page");
    const { user } = useSession();

    const [resumes, setResumes] = useState([]);
    const [actualDate, setActualDate] = useState(null);
    const [setings, setSetings] = useState({});


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
            timeZone: 'America/Argentina/Buenos_Aires' // Especifica la zona horaria de Argentina
        };
        return new Date(date).toLocaleDateString('es-AR', options);
    }

    const fetchData = async () => {
        try {
            const response = await api.get(`/api/resume/summaries/${cat}?page=${paramValue ? paramValue : 1}`);
            const data = response.data;
            console.log(data)
            setResumes(data.payload.docs);
            setSetings(data.payload);
        } catch (error) {
            toast.error(error.message, {
                duration: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                hideProgressBar: true
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, [cat, paramValue]);

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
                    <div className='flex justify-center items-center mt-8'>
                        {setings?.hasPrevPage &&
                            <div className='flex'>
                                <button className='text-slate-800 mr-4'>
                                    <Link href={`/resumes?query=${setings.prevPage}`}>
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
                                    <Link href={`/resumes?query=${setings.nextPage}`}>
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
                            <th className="w-1/5 p-2 text-center">Día de la jornada</th>
                            <th className="w-1/5 p-2 text-center">Ventas</th>
                            <th className="w-1/5 p-2 text-center">Total vendido</th>
                            <th className="w-1/5 p-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumes.map((value, index) => {
                            return (
                                <tr key={index} className="border-b">
                                    <td className="w-1/5 p-2 text-center">{formatDate(value.init_date.init)}</td>
                                    <td className="w-1/5 p-2 text-center">{value.sales > 1 ? `${value.sales} ventas` : value.sales === 0 ? `Sin ventas` : `${value.sales} venta`}</td>
                                    <td className="w-1/5 p-2 text-center">${value.amount}</td>
                                    {value.sales > 0 && 
                                    <td className="w-1/5 p-2 text-center"><Link href={`/resumes/diary/${value._id}`}>Ver detalles</Link></td>
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Resumes;