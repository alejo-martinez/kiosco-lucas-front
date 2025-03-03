'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import { useSession } from "./SessionContext";
import api from "@/app/utils/axios.config";
import socket from "@/app/utils/socket.config";

const CartContext = createContext(undefined);

export const CartProvider = ({children}) => {
    const {user} = useSession();
    const [cart, setCart] = useState([]);

    const fetchCart = async(cid)=>{
        const response = await api.get(`/api/cart/${cid}`);
        const data = response.data;
        if(data.status === 'success'){
            setCart(data.payload);
            console.log(data.payload)
        }
    }


    const emptyCart = async(cid)=>{
        try {
            const response = await api.delete(`/api/cart/empty/${cid}`);
            const data = response.data;
            if(data.status === 'success') setCart(data.payload);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(user){
            fetchCart(user.cart._id);
        }
    },[]);

    useEffect(()=>{
        socket.on('updatedCart', data =>{
            setCart(data.cart);
        },[])
    })

    return (
        <CartContext.Provider value={{cart, emptyCart, setCart}}>
                {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}