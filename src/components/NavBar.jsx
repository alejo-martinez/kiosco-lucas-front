'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';

import { useResume } from '@/context/ResumeContext';
import { useProduct } from '@/context/ProductContext';

import Search from './Search';

function NavBar() {
  const router = useRouter();
  const { resumeId, initDay, endDay } = useResume();
  
  const {lowStockProducts} = useProduct();
  const { user } = useSession();

  const [actualDate, setActualDate] = useState(null);

  const init = (e)=>{
    e.preventDefault();
    initDay();
  }

  const end = async(e)=>{
    e.preventDefault();
    const response = await endDay();
    router.push(`/resumes/diary/${response}`);
  }


  const formatDateForUser = () => {
    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    setActualDate(date.toLocaleDateString("es-ES", options))
  };

  const navigateToLowProducts = (e)=>{
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('query', 1);
    params.set('filter', 'stock');
    params.set('valueFilter', 2);

    router.push(`/panel?${params.toString()}`)
  }

  useEffect(() => {
    formatDateForUser();
  }, []);

  return (
    <div className='flex'>
      {(lowStockProducts.length > 0 && user?.role === 'admin') &&
      <div className='flex h-fit flex-wrap items-center self-center'>
        <button className='cursor-pointer px-6 py-3 font-bold text-white rounded-lg bg-red-600 shadow-lg animate-[glow_1.5s_infinite_alternate]' onClick={navigateToLowProducts}>Productos de bajo Stock</button>
      </div>
      }
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
