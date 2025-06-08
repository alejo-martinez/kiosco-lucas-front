"use client";

import { Button, Cart, Input, Modal, Payment } from "@/components";
import { useCart } from "@/context/CartContext";
import { useResume } from "@/context/ResumeContext";
import { useEffect, useState } from "react";
import socket from "@/utils/socket.config";
import api from "@/utils/axios.config";
import { toast } from "react-toastify";
import { useProduct } from "@/context/ProductContext";

const Home = () => {

  const descuento = process.env.NEXT_PUBLIC_DESCUENTO_VENDEDORES;

  const { loading } = useCart();
  const { showModal, initDay, initAmount, setInitAmount, setShowModal, createResume, showExpenseModal, setShowExpenseModal, openExpenseModal, resumeId } = useResume();
  const { updateLowStock, setUpdateLowStock, addStockModal, setAddStockModal } = useProduct();

  const [product, setProduct] = useState(null);
  const [querySearch, setQuerySearch] = useState('');
  const [stockValue, setStockValue] = useState(0);

  const handleInitAmount = (e) => {
    let value = e.target.value;
    if (value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }
    setInitAmount(value);
  }

  const submitInitAmount = async (e) => {
    try {
      e.preventDefault();
      const response = await createResume('diary', initAmount);
      localStorage.setItem('resumeId', response.id);

    } catch (error) {
      console.log(error)
    }
  }

  const closeExpenseModal = (e) => {
    e.preventDefault();
    if (product) setProduct(null)
    setShowExpenseModal(false);
  }

  const searchProduct = async (e) => {
    if (e.key === 'Enter') {
      socket.emit('searchCode', { query: querySearch });
      setQuerySearch('');
    }
  }

  const submitExpense = async (e) => {
    try {
      e.preventDefault();
      if (!product) return toast.error('Debes agregar un producto', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        className: 'toast-error'
      })
      if (!resumeId) return toast.error('Debes iniciar el día primero', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        className: 'toast-error'
      })
      const response = await api.post('/api/expense/create', { productId: product._id, resumeId: resumeId, quantity: 1 });
      const data = response.data;
      if (data.status === 'success') {
        setProduct(null);
        setShowExpenseModal(false);
        toast.success(data.message, {
          autoClose: 2000,
          closeButton: true,
          hideProgressBar: true,
          className: 'toast-success'
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message, {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        className: 'toast-error'
      })
    }
  }

  const submitUpdateStock = async (e) => {
    e.preventDefault();
    const response = await api.put(`/api/products/update/${updateLowStock._id}`, {
      field: 'stock',
      value: stockValue
    });
    const data = response.data;
    if (data.status === 'success') {
      toast.success(data.message, {
        autoClose: 2000,
        closeButton: true,
        hideProgressBar: true,
        className: 'toast-success'
      })
      setStockValue(0);
      setUpdateLowStock(null);
      setAddStockModal(false);
    }
  }

  const submitStockModal = async (e) => {
    searchProduct(e);

  }

  const handleChangeEmptyInput = (e) => {
    // if (e.target.value === '') {
    //   setProducts([]);
    // } else {
    setQuerySearch(e.target.value);
    // }
  }

  const handleChangeStockValue = (e) => {
    setStockValue(e.target.value);
  }


  useEffect(() => {
    socket.on('resultCode', async (data) => {
      setUpdateLowStock(data.producto);
      setProduct(data.producto);
    })

    socket.on('errorUpdate', async (data) => {
      toast.error(data.error, {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        className: 'toast-error'
      })
    })
  }, []);

  return (
    <div className="home">
      <div>
        {loading ? <p>Cargando...</p>
          :
          <>
            <Cart />
            <Payment />
            <Modal title="Iniciar jornada" isOpen={showModal} setIsOpen={initDay}>
              <Input type="number" placeholder="Caja inicial" onChange={handleInitAmount} value={initAmount} />

              <div>
                <Button color="red" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button color="green" onClick={submitInitAmount}>Aceptar</Button>
              </div>
            </Modal>
            <Modal title="Agregar consumos" isOpen={showExpenseModal} setIsOpen={openExpenseModal} >
              <Input type="text" placeholder="Escanee un producto" value={querySearch} onKeyDown={searchProduct} onChange={handleChangeEmptyInput} />
              {product &&
                <div className="products__expense">
                  <span>Producto: {product.title}</span>
                  <span>Precio al vendedor: ${(product.sellingPrice * Number(descuento)).toFixed(2)}</span>
                  <Button onClick={submitExpense} color="green">Aceptar</Button>
                </div>
              }
              <Button onClick={closeExpenseModal} color="red">Cancelar</Button>
            </Modal>
          </>
        }

        <Modal isOpen={addStockModal} setIsOpen={() => setAddStockModal(true)} title="Agregar stock">
          <Input placeholder={updateLowStock ? "Ingrese stock a agregar" : "Ingrese el código del producto"} value={updateLowStock ? stockValue : querySearch} type={updateLowStock ? "number" : "text"} onChange={!updateLowStock ? handleChangeEmptyInput : handleChangeStockValue} onKeyDown={submitStockModal} />
          {updateLowStock &&
            <>
              <div className="products__expense">
                <span>Producto: {updateLowStock.title}</span>
                <span>Stock actual: {updateLowStock.stock}</span>
              </div>

              <div>
                <Button color="green" onClick={submitUpdateStock}>Agregar</Button>
              </div>
            </>
          }
          <Button color="red" onClick={() => setAddStockModal(false)}>Cancelar</Button>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
