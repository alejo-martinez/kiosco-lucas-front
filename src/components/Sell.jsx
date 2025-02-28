'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

function Sell() {

    const { cart } = useCart();
    // console.log(cart)
    return (
        <div>
            <div>
                {cart.products?.length === 0 ?
                    <div>
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
                                        <td className="w-1/5 p-2 text-center">{value.quantity}</td>
                                        <td className="w-1/5 p-2 text-right">$ {value.product.sellingPrice}</td>
                                        <td className="w-1/5 p-2 text-right">$ {value.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='flex justify-center'>
                            <button className='p-1 rounded border border-black bg-red-500 text-white font-bold transition-all duration-300 hover:cursor-pointer hover:bg-red-900'>Eliminar todo</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Sell
