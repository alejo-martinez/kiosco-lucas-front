'use client';

import React, {createContext, useContext, useEffect, useState} from "react";

import api from "@/app/utils/axios.config";
import socket from "@/app/utils/socket.config";
import { toast } from "react-toastify";

const ProductContext = createContext(undefined);

export const ProductProvider = ({children})=>{

    const [products, setProducts] = useState([]);

    useEffect(()=>{
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
    },[]);

    return(
        <ProductContext.Provider value={{products, setProducts}}>
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