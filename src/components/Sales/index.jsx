'use client';

import Link from "next/link";

import { Pagination, Card } from "@/components";
import { useSearchParams } from "next/navigation";

import { useState, useEffect } from "react";
import api from "@/utils/axios.config";

const Sales = () => {

  const params = useSearchParams();
  const userParam = params.get('user');
  const queryParam = params.get('query')

  //Estados locales
  const [sales, setSales] = useState([])
  const [setings, setSetings] = useState([])
  
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
      const response = await api.get(`/api/ticket/${userParam ? `?usuario=${userParam}&page=${queryParam | 1}` : `?page=${queryParam | 1}`}`);
      const data = response.data;
      if (data.status === 'success') {
        setSales(data.payload.docs);
        setSetings(data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    console.log('ejecuto')
  }, [userParam, queryParam]);


  return (
    <div className="sales">
      {sales.length === 0 ?
        <Card className="empty">
          <div>
            {/* <i className="fa-solid fa-circle-exclamation fa-xl"></i> */}
          </div>
          <p>No hay ventas.</p>
        </Card> :
        <>
          <table className="sales__table">
            <thead>
              <tr>
                <th>Día de la venta</th>
                <th>Cantidad vendida</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((value, index) => {
                let quantity = 0;
                for (let index = 0; index < value.products.length; index++) {
                  const element = value.products[index];
                  quantity += element.quantity;

                }
                return (
                  <tr key={index}>
                    <td align="center">{formatDate(value.created_at)}</td>
                    <td align="center">{quantity > 1 ? `${quantity} productos` : `${quantity} producto`}</td>
                    <td align="center">${value.amount?.toFixed(2)}</td>
                    <td align="center">
                      <Link href={`/sells/${value._id}`}>Ver detalles</Link>
                    </td>
                  </tr>

                )
              })}
            </tbody>
          </table>
          {/* <Pagination pagination={setings} url={'/sells'} filters={{ user: userParam }} /> */}
        </>
      }

    </div>
  );
};

export default Sales;
