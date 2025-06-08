'use client';

import React, { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function Login() {

  const router = useRouter();
  const [userLogin, setUserLogin] = useState({ user_name: '', password: '' });
  const { login } = useSession();

  const handleChange = (e) => {
    e.preventDefault();
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(userLogin);

    if (response.status === 'success') {
      toast.success('Sesion iniciada!', {
        autoClose: 2000,
        closeButton: true,
        hideProgressBar: true,
        className: 'toast-success'
      })
      router.push('/');
    } else {
      toast.error(response.error, {
          autoClose: 3000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
          hideProgressBar: true,
          closeButton: false,
          className: 'toast-error'
      });
    }
  }

  return (
    <div className="login-container">
      <form className="login-form">
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input type="text" name="user_name" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Ingresar
        </button>
      </form>
    </div>



  )
}

export default Login;
