import { Button, Card } from "@/components";
import Link from "next/link";

const Resume = () => {
  return (
    <div className="resume">
      <h2>Resumen</h2>

      <Card className="resume__header">
        <div className="resume__header__detail">
          <div>
            <div>
              <p>Inicio de jornada</p>
              <span>13-05-2025 - 13:21</span>
            </div>

            <div>
              <p>Abrió</p>
              <span>Lucas</span>
            </div>

            <div>
              <p>Caja inicial</p>
              <span>$10.000,99</span>
            </div>
          </div>

          <div>
            <div>
              <p>Fin de jornada</p>
              <span>13-05-2025 - 13:21</span>
            </div>

            <div>
              <p>Cerró</p>
              <span>Lucas</span>
            </div>

            <div>
              <p>Caja final</p>
              <span>$10.000,99</span>
            </div>
          </div>
        </div>

        <div className="resume__header__total">
          <p>Total vendido</p>
          <span>$9.999.999,99</span>
        </div>
      </Card>

      <h2>Métodos de pago</h2>

      <div className="resume__payment-methods">
        <Card className="resume__payment-methods__method">
          <p>Tarjeta de débito</p>
          <span>$10.000,99</span>
        </Card>

        <Card className="resume__payment-methods__method">
          <p>Mercado Pago</p>

          <span>$10.000,99</span>
        </Card>

        <Card className="resume__payment-methods__method">
          <p>Tarjeta de débito</p>

          <span>$10.000,99</span>
        </Card>

        <Card className="resume__payment-methods__method">
          <p>Mercado Pago</p>

          <span>$10.000,99</span>
        </Card>
      </div>

      <h2>Productos</h2>

      <div className="resume__products">
        <Card className="resume__product">
          <div className="resume__product__detail">
            <p>Alfajor Capitán del Espacio - Negro</p>
            <p>
              Cantidad: <span>1</span>
            </p>
            <p>
              Ganancia: <span>$500</span>
            </p>
            <p>
              Porcentaje de ganancia: <span>10%</span>
            </p>
          </div>
          <div className="resume__product__total">
            <span>$500</span>
          </div>
        </Card>

        <Card className="resume__product">
          <div className="resume__product__detail">
            <p>Alfajor Capitán del Espacio - Negro</p>
            <p>
              Cantidad: <span>1</span>
            </p>
            <p>
              Ganancia: <span>$500</span>
            </p>
            <p>
              Porcentaje de ganancia: <span>10%</span>
            </p>
          </div>
          <div className="resume__product__total">
            <span>$500</span>
          </div>
        </Card>

        <Card className="resume__product">
          <div className="resume__product__detail">
            <p>Alfajor Capitán del Espacio - Negro</p>
            <p>
              Cantidad: <span>1</span>
            </p>
            <p>
              Ganancia: <span>$500</span>
            </p>
            <p>
              Porcentaje de ganancia: <span>10%</span>
            </p>
          </div>
          <div className="resume__product__total">
            <span>$500</span>
          </div>
        </Card>

        <Button>Ver ventas</Button>
      </div>

      <h2>Ventas</h2>

      <div className="resume__sells">
        <Card className="resume__sell">
          <div className="resume__sell__detail">
            <p>
              Venta realizada por: <span>Lucas</span>
            </p>
            <p>
              Realizada el: <span>13-05-2025 - 13:21</span>
            </p>
            <p>
              Productos vendidos: <span>2</span>
            </p>
            <p>
              Método de pago: <span>Mercado Pago</span>
            </p>

            <Link href="/">Ver venta</Link>
          </div>

          <div className="resume__sell__total">
            <span>$10.000</span>
          </div>
        </Card>

        <Card className="resume__sell">
          <div className="resume__sell__detail">
            <p>
              Venta realizada por: <span>Lucas</span>
            </p>
            <p>
              Realizada el: <span>13-05-2025 - 13:21</span>
            </p>
            <p>
              Productos vendidos: <span>2</span>
            </p>
            <p>
              Método de pago: <span>Mercado Pago</span>
            </p>

            <Link href="/">Ver venta</Link>
          </div>

          <div className="resume__sell__total">
            <span>$10.000</span>
          </div>
        </Card>

        <Card className="resume__sell">
          <div className="resume__sell__detail">
            <p>
              Venta realizada por: <span>Lucas</span>
            </p>
            <p>
              Realizada el: <span>13-05-2025 - 13:21</span>
            </p>
            <p>
              Productos vendidos: <span>2</span>
            </p>
            <p>
              Método de pago: <span>Mercado Pago</span>
            </p>

            <Link href="/">Ver venta</Link>
          </div>

          <div className="resume__sell__total">
            <span>$10.000</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Resume;
