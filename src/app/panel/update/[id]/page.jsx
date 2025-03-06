'use client';

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import api from '@/app/utils/axios.config';
import { toast } from 'react-toastify';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function UpdateProductById() {

    const { id } = useParams();
    const { user, logout } = useSession();
    const router = useRouter();

    const [producto, setProducto] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get(`/api/products/${id}`);
            const data = response.data;
            console.log(data);
            setProducto(data.payload);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
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

    const updateProduct = async () => {
        try {
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

    const handleChange = (e) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div>
            {loading ? <p>Cargando...</p>
                :
                <div className='flex flex-col justify-center items-center gap-8'>
                    <div className='flex'>
                        {user &&
                            <div className='flex flex-col justify-end p-3'>
                                <span>Usuario activo: {user.name}</span>
                                <button onClick={closeSession} className='rounded bg-red-700 text-white hover:cursor-pointer'>Cerrar sesión</button>
                                {user.role === 'admin' &&
                                    <Link href={'/panel'} className='p-2 bg-blue-800 text-white text-center rounded mt-3'>Volver al panel</Link>
                                }
                            </div>
                        }
                    </div>
                    <h2 className='text-2xl mt-4'>Editar producto</h2>
                    <div className='flex flex-col justify-self-center w-fit gap-4'>
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
                            <input className='border p-1 rounded' type="text" name='sellingPrice' defaultValue={producto.sellingPrice} onChange={handleChange} />
                        </div>
                        <div className='flex justify-between items-center gap-12'>
                            <label>Porcentaje de ganancia</label>
                            <input className='border p-1 rounded' type="text" name='percentage' defaultValue={producto.percentage} onChange={handleChange} />
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
            }
        </div>
    )
}

export default UpdateProductById;