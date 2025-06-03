import Link from "next/link";

import { Pagination } from "@/components";

const Sales = () => {
  return (
    <div className="sales">
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

export default Sales;
