'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/app/utils/axios.config';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import AdminRoute from '@/components/AdminRoute';

function ResumeId() {

  const params = useParams();
  const { user } = useSession();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualDate, setActualDate] = useState(null);

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
      console.log(data.payload)
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
                <div className=''>
                  {/* <Link href={"/panel"} className='text-center p-1 bg-blue-200 rounded font-bold'>Volver</Link> */}
                </div>
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
                Jornada finalizada: {formatDate(resume.finish_date.end)} hs
              </h4>

              {/* Datos del vendedor */}
              <div className="mt-4">
                <div>

                  <span className="text-gray-600 text-sm">Abrió:</span>
                  <span className="font-semibold text-gray-800 ml-2">{resume.init_date.seller.name}</span>
                </div>
                <div>

                  <span className="text-gray-600 text-sm">Cerró:</span>
                  <span className="font-semibold text-gray-800 ml-2">{resume.finish_date.seller.name}</span>
                </div>
              </div>

              {/* Lista de productos */}
              <h4 className="mt-4 text-lg font-semibold text-gray-700 border-b pb-1">Productos:</h4>
              <div className="flex flex-col gap-4 mt-2">
                {resume.products.map((value, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                    <div>
                      <h5 className="font-semibold text-gray-900">{value.product.title}</h5>
                      <span className="text-sm text-gray-600">Cantidad: {value.quantity}</span>
                    </div>
                    <span className="text-gray-900 font-semibold">${value.total}</span>
                  </div>
                ))}
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
                  <span>${resume.amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default AdminRoute(ResumeId);