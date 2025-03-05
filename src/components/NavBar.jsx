'use client';

import React, {useState, useEffect} from 'react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Search from './Search';

function NavBar() {

  const {user, logout} = useSession();
  const [date, setDate] = useState(2);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // const closeSession = async(e)=>{
  //   try {
  //     e.preventDefault();
  //     const response = await logout();
  //     toast.success(response.message,{
  //       closeButton:false,
  //       duration: 1400,
  //       hideProgressBar:true
  //     })
  //     setTimeout(()=>{
  //       router.push('/login')
  //     }, 1500)
  //   } catch (error) {
  //     toast.error(error,{
  //       duration:3000,
  //       hideProgressBar:true,
  //       closeButton:true,
  //       pauseOnHover:true
  //     })
  //   }
  // }

  useEffect(()=>{
    const actualDate = new Date();
    const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = actualDate.toLocaleDateString('es-ES', options);
    setDate(formattedDate);
    if(date) setLoading(false);
  },[]);

  return (
    <div className='grid grid-cols-5 border-b items-center'>
      <div className='col-span-4'>
        <Search />
      </div>
      {user &&  
        <div className='col-span-1 flex flex-col justify-self-center items-center p-2 bg-gray-300 w-fit rounded'>
            <span>Usuario activo: {user.name}</span>
            <span className='first-letter:uppercase'>{date}</span>
        </div>  
     }
    </div>
  )
}

export default NavBar
