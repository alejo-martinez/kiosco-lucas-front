'use client';

import React, { useState, useEffect } from 'react';
import socket from '@/app/utils/socket.config';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useCart } from '@/context/CartContext';

function Search() {

    const {user} = useSession();
    const {cart} = useCart();

    const [products, setProducts] = useState([]);
    const [lectorDesactivated, setLectorDesactivated] = useState(false);
    const [querySearch, setQuerySearch] = useState('');

    
    const handleChecked = (e)=>{
        if(!e.target.checked){
            setProducts([]);
            setQuerySearch('');
        }
        setLectorDesactivated(e.target.checked);
    }

    const handleSearch = (e)=>{
        e.preventDefault();
        setQuerySearch(e.target.value);
        socket.emit('searchTitle', {query: e.target.value});
    }

    const handleAdd = async(e, value)=>{
        e.preventDefault();

        const finded = cart.products.find((prod)=> prod.product._id === value._id);

        if(finded){

            if(finded.quantity + 1 > value.stock){
                toast.error('Límite de stock alcanzado',{
                    duration:1300,
                    pauseOnHover:false,
                    hideProgressBar:true,
                    closeButton:false
                })
            } else {
                socket.emit('addToCart', {cid: user.cart._id, pid: value._id, quantity: 1})
            }
        } else {
            socket.emit('addToCart', {cid: user.cart._id, pid: value._id, quantity: 1})
        }
    }

    const handleQuery = (e)=>{
        setQuerySearch(e.target.value);
    }

    const handleSearchByCode = async(e)=>{
        // e.preventDefault();
        socket.emit('search', {query: querySearch, cid: user.cart._id, quantity: 1});
        e.target.value = '';
    }

    useEffect(()=>{
        socket.on('resultTitle', data =>{
            setProducts(data.results);
            console.log(data);
        })
    },[]);

    return (
        <div className='flex flex-col justify-center gap-y-10'>
            {!lectorDesactivated ?
                <div className='flex justify-center gap-4 mt-4'>
                    <input type="text" name='query' className='border p-1 rounded' onChange={handleQuery}/>
                    <button onClick={handleSearchByCode}>Buscar</button>
                    <div className='flex gap-2 items-center'>
                        <label>Desactivar lector</label>
                        <input type="checkbox" onChange={handleChecked} checked={lectorDesactivated}/>
                    </div>
                </div>
                :
                <div className='flex justify-center gap-4 mt-4'>
                    <input type="text" placeholder='¿Que producto queres buscar?' onChange={handleSearch} className='border rounded p-1 w-1/5'/>
                    <div className='flex gap-2 items-center'>
                        <label>Desactivar lector</label>
                        <input type="checkbox" onChange={handleChecked} checked={lectorDesactivated}/>
                    </div>
                </div>
            }
        <div className="flex justify-center overflow-x-auto">
            {products.length !== 0 && (
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
                                <td className="border border-gray-300 text-center"><button className='bg-blue-600 rounded p-1 text-white hover:cursor-pointer' onClick={(e) => handleAdd(e, value)}>Agregar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </div>
    )
}

export default Search
