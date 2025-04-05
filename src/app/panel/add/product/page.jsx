'use client';

import api from '@/app/utils/axios.config';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useSession } from '@/context/SessionContext';
import AdminRoute from '@/components/AdminRoute';

function AddProduct() {

    const { user } = useSession();

    const [producto, setProducto] = useState({ title: '', costPrice: 0, sellingPrice: 0, stock: 0, totalStock: 0, percentage: 0 });
    const [code, setCode] = useState('');
    const [actualDate, setActualDate] = useState(null);


    const formatDateForUser = () => {
        const date = new Date();
        const options = { weekday: "long", day: "numeric", month: "long" };
        setActualDate(date.toLocaleDateString("es-ES", options))
    };
    useEffect(() => {
        formatDateForUser();
    }, []);
    // const setStockPrice
    const handleChange = (e) => {
        let value = e.target.value;
    
        // Eliminar ceros iniciales si los hay
        if (value.startsWith("0")) {
            value = value.replace(/^0+/, ""); 
        }
    
        // Crear un nuevo objeto con el producto actualizado
        let updatedProduct = { ...producto, [e.target.name]: value };
    
        // Si se está modificando el precio de venta
        if (e.target.name === 'sellingPrice' && producto.costPrice) {
            const newPercentage = ((Number(value) - Number(producto.costPrice)) / Number(producto.costPrice)) * 100;
            updatedProduct.percentage = newPercentage.toFixed(2); // Redondear porcentaje a 2 decimales
        } 
        // Si se está modificando el porcentaje
        else if (e.target.name === 'percentage') {
            const newSellingPrice = Number(producto.costPrice) * (1 + (Number(value) / 100));
            updatedProduct.sellingPrice = newSellingPrice.toFixed(2); // Redondear precio de venta a 2 decimales
        }
    
        // Actualizar el estado con el nuevo objeto
        setProducto(updatedProduct);
    };

    const handleChangeCode = (e) => {
        setCode(e.target.value);
    }

    const handleEnterProduct = async (e) => {
        try {
            if (e.key === 'Enter') {
                // setCode(e.target.value)
                const newProd = { ...producto, code: e.target.value };
                const response = await api.post('/api/products/create', newProd);
                const data = response.data;
                if (data.status === 'success') {
                    toast.success(data.message, {
                        duration: 1000,
                        pauseOnHover: false,
                        closeButton: false,
                        hideProgressBar: true
                    })
                }
                setProducto({ title: '', costPrice: 0, sellingPrice: 0, stock: 0, totalStock: 0, percentage: 0 });
                setCode('');
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='grid grid-cols-[0.2fr_4fr_1.5fr] grid-rows-[auto_1fr_auto] h-screen gap-2 p-2'>
            <div className='row-span-2 bg-gray-200 p-4'>
                <Sidebar />
            </div>
            <div className='flex col-span-2 bg-gray-200 p-4 justify-end'>
                {user &&
                    <div className='flex flex-col justify-self-end p-3'>
                        <span>Usuario activo: {user.name}</span>
                        <span>{actualDate}</span>
                    </div>
                }
            </div>
            {/* <div className='w-fit p-4 bg-blue-500 rounded text-white'><Link href={'/'}>Volver al inicio</Link></div> */}
            <div className='flex flex-col justify-center items-center col-span-2 gap-10'>

                <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 w-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Crear Producto</h3>
                    <form className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-gray-600">Nombre del producto</label>
                            <input type="text" name="title" className="border rounded p-2" onChange={handleChange} value={producto.title} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Precio de costo</label>
                            <input
                                type="number"
                                name="costPrice"
                                value={producto.costPrice}
                                onChange={handleChange}
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Precio de venta</label>
                            <input
                                type="number"
                                name="sellingPrice"
                                value={producto.sellingPrice}
                                onChange={handleChange}
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Stock en tienda</label>
                            <input type="number" name="stock" className="border rounded p-2" onChange={handleChange} value={producto.stock} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Total stock</label>
                            {/* <span>{producto.totalStock}</span> */}
                            <input type="number" name="totalStock" className="border rounded p-2" onChange={handleChange} value={producto.totalStock} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Porcentaje de ganancia</label>
                            <input
                                type="number"
                                name="percentage"
                                value={producto.percentage}
                                onChange={handleChange}
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600">Código</label>
                            <input type="number" name="code" value={code} className="border rounded p-2" onChange={handleChangeCode} onKeyDown={handleEnterProduct} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminRoute(AddProduct);