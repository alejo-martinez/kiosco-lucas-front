'use client';

import React, { useEffect, useState } from 'react';
import api from '../utils/axios.config';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import socket from '../utils/socket.config';
import Sidebar from '@/components/Sidebar';
import AdminRoute from '@/components/AdminRoute';
import { generatePDF } from '../utils/generatePdf';

function Panel() {

    const router = useRouter();
    const { user, logout } = useSession();
    const searchParams = useSearchParams();
    const paramValue = searchParams.get("query");
    const filterParam = searchParams.get("filter");
    const valueFilterParam = searchParams.get("valueFilter");

    const [actualDate, setActualDate] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [setings, setSetings] = useState({});
    const [code, setCode] = useState('');

    const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams();

            if (paramValue) queryParams.append("query", paramValue);
            if (filterParam && valueFilterParam) {
                queryParams.append("filter", filterParam);
                queryParams.append("valueFilter", valueFilterParam);
            }

            const response = await api.get(`/api/products/filter/?${queryParams.toString()}`);
            const data = response.data;
            setProducts(data.payload.docs);
            setSetings({ hasNextPage: data.payload.hasNextPage, hasPrevPage: data.payload.hasPrevPage, nextPage: data.payload.nextPage, page: data.payload.page, prevPage: data.payload.prevPage, totalPages: data.payload.totalPages })
            console.log(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const downloadProducts = async (e) => {
        e.preventDefault();
        const response = await api.get(`/api/products/`);
        const data = response.data;
        if (data.status === 'success') {
            toast.success('Comenzando la descarga', {
                duration: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                hideProgressBar: true,
                closeButton: false
            })
            generatePDF(data.payload);
        }
    }

    const handleChange = (e) => {
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
            socket.emit('searchCodeUpdate', { code: e.target.value });
        }

    }

    const handleChangeFilter = (e) => {
        const selectedOption = e.target.selectedOptions[0]; // Obtiene la opción seleccionada
        const filter = selectedOption.dataset.filter;
        const params = new URLSearchParams();
        params.set('query', paramValue ? paramValue : 1);
        if(filter) params.set('filter', filter);
        if(e.target.value) params.set('valueFilter', e.target.value);
        

        router.push(`/panel?${params.toString()}`);

    }

    const formatDateForUser = () => {
        const date = new Date();
        const options = { weekday: "long", day: "numeric", month: "long" };
        setActualDate(date.toLocaleDateString("es-ES", options))
    };

    useEffect(() => {
        formatDateForUser();
    }, []);

    useEffect(() => {
        socket.on('resultCodeUpdate', data => {
            console.log(data)
            if (!data.producto) {
                toast.error('No hay resultados disponibles', {
                    duration: 3000,
                    pauseOnHover: false,
                    hideProgressBar: true
                })
            } else {
                router.push(`/panel/update/${data.producto._id}`)
            }
        })

        socket.on('errorCodeUpdate', data => {
            toast.error(data.error, {
                duration: 2000,
                hideProgressBar: true,
                pauseOnHover: false
            })
        })
    })

    useEffect(() => {
        fetchData();
        console.log(setings)
    }, [paramValue, filterParam, valueFilterParam]);

    return (
        <div>
            {loading ? <p>Cargando...</p>
                :
                <div className='grid grid-cols-[0.2fr_4fr_1.5fr] grid-rows-[auto_1fr_auto] h-screen gap-2 p-2'>
                    <div className='row-span-2 bg-gray-200 p-4'>
                        <Sidebar />
                    </div>
                    <div className='flex col-span-2 bg-gray-200 p-4'>
                        <div className='flex flex-grow justify-center'>

                            <div className='flex justify-center gap-4 mt-4 items-center'>
                                <label>Buscar producto</label>
                                <input type="text" name='code' value={code} onChange={handleChange} className='border p-1 rounded' onKeyDown={handleSearchProductByCode} />
                            </div>
                        </div>
                        {user &&
                            <div className='flex flex-col justify-self-end p-3'>
                                <span>Usuario activo: {user.name}</span>
                                <span>{actualDate}</span>
                                <button onClick={downloadProducts} className='p-1 bg-blue-700 text-white rounded cursor-pointer'>Generar pdf</button>
                            </div>
                        }
                    </div>
                    <div className='col-span-2'>
                        <div>
                            <select onChange={handleChangeFilter}>
                                <option value="">Selecciona un filtro</option>
                                <option value="2" data-filter="stock">Menor stock</option>
                                {/* <option value="">A-Z</option>
                                <option value="">Z-A</option> */}
                                {/* <option value="">Z-A</option> */}

                            </select>
                        </div>
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
                                            <td className="w-1/5 p-2 text-center">
                                            <div className='flex justify-center gap-2'>
                                                {value.stock <= 2 &&
                                                <ExclamationTriangleIcon className={`h-6 w-6 ${value.stock === 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                                                }
                                                <span>{value.stock}</span>
                                            </div></td>
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

export default AdminRoute(Panel);