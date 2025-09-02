'use client';

import { Dropdown, DropdownItem, Button, Input } from "@/components";

import { useCart } from "@/context/CartContext";
import { useResume } from "@/context/ResumeContext";

import api from "@/utils/axios.config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@/components";
const Payment = () => {

  //Elementos de contexto
  const { cart, setCart } = useCart();
  const { resumeId } = useResume();

  //Variables locales
  const [amount, setAmount] = useState(0);
  const [payment, setPayment] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [change, setChange] = useState(null);
  const [loading, setLoading] = useState(false);


  const handlePaymentMethod = (e, pm) => {
    e.preventDefault();
    setPaymentMethod(pm);
  }

  //Función completar venta
  const completeSell = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (payment === 0 && paymentMethod === 'eft') {
        setLoading(false);
        throw new Error('Monto insuficiente');
      }
      if (payment > 0) {
        const changeResult = Number(payment) - Number(amount);

        if (changeResult < 0) {
          setLoading(false);
          throw new Error('Monto para abonar insuficente')
        }
        if (changeResult > 0) {
          setLoading(false);
          setChange(changeResult)
          setTimeout(() => {
            cleanChange(e);
          }, 5000);
        }
      }
      const response = await api.post('/api/ticket/create', { amount: amount, payment_method: paymentMethod, rid: resumeId });
      console.log(response);
      const data = response.data;
      if (data.status === 'success') {
        setLoading(false);
        setPaymentMethod(null)
        setPayment(0)
        setAmount(0);
        // console.log(data.payload)
        setCart(data.payload)

      }
      toast.success(data.message, {
        autoClose: 2000,
        closeButton: true,
        hideProgressBar: true,
        className: 'toast-success'
      })
    } catch (error) {
      if (error.status === 403) {
        // alert(error.response.data.error)
        setLoading(false);
        toast.error(error.response.data.error, {
          autoClose: 2000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
          hideProgressBar: true,
          closeButton: false,
          className: 'toast-error'
        });
        // router.push("/login")
        return error.response.data
      } else if (error.response) {
        setLoading(false);
        // alert(error.response.data.error)
        toast.error(error.response.data.error, {
          autoClose: 2000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
          hideProgressBar: true,
          closeButton: false,
          className: 'toast-error'
        })
      } else {
        setLoading(false);
        console.log(error);
        // alert(error.message)
        toast.error(error.message, {
          autoClose: 2000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
          hideProgressBar: true,
          closeButton: false,
          className: 'toast-error'
        })
        return error;
      }

    }
  }

  const handlePayment = (e) => {
    // e.preventDefault();
    console.log(e.target.value)
    let value = e.target.value;

    // Eliminar ceros a la izquierda
    if (value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }
    // Actualizar el estado del input general
    setPayment(value);
  }

  const getPaymentLabel = (paymentCode) => {
    const paymentLabels = {
      eft: "Efectivo",
      mp: "Mercado Pago",
      tc: "Tarjeta de crédito",
      td: "Tarjeta de débito",
    };

    return paymentLabels[paymentCode] || "Medio de pago";
  };

  const cleanChange = (e) => {
    e.preventDefault();
    setChange(null);
  }


  useEffect(() => {
    let newAmount = 0;
    cart.products?.forEach(prod => {
      newAmount += prod.totalPrice
    });
    setAmount(newAmount);
  }, [cart.products]);


  return (
    <div className="payment">
      <div>
        <p>Total a pagar:</p>

        <span>${amount.toFixed(2)}</span>
      </div>

      {paymentMethod === 'eft' &&
        <div>
          <p>Abona:</p>

          <Input icon="$" type="number" placeholder="Importe" onChange={handlePayment} value={payment} />
        </div>
      }

      <div>
        <p>Medio de pago:</p>

        <Dropdown placeholder={getPaymentLabel(paymentMethod)}>
          <DropdownItem onClick={(e) => handlePaymentMethod(e, 'eft')}>Efectivo</DropdownItem>
          <DropdownItem onClick={(e) => handlePaymentMethod(e, 'mp')}>Mercado Pago</DropdownItem>
          <DropdownItem onClick={(e) => handlePaymentMethod(e, 'tc')}>Tarjeta de crédito</DropdownItem>
          <DropdownItem onClick={(e) => handlePaymentMethod(e, 'td')}>Tarjeta de débito</DropdownItem>
        </Dropdown>
      </div>

      {change > 0 &&
        <div>
          <p>Vuelto:</p>

          <span>${change.toFixed(2)}</span>
        </div>
      }
      {loading ?
        <div className="loading-container">
          <LoadingSpinner />
        </div>
        :
        <Button color={change > 0 ? "red" : "green"} onClick={change > 0 ? cleanChange : completeSell}>{change > 0 ? 'Limpiar vuelto' : 'Realizar venta'}</Button>
      }
    </div>
  );
};

export default Payment;
