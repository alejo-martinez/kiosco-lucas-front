'use client';

import React,{useState, useEffect} from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/utils/axios.config';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SellDay() {

    const {id} = useParams();
    const {user, logout} = useSession();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchData = async()=>{
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

      const closeSession = async(e)=>{
        try {
          e.preventDefault();
          const response = await logout();
          toast.success(response.message,{
            closeButton:false,
            duration: 1400,
            hideProgressBar:true
          })
          setTimeout(()=>{
            router.push('/login')
          }, 1500)
        } catch (error) {
          toast.error(error,{
            duration:3000,
            hideProgressBar:true,
            closeButton:true,
            pauseOnHover:true
          })
        }
      }

    const formatDate = (date) =>{
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

    const formatPaymentMethod = (data) =>{
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

    useEffect(()=>{
        fetchData();
    },[id]);

  return (
    <div>
        {loading? <p>Cargando...</p>
        :
        <div>

        <div className='flex justify-end'>
        {user &&  
          <div className='flex flex-col justify-end p-3'>
              <span>Usuario activo: {user.name}</span>
              <button onClick={closeSession} className='rounded w-fit p-1 bg-red-700 text-white hover:cursor-pointer'>Cerrar sesión</button>
              {user.role === 'admin' &&
              <div className='flex flex-col'>
                <Link href={'/panel/add/product'} className='p-2 bg-blue-800 text-white rounded mt-3'>Agregar productos</Link>
                <Link href={'/panel'} className='p-2 bg-blue-800 text-white rounded mt-3'>Panel de productos</Link>
              </div>
              }
          </div>  
       }
      </div>
        <div className='flex flex-col justify-center items-center'>
            <h4 className='text-2xl'>Venta del día: {formatDate(ticket.created_at)} hs</h4>
            <div>
                {/* <p>{JSON.stringify(ticket)}</p> */}
                <span>Vendido por: {ticket.seller.name}</span>
                <h4>Productos:</h4>
                <div className='flex flex-col gap-4'>
                    {ticket.products.map((value, index)=>{
                        return(
                            <div key={index} className='flex flex-col'>
                                <h5>{value.product.title}</h5>
                                <span>Cantidad vendida: {value.quantity}</span>
                                <span>Monto: ${value.totalPrice}</span>
                            </div>
                        )
                    })}
                    <span>Total: ${ticket.amount}</span>
                    <span>Método de pago: {formatPaymentMethod(ticket.payment_method)}</span>
                </div>
            </div>
        </div>
        </div>
        }
    </div>
  )
}

export default SellDay;