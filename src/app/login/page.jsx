'use client';

import React, { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function Login() {

  const router = useRouter();
  const [userLogin, setUserLogin] = useState({user_name:'', password: ''});
  const {login} = useSession();

  const handleChange = (e)=>{
    e.preventDefault();
    setUserLogin({...userLogin, [e.target.name]: e.target.value});
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const response = await login(userLogin);
    console.log(response)
    if(response.status === 'success'){
      toast.success('Sesion iniciada!',{
        autoClose:1400,
        pauseOnHover:false,
        closeButton:false,
        hideProgressBar:true
      })
      setTimeout(()=>{
        router.push('/');
      }, 1500);
    } else{
      toast.error(response.error,{
        autoClose:3000,
        pauseOnHover:true,
        closeButton:true,
      });
    }
  }

  return (
    <div className="flex flex-wrap justify-center h-screen items-center">
      <form className="w-2/5 flex flex-col flex-wrap" >
        <div className="flex justify-between">
          <label>Nombre de usuario</label>
          <input type="text" name="user_name" className='border p-1' onChange={handleChange}/>
        </div>
        <div className="flex justify-between mt-2">
          <label>Contraseña</label>
          <input type="password" name="password" className='border p-1' onChange={handleChange}/>
        </div>
        <div className="">
          <button onClick={handleSubmit} className="flex justify-self-center mt-4 border p-1 rounded bg-black text-white font-bold hover:cursor-pointer">
            Ingresar
          </button>
        </div>
        <div  className=""/>
      </form>
    </div>

  )
}

export default Login;
