'use client';

import api from '@/app/utils/axios.config';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Link from 'next/link';


function AddProduct() {

    const [producto, setProducto] = useState({ title: '', costPrice: 0, sellingPrice: 0, stock: 0, totalStock: 0, percentage: 0, code: '' });
    // const setStockPrice
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.name === 'sellingPrice' && producto.costPrice !== '') {
            const newPercentage = ((Number(e.target.value) - Number(producto.costPrice)) / Number(producto.costPrice)) * 100;

            setProducto({ ...producto, [e.target.name]: e.target.value, percentage: newPercentage });
        } else if (e.target.name === 'percentage') {
            const newSellingPrice = Number(producto.costPrice) * (1 + (Number(e.target.value) / 100))
            setProducto({ ...producto, [e.target.name]: e.target.value, sellingPrice: newSellingPrice });
        } else {
            setProducto({ ...producto, [e.target.name]: e.target.value });
        }
    }

    const createProduct = async (e) => {
        try {
            e.preventDefault();
            const response = await api.post('/api/products/create', producto);
            const data = response.data;
            if (data.status === 'success') {
                toast.success(data.message, {
                    duration: 1000,
                    pauseOnHover: false,
                    closeButton: false,
                    hideProgressBar: true
                })
                setProducto({ title: '', costPrice: 0, sellingPrice: 0, stock: 0, totalStock: 0, percentage: 0, code: '' })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.error)
        }
    }

    return (
        <div>
            <div className='w-fit p-4 bg-blue-500 rounded text-white'><Link href={'/'}>Volver al inicio</Link></div>

            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Crear Producto</h3>
                <form className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-gray-600">Nombre del producto</label>
                        <input type="text" name="title" className="border rounded p-2" onChange={handleChange} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Precio de costo</label>
                        <input
                            type="number"
                            name="costPrice"
                            // value={costPrice}
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
                        <input type="number" name="stock" className="border rounded p-2" onChange={handleChange} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Total stock</label>
                        <input type="number" name="totalStock" className="border rounded p-2" onChange={handleChange} />
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
                        <input type="number" name="code" className="border rounded p-2" onChange={handleChange} />
                    </div>
                    {/* {error && <div className="text-red-600 text-sm">{error}</div>} */}
                    <div className="text-center">
                        <button
                            onClick={createProduct}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Crear producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct;