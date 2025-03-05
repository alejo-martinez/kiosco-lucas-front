'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import socket from '@/app/utils/socket.config';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import api from '@/app/utils/axios.config';

function Sell() {

    const { cart, emptyCart } = useCart();
    const {user} = useSession();

    const handleAdd = async(e, prod)=>{
        e.preventDefault();
        socket.emit('addToCart', {cid: user.cart._id, pid: prod.product._id, quantity: 1});
    }

    const handleRemove = async(e, prod)=>{
        e.preventDefault();
        socket.emit('addToCart', {cid:user.cart._id, pid: prod.product._id, quantity: -1});
    }

    const clearCart = async(e)=>{
        e.preventDefault();
        const response = await emptyCart(user.cart._id);
        toast.success(response.message, {
            duration:3000,
            pauseOnHover:false,
            closeButton:false,
            hideProgressBar:true
        })
    }

    useEffect(()=>{
        socket.on('errorUpdate', data=>{
            toast.error(data.error, {
                duration:2000,
                pauseOnHover:false,
                hideProgressBar:true,
                closeButton:false
            })
        })
    }, []);
    // console.log(cart)
    return (
        <div>
            <div>
                {cart.products?.length === 0 ?
                    <div className='flex justify-center'>
                        <span>No hay ninguna venta activa</span>
                    </div>
                    :
                    <div className="overflow-x-auto flex flex-col gap-5">
                        <table className="w-full table-fixed border-collapse">
                            <thead>
                                <tr className="bg-gray-200 border-b">
                                    <th className="w-1/5 p-2 text-left">Código</th>
                                    <th className="w-1/5 p-2 text-left">Producto</th>
                                    <th className="w-1/5 p-2 text-center">Cantidad</th>
                                    <th className="w-1/5 p-2 text-right">Precio Unitario</th>
                                    <th className="w-1/5 p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.products?.map((value, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="w-1/5 p-2 text-left">{value.product.code}</td>
                                        <td className="w-1/5 p-2 text-left">{value.product.title}</td>
                                        <td className="w-1/5 p-2 text-center">
                                            <div className='flex justify-center'>
                                                {
                                                    value.quantity - 1 !== 0 &&
                                                    <button className='mr-1 cursor-pointer' onClick={(e)=> handleRemove(e, value)}>-</button>
                                                }
                                                <span>{value.quantity}</span>
                                                {
                                                    value.quantity + 1 <= value.product.stock &&
                                                    <button className='ml-1 cursor-pointer' onClick={(e)=> handleAdd(e, value)}>+</button>
                                                }
                                            </div></td>
                                        <td className="w-1/5 p-2 text-right">$ {value.product.sellingPrice.toFixed(2)}</td>
                                        <td className="w-1/5 p-2 text-right">$ {value.totalPrice.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='flex justify-center'>
                            <button className='p-1 rounded border border-black bg-red-500 text-white font-bold transition-all duration-300 hover:cursor-pointer hover:bg-red-900' onClick={clearCart}>Eliminar todo</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Sell
