'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/utils/axios.config";
import { useRouter } from "next/navigation";

const SessionContext = createContext(undefined);
export const SessionProvider = ({ children }) => {
    const url = process.env.NEXT_PUBLIC_URL_BACK;
    
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [adminLogued, setAdminLogued] = useState(false);
    const [loading, setLoading] = useState(true);

    const login = async (userLogin) => {
        try {
            const response = await api.post(`${url}/api/session/login`, userLogin);
            const data = response.data;
            setUser(data.payload);
            localStorage.setItem('user', JSON.stringify(data.payload));
            return data;
        } catch (error) {
            if(error.response){
                return error.response.data;
            }if(error.request){
                console.log(error.request)
            } else{
                console.log(error);
            }
        }
    };

    const register = async (userRegister) => {
        try {
            const response = await api.post('/api/session/register', {userRegister});
            const data = response.data;
            return data;
        } catch (error) {
            if(error.response){

            }if(error.request){

            } else{

            }
        }
    };

    const logout = async()=>{
        try {
            const response = await api.delete('/api/session/logout');
            const data = response.data;
            setUser(null)
            localStorage.removeItem('user');
            return data;
        } catch (error) {
            if(error.response){
                return error.response.data;
            }if(error.request){
                console.log(error.request)
            } else{
                console.log(error);
            }
        }
    }

    const currentUser = async () => {
        try {
            const response = await api.get('/api/session/current');
            const data = response.data;
            if(data.payload.role === 'admin') setAdminLogued(true)
            return data;
        } catch (error) {
            if(error.response){
                return error.response.data;
            }if(error.request){
                console.log(error.request);
            } else{
                console.log(error);
            }
        }
    };

    useEffect(()=>{
        const fetchData = async()=>{
            const data = await currentUser();
            if(data.status === 'success'){
                setUser(data.payload);
                localStorage.setItem('user', JSON.stringify(data.payload));
                setLoading(false);
            } else {
                setLoading(false);
                router.push('/login');
            }
        }
        fetchData();
    },[]);

    return (
        <SessionContext.Provider value={{user, login, register, logout, adminLogued}}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}