import { Card, Button } from "@/components";

const Cart = () => {
  return (
    <div className="cart">
      <Card className="empty">
        <div>
          <i class="fa-solid fa-circle-exclamation fa-xl"></i>
        </div>
        <p>No hay inguna venta en curso.</p>
      </Card>
      {/* <table className="cart__table">
        <thead>
          <tr>
            <th align="left">Código</th>
            <th align="left">Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>35917404189</td>
            <td>Alfajor Capitán del Espacio - Negro</td>
            <td align="center">
              <Button color="red">
                <i className="fa-solid fa-circle-minus fa-xl"></i>
              </Button>
              1
              <Button color="green">
                <i className="fa-solid fa-circle-plus fa-xl"></i>
              </Button>
            </td>
            <td align="center">$1.000</td>
            <td align="center">$1.000</td>
            <td align="center">
              <Button color="red">
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </td>
          </tr>
          <tr>
            <td>35917404189</td>
            <td>Alfajor Capitán del Espacio - Blanco</td>
            <td align="center">
              <Button color="red">
                <i className="fa-solid fa-circle-minus fa-xl"></i>
              </Button>
              1
              <Button color="green">
                <i className="fa-solid fa-circle-plus fa-xl"></i>
              </Button>
            </td>
            <td align="center">$1.000</td>
            <td align="center">$1.000</td>
            <td align="center">
              <Button color="red">
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </td>
          </tr>
          <tr>
            <td>35917404189</td>
            <td>Chupetin Evolution - Azul</td>
            <td align="center">
              <Button color="red">
                <i className="fa-solid fa-circle-minus fa-xl"></i>
              </Button>
              2
              <Button color="green">
                <i className="fa-solid fa-circle-plus fa-xl"></i>
              </Button>
            </td>
            <td align="center">$500</td>
            <td align="center">$100</td>
            <td align="center">
              <Button color="red">
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      <Button color="red">Eliminar todo</Button> */}
    </div>
  );
};

export default Cart;
