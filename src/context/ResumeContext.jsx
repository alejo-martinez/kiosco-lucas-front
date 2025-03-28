'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import api from "@/app/utils/axios.config";
import { toast } from "react-toastify";

const ResumeContext = createContext(undefined);

export const ResumeProvider = ({children}) =>{

    const [showModal, setShowModal] = useState(false);
    const [resumeId, setResumeId] = useState(null);

    const fetchActiveResume = async()=>{
        try {
            const response = await api.get('/api/resume/active/summary');
            const data = response.data;
            if(data.status === 'success'){
                const payload = data.payload;
                if(payload){
                    setResumeId(payload._id);
                    localStorage.setItem('resumeId', payload.id);
                } else{
                    setShowModal(true);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        const resumeExist = localStorage.getItem('resumeId');
        if(!resumeExist){
            fetchActiveResume();
        }
        else setResumeId(resumeExist);
      },[]);
    

    const createResume = async(cat, initAmount)=>{
        try {
            const response = await api.post(`/api/resume/create/${cat}`, {initAmount: initAmount});
            const data = response.data;
            toast.success(data.message,{
                duration:2000,
                hideProgressBar:true,
                pauseOnHover:false,
                pauseOnFocusLoss:false
            });
            setShowModal(false);
            setResumeId(data.id)
            return data;
        } catch (error) {
            toast.error(error.message,{
                duration:2000,
                hideProgressBar:true,
                pauseOnHover:false,
                pauseOnFocusLoss:false
            })
        }
    }

    const initDay = ()=>{
        setShowModal(true);
    }

    const endDay = async()=>{
        try {
            const response = await api.put(`/api/resume/end/${resumeId}`);
            const data = response.data;
            toast.success(data.message,{
                duration:2000,
                hideProgressBar:true,
                pauseOnHover:false,
                pauseOnFocusLoss:false
            });
            setResumeId('');
            localStorage.removeItem('resumeId');
            return data.resumeId;
        } catch (error) {
            toast.error(error.message,{
                duration:2000,
                hideProgressBar:true,
                pauseOnHover:false,
                pauseOnFocusLoss:false
            })
        }

    }

    return(
        <ResumeContext.Provider value={{showModal, setShowModal, createResume, resumeId, initDay, endDay}}>
            {children}
        </ResumeContext.Provider>
    )
}

export const useResume = () =>{
    const context = useContext(ResumeContext);
    if(!context){
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
}