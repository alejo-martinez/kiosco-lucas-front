'use client';

import React, {createContext, useContext, useEffect, useState} from "react";

import api from "@/app/utils/axios.config";
import socket from "@/app/utils/socket.config";
import { toast } from "react-toastify";
import { useSession } from "./SessionContext";

const ProductContext = createContext(undefined);

export const ProductProvider = ({children})=>{
    const {user} = useSession();
    const [products, setProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    const fetchProducts = async () =>{
        try {
            const response = await api.get('/api/products/lowstock');
            const data = response.data;
            if(data.status==='success'){
                if(data.payload.length > 0){
                    setLowStockProducts(data.payload);
                    toast.info('Tienes productos con bajo stock!',{
                        duration: 1000,
                        pauseOnHover:false,
                        hideProgressBar:true,
                        pauseOnFocusLoss:false
                    })
                }
                else{
                    toast.info('No tienes productos con bajo stock',{
                        duration: 1000,
                        pauseOnHover:false,
                        hideProgressBar:true,
                        pauseOnFocusLoss:false
                    })
                }
            }        
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(user) fetchProducts();
        
        socket.on('resultTitle', data => {
            if(data.results.length === 0){
                toast.error('No hay resultados disponibles', {
                    duration: 3000,
                    pauseOnHover:false,
                    hideProgressBar:true
                })
            } else {

                setProducts(data.results);
            }
        })

        socket.on('lowstock', data=>{
            const lowStock = [...lowStockProducts];
            lowStock.push(data.prod);
            setLowStockProducts(lowStock);
            toast.info('Tienes un nuevo producto con bajo stock',{
                duration: 1000,
                pauseOnHover:false,
                hideProgressBar:true,
                pauseOnFocusLoss:false
            })
        })
    },[user]);

    return(
        <ProductContext.Provider value={{products, setProducts, lowStockProducts}}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProduct = ()=>{
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useCart must be used within a ProductProvider');
    }
    return context;
}