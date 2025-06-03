import Link from "next/link";

import { Pagination } from "@/components";

const Shifts = () => {
  return (
    <div className="sales">
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
          <tr>
            <td align="center">10-05-2025 - 14:30</td>
            <td align="center">1 u.</td>
            <td align="center">$500</td>
            <td align="center" className="shifts__current-shift">
              Jornada en curso
            </td>
          </tr>

          <tr>
            <td align="center">10-05-2025 - 14:30</td>
            <td align="center">1 u.</td>
            <td align="center">$500</td>
            <td align="center">
              <Link href="/">Ver detalles</Link>
            </td>
          </tr>

          <tr>
            <td align="center">10-05-2025 - 14:30</td>
            <td align="center">5 u.</td>
            <td align="center">$4.000</td>
            <td align="center">
              <Link href="/">Ver detalles</Link>
            </td>
          </tr>

          <tr>
            <td align="center">10-05-2025 - 14:30</td>
            <td align="center">1 u.</td>
            <td align="center">$500</td>
            <td align="center">
              <Link href="/">Ver detalles</Link>
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination />
    </div>
  );
};

export default Shifts;
