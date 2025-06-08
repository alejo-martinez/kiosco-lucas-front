'use client';

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import api from '@/utils/axios.config';
import { toast } from 'react-toastify';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import socket from '@/utils/socket.config';

function UpdateProductById() {

    const { id } = useParams();
    const { user, logout } = useSession();
    const router = useRouter();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [costPrice, setCostPrice] = useState(0);
    const [actualDate, setActualDate] = useState(null);
    const [code, setCode] = useState('');



    const fetchData = async () => {
        try {
            const response = await api.get(`/api/products/${id}`);
            const data = response.data;

            setProducto(data.payload);
            setSellingPrice(data.payload.sellingPrice);
            setPercentage(data.payload.percentage)
            setCostPrice(data.payload.costPrice)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    const updateProduct = async () => {
        try {

            const response = await api.put(`/api/products/full/${producto._id}`, { prod: producto })
            const data = response.data;
            toast.success(data.message, {
                autoClose: 2000,
                closeButton: true,
                hideProgressBar: true,
                className: 'toast-success'
            })
            router.push("/panel")
        } catch (error) {
            console.log(error);
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si el campo es percentage, costPrice o sellingPrice, lo tratamos como número (aunque sea string temporalmente)
        if (name === 'costPrice') {
            setCostPrice(value);
            const newSellingPrice = Number(value) + (Number(value) * Number(percentage) / 100);
            setSellingPrice(newSellingPrice);
            setProducto((prev) => ({
                ...prev,
                costPrice: value,
                sellingPrice: newSellingPrice,
            }));
        } else if (name === 'percentage') {
            setPercentage(value);
            const newSellingPrice = Number(costPrice) + (Number(costPrice) * Number(value) / 100);
            setSellingPrice(newSellingPrice);
            setProducto((prev) => ({
                ...prev,
                percentage: value,
                sellingPrice: newSellingPrice,
            }));
        } else if (name === 'sellingPrice') {
            setSellingPrice(value);
            const newPercentage = ((Number(value) - Number(costPrice)) / Number(costPrice)) * 100;
            setPercentage(newPercentage);
            setProducto((prev) => ({
                ...prev,
                sellingPrice: value,
                percentage: newPercentage,
            }));
        } else {
            // Para los demás campos (texto o stock)
            setProducto((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };




    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div>
            {loading ? <p>Cargando...</p>
                :
                <div className="edit-product-container">
                    <div className="form-wrapper">
                        <h2>Editar producto</h2>
                        <div className="form">
                            <div className="form-group">
                                <label>Producto</label>
                                <input type="text" name="title" value={producto?.title || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Stock en tienda</label>
                                <input type="text" name="stock" value={producto?.stock || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Stock total</label>
                                <input type="text" name="totalStock" value={producto?.totalStock || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Precio de costo</label>
                                <input type="text" name="costPrice" value={costPrice} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Precio de venta</label>
                                <input type="text" name="sellingPrice" value={sellingPrice} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Porcentaje de ganancia</label>
                                <input type="text" name="percentage" value={percentage} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Código</label>
                                <input type="text" name="code" value={producto?.code || ''} onChange={handleChange} />
                            </div>
                            <div className="button-wrapper">
                                <button onClick={updateProduct}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </div>
    )
}

export default UpdateProductById;