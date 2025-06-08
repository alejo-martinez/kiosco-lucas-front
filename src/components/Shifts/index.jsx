'use client';

import Link from "next/link";

import { Pagination } from "@/components";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import { useSearchParams } from 'next/navigation';

import api from "@/utils/axios.config";

const Shifts = () => {

  const { cat } = useParams();
  const searchParams = useSearchParams();
  const paramValue = searchParams.get("query");

  const [resumes, setResumes] = useState([]);
  const [setings, setSetings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/resume/summaries/${cat}?page=${paramValue ? paramValue : 1}`);
      const data = response.data;
      if (data.status === 'success') {
        setResumes(data.payload.docs)
        setSetings(data.payload)
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const formatDate = (date) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires' // Especifica la zona horaria de Argentina
    };
    return new Date(date).toLocaleDateString('es-AR', options);
  }

  useEffect(() => {
    fetchData()
  }, [paramValue]);

  return (
    <div className="sales">
      {loading ? <p>Cargando...</p>
        :
        <>
          <table className="sales__table">
            <thead>
              <tr>
                <th>Día de la jornada</th>
                <th>Ventas</th>
                <th>Total vendido</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {resumes.map((value, index) => {
                return (

                  <tr key={index}>
                    <td align="center">{formatDate(value.init_date.init)}</td>
                    <td align="center">{value.sales > 1 ? `${value.sales} ventas` : value.sales === 0 ? `Sin ventas` : `${value.sales} venta`}</td>
                    <td align="center">${value.amount.toFixed(2)}</td>
                    <td align="center" className={value.finish_date? "" : "shifts__current-shift"}>
                      {value.finish_date ?
                        <Link href={`/resumes/diary/${value._id}`}>Ver detalles</Link>
                        :
                        <Link href={`/resumes/diary/${value._id}`}>Ver jornada en curso</Link>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <Pagination pagination={setings} url={'/resumes/diary'} />
        </>
      }
    </div>
  );
};

export default Shifts;
