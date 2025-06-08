'use client';

import { Card, Input, Button } from "@/components";
import api from "@/utils/axios.config";
import { useState } from "react";
import { toast } from "react-toastify";

const AddProduct = () => {


  const [producto, setProducto] = useState({ title: '', costPrice: 0, sellingPrice: 0, stock: 0, totalStock: 0, percentage: 0 });
  const [code, setCode] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value.startsWith("0") ? value.replace(/^0+/, "") : value;

    let updatedProduct = { ...producto, [name]: cleanedValue };

    const cost = parseFloat(name === "costPrice" ? cleanedValue : producto.costPrice);
    const percentage = parseFloat(name === "percentage" ? cleanedValue : producto.percentage);
    const selling = parseFloat(name === "sellingPrice" ? cleanedValue : producto.sellingPrice);

    // Cuando se cambia el porcentaje
    if (name === "percentage" && !isNaN(cost)) {
      const newSelling = cost * (1 + percentage / 100);
      updatedProduct.sellingPrice = newSelling.toFixed(2);
    }

    // Cuando se cambia el precio de venta
    else if (name === "sellingPrice" && !isNaN(cost)) {
      const newPercentage = ((selling - cost) / cost) * 100;
      updatedProduct.percentage = newPercentage.toFixed(2);
    }

    // Cuando se cambia el precio de costo
    else if (name === "costPrice") {
      if (!isNaN(percentage)) {
        const newSelling = cost * (1 + percentage / 100);
        updatedProduct.sellingPrice = newSelling.toFixed(2);
      } else if (!isNaN(selling)) {
        const newPercentage = ((selling - cost) / cost) * 100;
        updatedProduct.percentage = newPercentage.toFixed(2);
      }
    }

    setProducto(updatedProduct);
  };



  const handleChangeCode = (e) => {
    setCode(e.target.value);
  }

  const handleEnterProduct = async (e) => {
    try {
      if (e.key === 'Enter') {
        // setCode(e.target.value)
        const newProd = { ...producto, code: e.target.value };
        const response = await api.post('/api/products/create', newProd);
        const data = response.data;
        if (data.status === 'success') {
          toast.success(data.message, {
            autoClose: 2000,
            closeButton: true,
            hideProgressBar: true,
            className: 'toast-success'
          })
        }
        setProducto({ title: '', costPrice: 0, sellingPrice: 0, stock: 0, totalStock: 0, percentage: 0 });
        setCode('');
      }

    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        className: 'toast-error'
      });
    }
  }

  return (
    <div className="add-product">
      <Card className="add-product__form">
        <h2>Crear producto</h2>

        <div className="form-group">
          <label htmlFor="title">Nombre del producto</label>
          <Input id="title" name="title" type="text" placeholder="Nombre del producto" onChange={handleChange} value={producto.title} />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock en tienda</label>
          <Input id="stock" name="stock" type="number" placeholder="Stock en tienda" onChange={handleChange} value={producto.stock} />
        </div>

        <div className="form-group">
          <label htmlFor="totalStock">Stock total</label>
          <Input id="totalStock" name="totalStock" type="number" placeholder="Stock total" onChange={handleChange} value={producto.totalStock} />
        </div>

        <div className="form-group">
          <label htmlFor="costPrice">Precio de costo</label>
          <Input id="costPrice" name="costPrice" type="number" icon="$" placeholder="Precio de costo" onChange={handleChange} value={producto.costPrice} />
        </div>

        <div className="form-group">
          <label htmlFor="sellingPrice">Precio de venta</label>
          <Input id="sellingPrice" name="sellingPrice" type="number" icon="$" placeholder="Precio de venta" onChange={handleChange} value={producto.sellingPrice} />
        </div>

        <div className="form-group">
          <label htmlFor="percentage">Porcentaje de ganancia</label>
          <Input id="percentage" name="percentage" type="number" icon="%" placeholder="Porcentaje de ganancia" onChange={handleChange} value={producto.percentage} />
        </div>

        <div className="form-group">
          <label htmlFor="code">Código</label>
          <Input id="code" type="number" icon="#" placeholder="Código" onChange={handleChangeCode} onKeyDown={handleEnterProduct} value={code} />
        </div>

        {/* <Button color="green">Crear</Button> */}
      </Card>
    </div>

  );
};

export default AddProduct;
