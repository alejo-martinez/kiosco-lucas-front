'use client';

import React, { useEffect, useState } from 'react';
import api from '../utils/axios.config';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import socket from '../utils/socket.config';

function Panel() {

    const router = useRouter();
    const { user, logout } = useSession();
    const searchParams = useSearchParams();
    const paramValue = searchParams.get("query");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [setings, setSetings] = useState({});
    const [code, setCode] = useState('');

    const fetchData = async () => {
        try {
            const response = await api.get(`/api/products/filter/?query=${paramValue ? paramValue : 1}`);
            const data = response.data;
            setProducts(data.payload.docs);
            setSetings({ hasNextPage: data.payload.hasNextPage, hasPrevPage: data.payload.hasPrevPage, nextPage: data.payload.nextPage, page: data.payload.page, prevPage: data.payload.prevPage, totalPages: data.payload.totalPages })
            console.log(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) =>{
        setCode(e.target.value);
    }

    const updateProd = (e, id) => {
        e.preventDefault();
        router.push(`/panel/update/${id}`);
    }

    const deleteProduct = async (e, id, index) => {
        try {
            e.preventDefault();
            const response = await api.delete(`/api/products/delete/${id}`)
            const data = response.data;
            toast.success(data.message, {
                duration: 2000,
                pauseOnHover: false,
                hideProgressBar: true,
                closeButton: false
            });
            const prods = [...products];
            prods.slice(index, 1);
            setProducts(prods);
        } catch (error) {
            toast.error(error.message, {
                duration: 3000,
                pauseOnHover: true,
                hideProgressBar: true,
                closeButton: true
            })
        }
    }

    const handleSearchProductByCode = (e) => {
        // e.preventDefault();
        if (e.key === 'Enter') {
            socket.emit('searchByCode', { code: e.target.value });
        }

    }

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

    useEffect(()=> {
        socket.on('resultTitle', data => {
            if(data.results.length === 0){
                toast.error('No hay resultados disponibles', {
                    duration: 3000,
                    pauseOnHover:false,
                    hideProgressBar:true
                })
            } else {
                // console.log(data.results);
                router.push(`/panel/update/${data.results[0]._id}`)
            }
        })
    })

    useEffect(() => {
        fetchData();
    }, [paramValue]);

    return (
        <div>
            {loading ? <p>Cargando...</p>
                :
                <div>
                    <div className='flex justify-center gap-4 mt-4 items-center'>
                        <label>Buscar producto</label>
                        <input type="text" name='code' value={code} onChange={handleChange} className='border p-1 rounded' onKeyDown={handleSearchProductByCode} />
                    </div>
                    <div className='flex justify-self-end'>
                        {user &&
                            <div className='flex flex-col justify-end p-3'>
                                <span>Usuario activo: {user.name}</span>
                                <button onClick={closeSession} className='rounded bg-red-700 text-white hover:cursor-pointer'>Cerrar sesión</button>
                                {user.role === 'admin' &&
                                    <Link href={'/'} className='p-2 text-center bg-blue-800 text-white rounded mt-3'>Inicio</Link>
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
                                    <th className="w-1/5 p-2 text-center">Código</th>
                                    <th className="w-1/5 p-2 text-center">Producto</th>
                                    <th className="w-1/5 p-2 text-center">Precio de costo</th>
                                    <th className="w-1/5 p-2 text-center">Precio de venta</th>
                                    <th className="w-1/5 p-2 text-center">Stock en tienda</th>
                                    <th className="w-1/5 p-2 text-center">Stock total</th>
                                    <th className="w-1/5 p-2 text-center">Porcentaje de ganancia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((value, index) => {
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="w-1/5 p-2 text-center flex items-center gap-2">
                                                <div className='flex flex-col gap-2'>
                                                    <button title='Editar' className='p-1 bg-blue-600 text-white font-bold rounded cursor-pointer' onClick={(e) => updateProd(e, value._id)}>I</button>
                                                    <button title='Eliminar' className='p-1 bg-red-600 text-white font-bold rounded cursor-pointer' onClick={(e) => deleteProduct(e, value._id, index)}>X</button>
                                                </div>
                                                {value.code}</td>
                                            <td className="w-1/5 p-2 text-center">{value.title}</td>
                                            <td className="w-1/5 p-2 text-center">$ {value.costPrice}</td>
                                            <td className="w-1/5 p-2 text-center">$ {value.sellingPrice}</td>
                                            <td className="w-1/5 p-2 text-center">{value.stock}</td>
                                            <td className="w-1/5 p-2 text-center">{value.totalStock}</td>
                                            <td className="w-1/5 p-2 text-center">{value.percentage.toFixed(2)}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    )
}

export default Panel;