'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import { useSession } from "./SessionContext";

const CartContext = createContext(undefined);

export const CartProvider = ({children}) => {
    const {user} = useSession();
    const [cart, setCart] = useState([]);


    useEffect(()=>{
        if(user){
            setCart(user.cart);
        }
    })

    return (
        <CartContext.Provider value={{cart}}>
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