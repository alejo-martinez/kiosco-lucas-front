'use client';

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import api from '@/app/utils/axios.config';
import { toast } from 'react-toastify';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import socket from '@/app/utils/socket.config';
import AdminRoute from '@/components/AdminRoute';

function UpdateProductById() {

    const { id } = useParams();
    const { user, logout } = useSession();
    const router = useRouter();

    const [producto, setProducto] = useState({});
    const [loading, setLoading] = useState(true);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [costPrice, setCostPrice] = useState(0);
    const [actualDate, setActualDate] = useState(null);
    const [code, setCode] = useState('');



    const formatDateForUser = () => {
        const date = new Date();
        const options = { weekday: "long", day: "numeric", month: "long" };
        setActualDate(date.toLocaleDateString("es-ES", options))
    };
    useEffect(() => {
        formatDateForUser();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get(`/api/products/${id}`);
            const data = response.data;
            console.log(data);
            setProducto(data.payload);
            setSellingPrice(data.payload.sellingPrice);
            setPercentage(data.payload.percentage)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    const updateProduct = async () => {
        try {
            console.log(producto)
            const response = await api.put(`/api/products/full/${producto._id}`, { prod: producto })
            const data = response.data;
            toast.success(data.message, {
                duration: 1500,
                pauseOnHover: false,
                hideProgressBar: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeCode = (e) => {
        setCode(e.target.value);
    }

    const handleSearchProductByCode = (e) => {
        // e.preventDefault();
        if (e.key === 'Enter') {
            socket.emit('searchCodeUpdate', { code: e.target.value });
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProducto((prevProducto) => {
            const updatedProducto = { ...prevProducto, [name]: value };

            if (name === 'costPrice' && prevProducto.percentage) {
                const newSellingPrice = Number(value) + (Number(value) * (prevProducto.percentage / 100));
                updatedProducto.sellingPrice = newSellingPrice;
                setSellingPrice(newSellingPrice);
            }

            if (name === 'percentage' && prevProducto.costPrice) {
                const newSellingPrice = Number(prevProducto.costPrice) + (Number(prevProducto.costPrice) * (value / 100));
                updatedProducto.sellingPrice = newSellingPrice;
                setSellingPrice(newSellingPrice);
                setPercentage(value);
            }

            if (name === 'sellingPrice' && prevProducto.costPrice) {
                const prod = { ...producto };
                const newPercentage = ((Number(value) - prevProducto.costPrice) / prevProducto.costPrice) * 100;
                setSellingPrice(e.target.value)
                setPercentage(newPercentage);
                prod.percentage = newPercentage;
                setProducto({ ...prod, [e.target.name]: e.target.value });

            }
            // if(name === 'stock'){
            //     updatedProducto.totalStock = Number(value) + Number(updatedProducto.totalStock);
            //     setProducto(updatedProducto)
            // }

            return updatedProducto;
        });
    }

    
    useEffect(() => {
        socket.on('resultCodeUpdate', data => {

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

        socket.on('errorCodeUpdate', data=>{
            toast.error(data.error,{
                duration:2000,
                hideProgressBar:true,
                pauseOnHover:false
            })
        })
    })


    useEffect(() => {
        fetchData();
    }, [id]);

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
                                <input type="text" name='code' value={code} onChange={handleChangeCode} className='border p-1 rounded' onKeyDown={handleSearchProductByCode} />
                            </div>
                        </div>
                        {user &&
                            <div className='flex flex-col justify-self-end p-3'>
                                <span>Usuario activo: {user.name}</span>
                                <span>{actualDate}</span>
                            </div>
                        }
                    </div>
                    <div className='flex flex-col justify-center items-center col-span-2 gap-10'>
                        <h2 className='text-2xl mt-4 text-center'>Editar producto</h2>
                        <div className='flex flex-col justify-self-center w-fit gap-4 bg-gray-200 p-4 rounded'>
                            <div className='flex justify-between items-center gap-12'>
                                <label>Producto</label>
                                <input className='border p-1 rounded' type="text" name='title' defaultValue={producto.title} onChange={handleChange} />
                            </div>
                            <div className='flex justify-between items-center gap-12'>
                                <label>Stock en tienda</label>
                                <input className='border p-1 rounded' type="text" name='stock' defaultValue={producto.stock} onChange={handleChange} />
                            </div>
                            <div className='flex justify-between items-center gap-12'>
                                <label>Stock total</label>
                                <input className='border p-1 rounded' type="text" name='totalStock' defaultValue={producto.totalStock} onChange={handleChange} />
                            </div>
                            <div className='flex justify-between items-center gap-12'>
                                <label>Precio de costo</label>
                                <input className='border p-1 rounded' type="text" name='costPrice' defaultValue={producto.costPrice} onChange={handleChange} />
                            </div>
                            <div className='flex justify-between items-center gap-12'>
                                <label>Precio de venta</label>
                                <input className='border p-1 rounded' type="text" name='sellingPrice' value={sellingPrice} onChange={handleChange} />
                            </div>
                            <div className='flex justify-between items-center gap-12'>
                                <label>Porcentaje de ganancia</label>
                                <input className='border p-1 rounded' type="text" name='percentage' value={percentage.toFixed(2)} onChange={handleChange} />
                            </div>
                            <div className='flex justify-between items-center gap-12'>
                                <label>Código</label>
                                <input className='border p-1 rounded' type="text" name='code' defaultValue={producto.code} onChange={handleChange} />
                            </div>
                            <div className='flex justify-center mt-6'>
                                <button className='bg-blue-600 p-1 rounded text-white cursor-pointer' onClick={updateProduct}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default AdminRoute(UpdateProductById);