'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/utils/axios.config';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import AdminRoute from '@/components/AdminRoute';


function SellDay() {
  const router = useRouter();

  const { id } = useParams();
  const { user, logout } = useSession();
  const [ticket, setTicket] = useState(null);
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

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/ticket/${id}`);
      const data = response.data;
      setTicket(data.payload);
      setLoading(false);
      console.log(data.payload)
    } catch (error) {
      console.log(error);
    }
  }

  const closeSession = async (e) => {
    try {
      e.preventDefault();
      const response = await logout();
      toast.success(response.message, {
        closeButton: false,
        duration: 1400,
        hideProgressBar: true
      })
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error) {
      toast.error(error, {
        duration: 3000,
        hideProgressBar: true,
        closeButton: true,
        pauseOnHover: true
      })
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

  useEffect(() => {
    fetchData();
  }, [id]);

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
                  <Link href={"/sells"} className='text-center p-1 bg-blue-200 rounded font-bold'>Volver</Link>
                </div>
              </div>
            }
          </div>

          <div className='flex flex-col justify-center items-center col-span-2'>
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto border border-gray-300">
              {/* Header */}
              <h4 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Venta del día: {formatDate(ticket.created_at)} hs
              </h4>

              {/* Datos del vendedor */}
              <div className="mt-4">
                <span className="text-gray-600 text-sm">Vendido por:</span>
                <span className="font-semibold text-gray-800 ml-2">{ticket.seller.name}</span>
              </div>

              {/* Lista de productos */}
              <h4 className="mt-4 text-lg font-semibold text-gray-700 border-b pb-1">Productos:</h4>
              <div className="flex flex-col gap-4 mt-2">
                {ticket.products.map((value, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                    <div>
                      <h5 className="font-semibold text-gray-900">{value.product.title}</h5>
                      <span className="text-sm text-gray-600">Cantidad: {value.quantity}</span>
                    </div>
                    <span className="text-gray-900 font-semibold">${value.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Total y método de pago */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total:</span>
                  <span>${ticket.amount}</span>
                </div>
                <div className="mt-2 text-gray-700">
                  <span className="font-medium">Método de pago:</span> {formatPaymentMethod(ticket.payment_method)}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default AdminRoute(SellDay);