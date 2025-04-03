'use client';

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import api from "@/app/utils/axios.config";

import { useProduct } from "@/context/ProductContext";
import { toast } from "react-toastify";
import socket from "@/app/utils/socket.config";

function AddStock() {

    const { showStockModal, setShowStockModal, updateProd, setUpdateProd, products, setProducts } = useProduct();

    const [inputValue, setInputValue] = useState(0);

    const closeModal = () => {
        setShowStockModal(false);
    }

    const handleChange = (e)=>{
        let value = e.target.value;
        if (value.startsWith("0")) {
          value = value.replace(/^0+/, ""); 
      }
        setInputValue(value);
      }
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await api.put(`/api/products/update/${updateProd._id}`, { field: 'stock', value: inputValue });
            const data = response.data;
            if(data.status === 'success'){
                products[0].stock += Number(inputValue);
                products[0].totalStock += Number(inputValue);
                setProducts([])
                socket.emit('resultTitle', {results:products})
                toast.success('Stock agregado !', {
                    duration: 3000,
                    pauseOnHover:false,
                    hideProgressBar:true,
                    pauseOnFocusLoss:false
                })
                setShowStockModal(false);
                
            }
        } catch (error) {
            toast.error(`Error al actualizar el producto: ${error.message}`,{
                duration: 3000,
                pauseOnHover:false,
                hideProgressBar:true,
                pauseOnFocusLoss:false
            })
        }
    }

    return (
        <>
            <Transition appear show={showStockModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>

                    <div className="fixed inset-0 bg-black bg-opacity-50" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">

                        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">

                            <h2 className="text-lg font-medium text-gray-900 text-center">
                                Ingrese el stock a agregar
                            </h2>

                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleChange}
                                className="mt-4 w-full border rounded px-3 py-2"
                                placeholder="Escriba algo..."
                            />

                            <div className="mt-4 flex justify-center gap-2">
                                <button onClick={closeModal} className="bg-red-600 p-1 rounded text-white cursor-pointer">Cancelar</button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default AddStock