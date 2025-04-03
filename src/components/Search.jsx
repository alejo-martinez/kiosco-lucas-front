'use client';

import React, { useState, useEffect } from 'react';
import socket from '@/app/utils/socket.config';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

import { useProduct } from '@/context/ProductContext';

function Search() {

    const pathname = usePathname();
    const {setProducts} = useProduct();
    const { user } = useSession();
    const { cart } = useCart();

    // const [products, setProducts] = useState([]);
    const [lectorDesactivated, setLectorDesactivated] = useState(false);
    const [searchByCode, setSearchByCode] = useState(false);
    const [querySearch, setQuerySearch] = useState('');


    const handleChecked = (e) => {
        if (!e.target.checked) {
            setProducts([]);
            setQuerySearch('');
        }
        setLectorDesactivated(e.target.checked);
    }

    const handleSearch = (e) => {
        
        if(e.target.value === ''){
            setProducts([]);
            setQuerySearch('')
        } else{

            // e.preventDefault();
            setQuerySearch(e.target.value);
            socket.emit('searchTitle', { query: e.target.value, socketId: socket.id });
        }
    }

    const handleCheckedSearch = (e) => {
        setSearchByCode(e.target.checked);
    }


    const handleSearchByCode = async (e) => {
        if (e.key === 'Enter') {
            if(pathname === '/'){
                socket.emit('search', { query: e.target.value, cid: user.cart, quantity: 1 });
                setQuerySearch('');
            } else{
                socket.emit('searchByCode', { code: e.target.value });
                setQuerySearch('');  
            }
            // e.target.value = '';
            // inputRef.current.value ="";
        }
    }

    const handleSearchProductByCode = (e) => {
        if (e.key === 'Enter') {
            socket.emit('searchByCode', { code: e.target.value });
        }
    }

    const handleChangeEmptyInput = (e) =>{
        if(e.target.value === ''){
            setProducts([]);
        } else{
            setQuerySearch(e.target.value);
        }
    }

    useEffect(() => {
        socket.on('resultTitle', data => {
            
            if(data.results.length === 0){
                toast.error('No hay resultados disponibles', {
                    duration: 3000,
                    pauseOnHover:false,
                    hideProgressBar:true
                })
            } else {
                setProducts(data.results);
                // console.log(data);
            }
        })

        // socket.on()
    }, []);

    return (
        <div className='flex flex-col justify-center gap-y-10'>
            {!lectorDesactivated ?
                <div className='flex justify-center gap-4 mt-4'>
                    
                    <input type="text" name='query' className='border p-1 rounded' value={querySearch} onChange={handleChangeEmptyInput} onKeyDown={searchByCode ? handleSearchProductByCode : handleSearchByCode}/>
                    
                    <div className='flex flex-col gap-2 items-center'>
                        <div className='flex items-center gap-2'>
                            <label>Desactivar lector</label>
                            <input type="checkbox" onChange={handleChecked} checked={lectorDesactivated} />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label>Buscar por código</label>
                            <input type="checkbox" onChange={handleCheckedSearch} checked={searchByCode} />
                        </div>
                    </div>
                </div>
                :
                <div className='flex justify-center gap-4 mt-4'>
                    <input type="text" placeholder='¿Que producto queres buscar?' value={querySearch} onChange={handleSearch} className='border rounded p-1 w-4/5' />
                    <div className='flex gap-2 items-center'>
                        <label>Desactivar lector</label>
                        <input type="checkbox" onChange={handleChecked} checked={lectorDesactivated} />
                    </div>
                </div>
            }
        </div>
    )
}

export default Search
