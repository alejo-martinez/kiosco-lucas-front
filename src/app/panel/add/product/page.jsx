import { Card, Input, Button } from "@/components";

const AddProduct = () => {
  return (
    <div className="add-product">
      <Card className="add-product__form">
        <h2>Crear producto</h2>

        <Input type="text" placeholder="Nombre del producto" />
        <Input type="number" placeholder="Stock en tienda" />
        <Input type="number" placeholder="Stock total" />
        <Input type="number" icon="$" placeholder="Precio de costo" />
        <Input type="number" icon="$" placeholder="Precio de venta" />
        <Input type="number" icon="%" placeholder="Porcentaje de ganancia" />
        <Input type="number" icon="#" placeholder="Código" />

        <Button color="green">Crear</Button>
      </Card>
    </div>
  );
};

export default AddProduct;
