import { Button, Tooltip, Pagination } from "@/components";

const Stock = () => {
  return (
    <div className="stock">
      <table className="stock__table">
        <thead>
          <tr>
            <th align="left">Código</th>
            <th align="left">Producto</th>
            <th>Precio de costo</th>
            <th>Precio de venta</th>
            <th>Stock en tienda</th>
            <th>Stock total</th>
            <th>Porcentaje de ganancia</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>35917404189</td>
            <td align="left">Alfajor Capitán del Espacio - Negro</td>
            <td align="center">$900</td>
            <td align="center">$1.000</td>
            <td align="center">
              25
              <Tooltip component="Sin stock disponible.">
                <span className="stock__table__notification stock__table__notification--danger">
                  <i className="fa-solid fa-exclamation fa-xs"></i>
                </span>
              </Tooltip>
            </td>
            <td align="center">100</td>
            <td align="center">5%</td>
            <td align="center">
              <Button color="green">
                <i className="fa-solid fa-plus"></i>
              </Button>
              <Button>
                <i className="fa-solid fa-pen"></i>
              </Button>
              <Button color="red">
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </td>
          </tr>

          <tr>
            <td>35917404189</td>
            <td align="left">Alfajor Capitán del Espacio - Blanco</td>
            <td align="center">$900</td>
            <td align="center">$1.000</td>
            <td align="center">
              25
              <Tooltip component="Quedan pocas unidades en stock.">
                <span className="stock__table__notification stock__table__notification--warning">
                  <i className="fa-solid fa-exclamation fa-xs"></i>
                </span>
              </Tooltip>
            </td>
            <td align="center">100</td>
            <td align="center">10%</td>
            <td align="center">
              <Button color="green">
                <i className="fa-solid fa-plus"></i>
              </Button>
              <Button>
                <i className="fa-solid fa-pen"></i>
              </Button>
              <Button color="red">
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </td>
          </tr>

          <tr>
            <td>35917404189</td>
            <td align="left">Chupetin Evolution - Azul</td>
            <td align="center">$450</td>
            <td align="center">$500</td>
            <td align="center">100</td>
            <td align="center">500</td>
            <td align="center">15%</td>
            <td align="center">
              <Button color="green">
                <i className="fa-solid fa-plus"></i>
              </Button>
              <Button>
                <i className="fa-solid fa-pen"></i>
              </Button>
              <Button color="red">
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination />
    </div>
  );
};

export default Stock;
