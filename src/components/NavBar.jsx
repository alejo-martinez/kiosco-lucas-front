'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import Search from './Search';

function NavBar() {

  const router = useRouter();

  const { user } = useSession();

  const [actualDate, setActualDate] = useState(null);


  const formatDateForUser = () => {
    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    setActualDate(date.toLocaleDateString("es-ES", options))
  };
  useEffect(()=>{
    formatDateForUser();
  },[]);

  return (
    <div className='flex'>
      <div className='flex flex-grow justify-center'>
        <Search />
      </div>
      {user &&
        <div className='flex flex-col justify-self-end p-3'>
          <span>Usuario activo: {user.name}</span>
          <span>{actualDate}</span>
        </div>
      }
    </div>
  )
}

export default NavBar
