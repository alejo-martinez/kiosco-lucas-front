'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios.config";
import { toast } from "react-toastify";

const ResumeContext = createContext(undefined);

export const ResumeProvider = ({ children }) => {

    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [resumeId, setResumeId] = useState(null);
    const [initAmount, setInitAmount] = useState(0)

    const fetchActiveResume = async () => {
        try {
            const response = await api.get('/api/resume/active/summary');
            const data = response.data;
            if (data.status === 'success') {
                const payload = data.payload;
                if (payload) {
                    setResumeId(payload._id);
                    localStorage.setItem('resumeId', payload._id);
                } else {
                    setShowModal(true);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const resumeExist = localStorage.getItem('resumeId');

        if (!resumeExist || resumeExist === 'undefined') {

            fetchActiveResume();
        }
        else setResumeId(resumeExist);
    }, []);


    const createResume = async (cat, initAmount) => {
        try {
            const response = await api.post(`/api/resume/create/${cat}`, { initAmount: initAmount });
            const data = response.data;
            toast.success(data.message, {
                autoClose: 2000,
                closeButton: true,
                hideProgressBar: true,
                className: 'toast-success'
            });
            setShowModal(false);
            setResumeId(data.id)
            return data;
        } catch (error) {
            if (error.status === 403) {
                toast.error(error.response.data.error, {
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false,
                    className: 'toast-error'
                });
                router.push('/login')
                return error.response.data
            } else {
                console.log(error);
                toast.error(error.message, {
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false,
                    className: 'toast-error'
                })
                return error;
            }
        }
    }

    const initDay = () => {
        setShowModal(true);
    }

    const endDay = async () => {
        try {
            const response = await api.put(`/api/resume/end/${resumeId}`);
            const data = response.data;

            setResumeId('');
            localStorage.removeItem('resumeId');
            return data;
        } catch (error) {
            if (error.status === 403) {
                toast.error(error.response.data.error, {
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false,
                    className: 'toast-error'
                });
                router.push('/login')
                return error.response.data
            } else {
                console.log(error);
                toast.error(error.message, {
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false,
                    className: 'toast-error'
                })
                return error;
            }
        }

    }

    const openExpenseModal = () => {
        setShowExpenseModal(true);
    }



    return (
        <ResumeContext.Provider value={{ showModal, setShowModal, createResume, resumeId, initDay, endDay, setShowExpenseModal, showExpenseModal, initAmount, setInitAmount, openExpenseModal }}>
            {children}
        </ResumeContext.Provider>
    )
}

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
}