'use client';

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./SessionContext";
import api from "@/utils/axios.config";
import socket from "@/utils/socket.config";
// import { toast } from "react-toastify";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
    const router = useRouter();
    const { user } = useSession();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async (cid) => {
        const response = await api.get(`/api/cart/${cid}`);
        const data = response.data;
        if (data.status === 'success') {
            setCart(data.payload);
            // console.log(data.payload)
        }
    }


    const emptyCart = async (cid) => {
        try {
            const response = await api.delete(`/api/cart/empty/${cid}`);

            const data = response.data;
            if (data.status === 'success') setCart(data.payload);
            return data;
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
            } else {
                console.log(error);
                return error;
            }
        }
    }

    const removeProductById = async (pid) => {
        try {
            const response = await api.put(`/api/cart/remove/prod/${user.cart}`, { pid: pid });
            const data = response.data;
            if (data.status === 'success') {
                setCart(data.payload);
                return data;
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
            } else {
                console.log(error);
                return error;
            }
        }
    }

    useEffect(() => {
        if (user) {
            fetchCart(user.cart);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        socket.on('updatedCart', data => {
            setCart(data.cart);
        }, [])
    })

    return (
        <CartContext.Provider value={{ cart, emptyCart, setCart, removeProductById, loading }}>
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