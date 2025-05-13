'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/app/utils/axios.config';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import AdminRoute from '@/components/AdminRoute';
import generateStats from '@/app/utils/generateStatics';
import Statics from '@/components/Statics';


function ResumeId() {

  const percentageSellers = process.env.NEXT_PUBLIC_DESCUENTO_VENDEDORES;

  const params = useParams();
  const { user } = useSession();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualDate, setActualDate] = useState(null);
  const [showTickets, setShowTickets] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [statics, setStatics] = useState(null);


  const formatDateForUser = () => {
    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    setActualDate(date.toLocaleDateString("es-ES", options))
  };
  useEffect(() => {
    formatDateForUser();
  }, []);

  const formatPaymentMethod = (data) => {
    switch (data) {
      case "eft":
        return "Efectivo"

      case "mp":
        return "Mercado Pago"

      case "td":
        return "Tarjeta de débito"
      case "tc":
        return "Tarjeta de crédito"
      default:
        break;
    }
  }

  const formatDate = (date) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Mostrar en formato de 24 horas
      timeZone: 'America/Argentina/Buenos_Aires' // Especifica la zona horaria de Argentina
    };
    return new Date(date).toLocaleDateString('es-AR', options);
  }

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/resume/summary/${params.id}`);
      const data = response.data;
      const resumeStatics = generateStats(data.payload);
      setStatics(resumeStatics);
      setResume(data.payload);
      setLoading(false);
    } catch (error) {
      toast.error(error.message, {
        duration: 2000,
        hideProgressBar: true,
        pauseOnFocusLoss: false,
        pauseOnHover: false
      })
    }
  }

  const handleShowExpenses = (e) =>{
    e.preventDefault();
    setShowExpenses(!showExpenses);
  }

  const handleShowTickets = (e) => {
    e.preventDefault();
    setShowTickets(!showTickets);
  }

  useEffect(() => {
    fetchData();
  }, [params.id]);

  return (
    <div>
      {loading ? <p>Cargando...</p>
        :
        <div className='grid grid-cols-[0.2fr_4fr_1.5fr] grid-rows-[auto_1fr_auto] h-screen gap-2 p-2'>
          <div className='row-span-2 bg-gray-200 p-4'>
            <Sidebar />
          </div>
          <div className='flex col-span-2 bg-gray-200 p-4 justify-end'>
            {user &&
              <div className='flex flex-col p-3'>
                <span>Usuario activo: {user.name}</span>
                <span>{actualDate}</span>
              </div>
            }
          </div>

          <div className='flex flex-col justify-center items-center col-span-2'>
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto border border-gray-300">
              {/* Header */}
              <h4 className="text-2xl font-bold text-gray-800">
                Jornada iniciada: {formatDate(resume.init_date.init)} hs
              </h4>
              <h4 className="text-2xl font-bold text-gray-800 border-b pb-2">
                {resume.finish_date && `Jornada finalizada: ${formatDate(resume.finish_date.end)} hs`}
              
              </h4>

              {/* Datos del vendedor */}
              <div className="mt-4">
                <div>

                  <span className="text-gray-600 text-sm">Abrió:</span>
                  <span className="font-semibold text-gray-800 ml-2">{resume.init_date.seller.name}</span>
                </div>
                <div>
                {resume.finish_date? 
                <div>
                  <span className="text-gray-600 text-sm">Cerró:</span>
                  <span className="font-semibold text-gray-800 ml-2">{resume.finish_date.seller.name}</span>
                </div>
                :
                <div>
                  <span className="text-gray-600 font-bold text-sm">Jornada en curso</span>
                </div>
                }
                </div>
                <div>

                  <span className="text-gray-600 text-sm">Caja inicial:</span>
                  <span className="font-semibold text-gray-800 ml-2">${resume.initAmount}</span>
                </div>
              </div>

              {/* Lista de productos */}
              <h4 className="mt-4 text-lg font-semibold text-gray-700 border-b pb-1">Productos:</h4>
              <div className="flex flex-col gap-4 mt-2">
                {resume.products.map((value, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                    <div className='flex flex-col'>
                      <h5 className="font-semibold text-gray-900">{value.product.title}</h5>
                      <span className="text-sm text-gray-600">Cantidad: {value.quantity}</span>
                      {(user && user.role === 'admin') &&
                        <div className='flex flex-col
                      '>
                          <span className="text-sm text-gray-600">Ganancia: ${value.ganancia.toFixed(2)}</span>
                          <span className="text-sm text-gray-600">Porcentaje de ganancia: {value.porcentajeGanancia.toFixed(2)}%</span>
                        </div>
                      }
                    </div>
                    <span className="text-gray-900 font-semibold">${value.total}</span>
                  </div>
                ))}
              </div>
              <div className='flex flex-col gap-4 mt-2 justify-self-center'>
                {!showTickets ?
                  <button onClick={handleShowTickets} className='p-1 cursor-pointer bg-blue-400 rounded text-white w-fit'>Mostrar ventas</button>
                  :
                  <div>
                    <button onClick={handleShowTickets} className='p-1 cursor-pointer bg-blue-400 rounded text-white w-fit'>Cerrar ventas</button>
                    <h4 className="mt-4 text-lg font-semibold text-gray-700 border-b pb-1">Ventas:</h4>
                    <div className="flex flex-col gap-4 mt-2">
                      {resume.tickets?.map((value, index) => {
                        if (user?.role !== 'admin' && value.ticket.seller._id !== user?._id) return;
                        else return (
                          <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                            <div className='flex flex-col'>
                              <span className="font-medium">Venta realizada por:  {value.ticket.seller.name}</span>
                              <span className="text-sm text-gray-600">Realizada el: {formatDate(value.ticket.created_at)}</span>
                              <span className="text-sm text-gray-600">Productos vendidos: {value.ticket.products.length}</span>
                              <span className="text-sm text-gray-600">Medio de pago: {formatPaymentMethod(value.ticket.payment_method)}</span>
                              <span className="text-sm text-gray-600">Total: ${value.ticket.amount}</span>
                              <span className='text-center text-blue-600 font-bold'><Link href={`/sells/${value.ticket._id}`}>Ver venta</Link></span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                }
                {user?.role === 'admin' &&(
                  !showExpenses ?
                    <button onClick={handleShowExpenses} className='p-1 cursor-pointer bg-blue-400 rounded text-white w-fit'>Mostrar consumos</button>
                    :
                    <div>
                      <button onClick={handleShowExpenses} className='p-1 cursor-pointer bg-blue-400 rounded text-white w-fit'>Cerrar consumos</button>
                      <h4 className="mt-4 text-lg font-semibold text-gray-700 border-b pb-1">Consumos:</h4>
                      <div className="flex flex-col gap-4 mt-2">
                        {resume.expenses?.map((value, index) => {
                          if (user?.role !== 'admin' && value.expense.user._id !== user?._id) return;
                          else return (
                            <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                              <div className='flex flex-col'>
                                <span className="font-medium">Consumo de: {value.expense.user.name}</span>
                                <span className="text-sm text-gray-600">Realizado el: {formatDate(value.expense.created_at)}</span>
                                <span className="text-sm text-gray-600">Producto: {value.expense.product.title}</span>
                                <span className="text-sm text-gray-600">Cantidad: {value.expense.quantity}</span>
                                <span className="text-sm text-gray-600">Total a pagar: ${((value.expense.product.sellingPrice * percentageSellers) * value.expense.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                )}
              </div>
              <h4 className="mt-4 text-lg font-semibold text-gray-700 border-b pb-1">Métodos de pago:</h4>
              <div className="flex flex-col gap-4 mt-2">
                {resume.amount_per_method.map((value, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                    <div className='flex flex-col'>
                      <span className="font-medium">Método de pago:  {formatPaymentMethod(value.method)}</span>
                      <span className="text-sm text-gray-600">Total: ${value.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total y método de pago */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total vendido:</span>
                  <span>${resume.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          {/* <Statics stats={statics} /> */}
          </div>
        </div>
      }
    </div>
  )
}

export default ResumeId;