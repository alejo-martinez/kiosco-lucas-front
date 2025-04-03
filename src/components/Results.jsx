'use client';

import React from 'react';
import { useProduct } from '@/context/ProductContext';
import { useSession } from '@/context/SessionContext';
import { useCart } from '@/context/CartContext';
import socket from '@/app/utils/socket.config';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useResume } from '@/context/ResumeContext';



function Results() {
    const rodrigoId = process.env.NEXT_PUBLIC_RODRIGO_ID;
    const router = useRouter();
    const pathname = usePathname();

    const { products, setShowStockModal, setUpdateProd } = useProduct();
    const { user } = useSession();
    const { cart } = useCart();

    const handleAdd = async (e, value) => {
        e.preventDefault();

        const finded = cart.products.find((prod) => prod.product._id === value._id);

        if (finded) {

            if (finded.quantity + 1 > value.stock) {
                toast.error('Límite de stock alcanzado', {
                    duration: 1300,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false
                })
            } else {
                socket.emit('addToCart', { cid: user.cart._id, pid: value._id, quantity: 1 })
            }
        } else {
            socket.emit('addToCart', { cid: user.cart._id, pid: value._id, quantity: 1 })
        }
    }

    const handleEdit = (e, id) => {
        e.preventDefault();
        router.push(`/panel/update/${id}`);
    }

    const handleAddStock = (e, prod) => {
        e.preventDefault();
        setUpdateProd(prod)
        setShowStockModal(true);
    }



    return (
        <div>
            {products.length !== 0 &&
                <table className="w-4xl border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border border-gray-300 text-left">Código</th>
                            <th className="p-2 border border-gray-300 text-left">Producto</th>
                            <th className="p-2 border border-gray-300 text-right">Precio</th>
                            <th className="p-2 border border-gray-300 text-right">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((value, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="p-2 border border-gray-300">{value.code}</td>
                                <td className="p-2 border border-gray-300">{value.title}</td>
                                <td className="p-2 border border-gray-300 text-right">${value.sellingPrice}</td>
                                <td className="p-2 border border-gray-300 text-right">{value.stock}</td>
                                {pathname !== '/panel' ?
                                    <td className="border border-gray-300 text-center"><button className='bg-blue-600 rounded p-1 text-white hover:cursor-pointer' onClick={(e) => handleAdd(e, value)}>Agregar</button></td>
                                    :
                                    (
                                        user._id === rodrigoId ?
                                            <td className="border border-gray-300 text-center"><button className='bg-green-600 rounded p-1 text-white hover:cursor-pointer' onClick={(e) => handleAddStock(e, value)}>Agregar stock</button></td>
                                            :
                                            <td className="border border-gray-300 text-center"><button className='bg-green-600 rounded p-1 text-white hover:cursor-pointer' onClick={(e) => handleEdit(e, value._id)}>Editar</button></td>
                                    )
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default Results;