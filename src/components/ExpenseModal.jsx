"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useResume } from "@/context/ResumeContext";
import socket from "@/app/utils/socket.config";
import api from "@/app/utils/axios.config";
import { toast } from "react-toastify";
import { useProduct } from "@/context/ProductContext";

export default function ExpenseModal() {

    const { showExpenseModal, setShowExpenseModal, resumeId } = useResume();
    const { setProducts } = useProduct();
    const [quantityValue, setQuantityValue] = useState(1);
    const [querySearch, setQuerySearch] = useState('');
    const [prod, setProd] = useState(null);

    const handleChangeEmptyInput = (e) => {
        if (e.target.value === '') {
            setProducts([]);
        } else {
            setQuerySearch(e.target.value);
        }
    }

    const handleSearchByCode = async (e) => {
        if (e.key === 'Enter') {
            socket.emit('searchByCode', { code: e.target.value });
            setQuerySearch('');
        }
    }

    const closeModal = () => {
        setProducts([]);
        setShowExpenseModal(false);
    }

    const handleSubmit = async (e) => {
        try {
            if (!prod) return toast.error('Debes agregar un producto', {
                duration: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                hideProgressBar: true,
                closeButton: false
            })
            if (!resumeId) return toast.error('Debes iniciar el día primero', {
                duration: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                hideProgressBar: true,
                closeButton: false
            })
            const response = await api.post('/api/expense/create', { productId: prod._id, resumeId: resumeId, quantity: quantityValue });
            const data = response.data;
            if (data.status === 'success') {
                setProducts([]);
                setShowExpenseModal(false);
                toast.success(data.message, {
                    duration: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    closeButton: false
                })
            }
        } catch (error) {
            toast.error(error.message, {
                duration: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                hideProgressBar: true,
                closeButton: false
            })
            console.error("Error en la petición:", error);
        }
    };

    const plusExpense = (e) => {
        e.preventDefault();
        const newValue = quantityValue + 1;
        setQuantityValue(newValue)
    }

    const minusExpense = (e) => {
        e.preventDefault();
        const newValue = quantityValue - 1;
        setQuantityValue(newValue);
    }

    useEffect(() => {
        socket.on('resultTitle', data => {
            if (data.results[0].stock <= 0) return toast.error('No hay stock del producto', {
                duration: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                hideProgressBar: true,
                closeButton: false
            })
            setProd(data.results[0]);
        })

        return () => {
            setProd(null)
            setQuantityValue(1);
        }
    }, [showExpenseModal]);

    return (
        <>
            <Transition appear show={showExpenseModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>

                    <div className="fixed inset-0 bg-black bg-opacity-50" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">

                        <div className="flex flex-col w-full max-w-md bg-white p-6 rounded-lg shadow-lg justify-center">

                            <h2 className="text-2xl font-medium text-gray-900 text-center">
                                Agregar consumo
                            </h2>

                            <div className="flex flex-col mt-6 justify-center items-center">
                                <span>Escanear producto</span>
                                <input type="text" name='query' className='border p-1 rounded' value={querySearch} onChange={handleChangeEmptyInput} onKeyDown={handleSearchByCode} />
                            </div>

                            {prod &&
                                <div className="flex flex-col justify-center bg-gray-200 mt-3 p-3 rounded items-center">
                                    <h5>Producto: {prod.title}</h5>
                                    <div className="flex items-center justify-center">
                                        {quantityValue - 1 > 0 &&
                                            <button className="cursor-pointer" onClick={minusExpense}>-</button>
                                        }
                                        <span>{quantityValue}</span>
                                        {quantityValue + 1 <= prod.stock &&
                                            <button className="cursor-pointer" onClick={plusExpense}>+</button>
                                        }
                                    </div>
                                    <span>Precio para el vendedor: ${((prod.sellingPrice * 0.2) * quantityValue).toFixed(2)}</span>
                                </div>
                            }

                            <div className="mt-4 flex justify-center gap-2">
                                <button onClick={closeModal} className="bg-red-600 p-1 rounded text-white cursor-pointer">Cancelar</button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
