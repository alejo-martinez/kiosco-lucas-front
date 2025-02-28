'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

function Payment() {

    const [amount, setAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('eft');

    const { cart } = useCart();

    const handleChange = (e)=>{
        e.preventDefault();
        setPaymentMethod(e.target.value);
    }

    useEffect(() => {
        let newAmount = 0;
        cart.products?.forEach(prod => {
            newAmount += prod.totalPrice
        });
        setAmount(newAmount);
    }, [cart.products]);

    return (
        <div className='flex flex-col justify-self-end border w-sm p-2 rounded gap-4'>
            <div className='flex justify-between'>
                <h4 className='text-3xl'>Total a pagar:</h4>
                <span className='text-3xl'>${amount}</span>
            </div>
            <div className='flex justify-between items-center'>
                <span className='text-2xl'>Abona:</span>
                <div className='flex items-center justify-end'>
                    <span className='font-bold text-xl mr-1'>$</span>
                    <input type="number" className='border rounded w-2/5 p-1' />
                </div>
            </div>
            <div className='flex justify-between'>
                <span>Medio de pago:</span>
                <select name="payment_method" onChange={handleChange} className='rounded border w-2/5'>
                    <option value="eft">Efectivo</option>
                    <option value="mp">Mercado Pago</option>
                    <option value="td">Tarjeta de débito</option>
                    <option value="tc">Tarjeta de crédito</option>
                </select>
            </div>
            <div className='flex flex-col gap-4'>
                <button className='border rounded p-1 w-fit bg-green-500 text-white border-black transition-all duration-300 hover:cursor-pointer hover:bg-green-900 hover:cursor-pointer'>Realizar venta</button>
                <button className='border rounded p-1 w-fit bg-blue-500 text-white border-black transition-all duration-300 hover:cursor-pointer hover:bg-blue-900'>Realizar venta con pago justo</button>
            </div>
        </div>
    )
}

export default Payment;
