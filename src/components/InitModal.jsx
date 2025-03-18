"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useResume } from "@/context/ResumeContext";

export default function ModalComponent() {

    const {showModal, setShowModal, createResume} = useResume();

//   const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(0);


  const handleChange = (e)=>{
    setInputValue(e.target.value);
  }

  const closeModal = () =>{
    setShowModal(false);
  }

  const handleSubmit = async (e) => {
    try {
        e.preventDefault();
        const response = await createResume('diary', inputValue);
        localStorage.setItem('resumeId', response.id);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>

          <div className="fixed inset-0 bg-black bg-opacity-50" />

          <div className="fixed inset-0 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">

              <h2 className="text-lg font-medium text-gray-900 text-center">
                Ingrese el monto inicial de la caja
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
