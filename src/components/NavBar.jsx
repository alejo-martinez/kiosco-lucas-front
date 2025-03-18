'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/context/SessionContext';

import { useResume } from '@/context/ResumeContext';

import Search from './Search';

function NavBar() {

  const { resumeId, initDay, endDay } = useResume();

  const { user } = useSession();

  const [actualDate, setActualDate] = useState(null);

  const init = (e)=>{
    e.preventDefault();
    initDay();
  }

  const end = async(e)=>{
    e.preventDefault();
    await endDay();
  }


  const formatDateForUser = () => {
    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    setActualDate(date.toLocaleDateString("es-ES", options))
  };
  useEffect(() => {
    formatDateForUser();
  }, []);

  return (
    <div className='flex'>
      <div className='flex flex-grow justify-center'>
        <Search />
      </div>
      <div>
        {user &&
          <div className='flex flex-col justify-self-end p-3'>
            <span>Usuario activo: {user.name}</span>
            <span>{actualDate}</span>
          </div>
        }
        <div className='flex justify-center'>
          {!resumeId ? 
          <button onClick={init} className='bg-blue-700 p-1 rounded text-white cursor-pointer'>Iniciar día</button>
          :
          <button onClick={end} className='bg-red-700 p-1 rounded text-white cursor-pointer'>Finalizar día</button>
         }
        </div>
      </div>
    </div>
  )
}

export default NavBar
