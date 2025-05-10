'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import api from '@/app/utils/axios.config';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useResume } from '@/context/ResumeContext';

function Payment() {

    const router = useRouter();

    const { resumeId } = useResume();
    const [amount, setAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('eft');
    const [payment, setPayment] = useState(0);
    // const [pay, setPay] = useState(0);
    const [vuelto, setVuelto] = useState(0);

    const { cart, setCart } = useCart();

    const handleChange = (e) => {
        e.preventDefault();
        setPaymentMethod(e.target.value);
    }

    const handlePayment = (e) => {
        // e.preventDefault();
        let value = e.target.value;

        // Eliminar ceros a la izquierda
        if (value.startsWith("0")) {
            value = value.replace(/^0+/, "");
        }
        // Actualizar el estado del input general
        setPayment(value);
    }

    const cleanVuelto = () => {
        setVuelto(0);
    }

    const enterSell = async (e) => {
        try {
            if (e.code === 'NumpadEnter') {

                if (payment === 0) {
                    throw new Error('Monto insuficiente');
                }
                if (payment > 0) {
                    const vueltoResult = Number(payment) - Number(amount);
                    if (vueltoResult < 0) {
                        throw new Error('Monto para abonar insuficente')
                    }
                    if (vueltoResult > 0) setVuelto(vueltoResult)
                }
                const response = await api.post('/api/ticket/create', { amount: amount, payment_method: paymentMethod, rid: resumeId });
                const data = response.data;
                setPayment(0)
                setAmount(0);
                setCart(data.payload)
                toast.success(data.message, {
                    duration: 2000,
                    closeButton: true,
                    hideProgressBar: true
                })
            }
        } catch (error) {
            if (error.status === 403) {
                toast.error(error.response.data.error, {
                    duration: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false
                });
                router.push('/login')
                return error.response.data
            } else if (error.response) {
                toast.error(error.response.data.error, {
                    duration: 3000
                })
            } else {
                console.log(error);
                toast.error(error.message, {
                    duration: 2000,
                    hideProgressBar: true,
                    pauseOnHover: false,
                    pauseOnFocusLoss: false
                })
                return error;
            }
        }
    }

    const completeSell = async (e) => {
        try {
            e.preventDefault();
            if (payment === 0 && paymentMethod === 'eft') {
                throw new Error('Monto insuficiente');
            }
            if (payment > 0) {
                const vueltoResult = Number(payment) - Number(amount);
                if (vueltoResult < 0) {
                    throw new Error('Monto para abonar insuficente')
                }
                if (vueltoResult > 0) setVuelto(vueltoResult)
            }
            const response = await api.post('/api/ticket/create', { amount: amount, payment_method: paymentMethod, rid: resumeId });
            const data = response.data;
            setPayment(0)
            setAmount(0);
            setCart(data.payload)
            toast.success(data.message, {
                duration: 2000,
                closeButton: true,
                hideProgressBar: true
            })
        } catch (error) {
            if (error.status === 403) {
                toast.error(error.response.data.error, {
                    duration: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false
                });
                router.push('/login')
                return error.response.data
            } else if (error.response) {
                toast.error(error.response.data.error, {
                    duration: 3000
                })
            } else {
                console.log(error);
                toast.error(error.message, {
                    duration: 2000,
                    hideProgressBar: true,
                    pauseOnHover: false,
                    pauseOnFocusLoss: false
                })
                return error;
            }

        }
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
            {paymentMethod === 'eft' &&
                <div className='flex flex-col justify-between items-center gap-6'>
                    <div className='flex'>

                        <span className='text-2xl'>Abona:</span>
                        <div className='flex items-center justify-end'>
                            <span className='font-bold text-xl mr-1'>$</span>
                            <input type="number" name='pay' value={payment} className='border rounded w-2/5 p-1' onChange={handlePayment} onKeyDown={enterSell} />
                        </div>
                    </div>
                    {vuelto > 0 &&
                        <div className='flex flex-col'>
                            <span>Vuelto: ${vuelto.toFixed(2)}</span>
                            <button onClick={cleanVuelto} className='bg-blue-600 p-1 rounded text-white cursor-pointer'>Limpiar</button>
                        </div>
                    }
                </div>
            }
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
                <button className='border rounded p-1 w-fit bg-green-500 text-white border-black transition-all duration-300 hover:cursor-pointer hover:bg-green-900 hover:cursor-pointer' onClick={completeSell}>Realizar venta</button>

            </div>
        </div>
    )
}

export default Payment;
