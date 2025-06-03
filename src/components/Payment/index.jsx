import { Dropdown, DropdownItem, Button, Input } from "@/components";

const Payment = () => {
  return (
    <div className="payment">
      <div>
        <p>Total a pagar:</p>

        <span>$100.000,99</span>
      </div>

      <div>
        <p>Abona:</p>

        <Input icon="$" type="number" placeholder="Importe" />
      </div>

      <div>
        <p>Medio de pago:</p>

        <Dropdown placeholder="Medio de pago">
          <DropdownItem>Efectivo</DropdownItem>
          <DropdownItem>Mercado Pago</DropdownItem>
          <DropdownItem>Tarjeta de crédito</DropdownItem>
          <DropdownItem>Tarjeta de débito</DropdownItem>
        </Dropdown>
      </div>

      <div>
        <p>Vuelto:</p>

        <span>$100.000,99</span>
      </div>

      <Button color="green">Realizar venta</Button>
    </div>
  );
};

export default Payment;
