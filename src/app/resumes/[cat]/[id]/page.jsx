'use client';

import { Button, Card } from "@/components";
import Link from "next/link";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";

import api from "@/utils/axios.config";

const Resume = () => {

  const { id } = useParams();
  const { user } = useSession();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSells, setShowSells] = useState(false);

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

  const toggleState = (e) => {
    e.preventDefault()
    setShowSells(prev => !prev);
  };

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

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/resume/summary/${id}`);
      const data = response.data;

      if (data.status === 'success') {
        setResume(data.payload);
        setLoading(false);
      } else {
        setLoading(false);
        setResume(null);
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="resume">
      {loading ?
        <p>Cargando...</p>
        :
        <>
          <h2>Resumen</h2>

          <Card className="resume__header">
            <div className="resume__header__detail">
              <div>
                <div>
                  <p>Inicio de jornada</p>
                  <span>{formatDate(resume.init_date.init)} hs</span>
                </div>

                <div>
                  <p>Abrió</p>
                  <span>{resume.init_date.seller.name}</span>
                </div>

                <div>
                  <p>Caja inicial</p>
                  <span>${resume.initAmount}</span>
                </div>
              </div>


              <div>
                {resume.finish_date ?
                  <>
                    <div>
                      <p>Fin de jornada</p>
                      <span>{formatDate(resume.finish_date.end)} hs</span>
                    </div>

                    <div>
                      <p>Cerró</p>
                      <span>{resume.finish_date.seller.name}</span>
                    </div>

                    <div>
                      <p>Caja final estimada</p>
                      <span>${resume.checkout | resume.initAmount}</span>
                    </div>
                  </>
                  :
                  <div>
                    <p>Jornada en curso</p>
                  </div>
                }
              </div>
              <div>
                <div>
                  <p>Duración de la jornada</p>
                  <span>{resume.duration}</span>
                </div>
                <div>
                  <p>Hora con mas ventas</p>
                  <span>{resume.peakHour}</span>
                </div>
              </div>

              <div>
                <div>
                  <p>Ganancia bruta</p>
                  <span>${resume.ganancy.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <div>
                  <p>Porcentaje de ganancia jornal</p>
                  <span>{resume.ganancyPercentage.toFixed(2)}%</span>
                </div>
              </div>
              <div>
                <div>
                  <p>Producto mas vendido</p>
                  <span>{resume.mostSelled.title} {`(${resume.mostSelled.totalVendida})`}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>Productos mas vendidos</span>
                </div>
                {resume.topSelled.map((value, index) => {
                  return (
                    <div key={index}>
                      <p>{value.title}</p>
                      <span>Vendidos: {value.totalVendida}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="resume__header__total">
              <p>Total vendido</p>
              <span>${resume.amount.toFixed(2)}</span>
            </div>
          </Card>

          <h2>Métodos de pago</h2>

          <div className="resume__payment-methods">
            {resume.amount_per_method.map((value, index) => {
              return (
                <Card className="resume__payment-methods__method" key={`${index}pm`}>
                  <p>{formatPaymentMethod(value.method)}</p>
                  <span>${value.amount.toFixed(2)}</span>
                </Card>
              )
            })}
          </div>

          <h2>Productos</h2>

          <div className="resume__products">
            {resume.products.map((value, index) => {
              return (
                <Card className="resume__product" key={`${index}rp`}>
                  <div className="resume__product__detail" key={`${index}r`}>
                    <p>{value.product.title}</p>
                    <p>
                      Cantidad: <span>{value.quantity}</span>
                    </p>
                    <p>
                      Total: <span>${value.total.toFixed(2)}</span>
                    </p>
                    {(user?.role === 'admin' || user?.role === 'god') &&
                      <>
                        <p>
                          Ganancia: <span>${value.ganancia.toFixed(2)}</span>
                        </p>
                        <p>
                          Porcentaje de ganancia: <span>{value.porcentajeGanancia.toFixed(2)}%</span>
                        </p>
                      </>
                    }
                  </div>
                  <div className="resume__product__total">
                    <span>${value.product.sellingPrice}</span>
                  </div>
                </Card>
              )
            })}

            <Button onClick={toggleState}>{showSells ? 'Ocultar ventas' : 'Ver ventas'}{`(${resume.sales})`}</Button>
          </div>
          {showSells &&
            <>
              <h2>Ventas</h2>


              <div className="resume__sells">
                {resume.tickets.map((value, index) => {
                  return (
                    <Card className="resume__sell" key={`${index}sp`}>
                      <div className="resume__sell__detail" key={`${index}t`}>
                        <p>
                          Venta realizada por: <span>{value.ticket?.seller.name}</span>
                        </p>
                        <p>
                          Realizada el: <span>{formatDate(value.ticket?.created_at)} hs</span>
                        </p>
                        <p>
                          Productos vendidos: <span>{value.ticket?.products.length}</span>
                        </p>
                        <p>
                          Método de pago: <span>{formatPaymentMethod(value.ticket?.payment_method)}</span>
                        </p>

                        <Link href={`/sells/${value.ticket?._id}`}>Ver venta</Link>
                      </div>

                      <div className="resume__sell__total">
                        <span>${value.ticket?.amount.toFixed(2)}</span>
                      </div>
                    </Card>

                  )
                })}
              </div>
            </>
          }
        </>
      }
    </div>
  );
};

export default Resume;
