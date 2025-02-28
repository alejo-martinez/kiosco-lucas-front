'use client';

import React, {useState} from 'react';
import { useSession } from '@/context/SessionContext';


function NavBar() {

    const {user} = useSession();

  return (
    <div className='flex justify-center'>
      {user &&  
        <div className='flex justify-end p-3'>
            <span>Usuario activo: {user.name}</span>
        </div>  
     }
    </div>
  )
}

export default NavBar
