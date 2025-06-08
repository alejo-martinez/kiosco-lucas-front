'use client';

import { Card, Button } from "@/components";

import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { useRef } from "react";
import socket from "@/utils/socket.config";
import { toast } from "react-toastify";

const Cart = () => {
  const isProcessing = useRef(false);
  const { cart, loading, removeProductById, emptyCart } = useCart();
  const { user } = useSession();

  const handleAdd = async (e, prod) => {
    e.preventDefault();
    if (isProcessing.current) return;
    isProcessing.current = true;
    if (prod.quantity + 1 <= prod.product.stock) {
      socket.emit('addToCart', { cid: user.cart, pid: prod.product._id, quantity: 1 });
    }

    setTimeout(() => isProcessing.current = false, 300);
  }

  const handleRemove = async (e, prod) => {
    e.preventDefault();
    if (isProcessing.current) return;
    isProcessing.current = true;
    if (prod.quantity - 1 > 0) {
      socket.emit('addToCart', { cid: user.cart, pid: prod.product._id, quantity: -1 });
    }

    setTimeout(() => isProcessing.current = false, 300);
  }

  const clearCart = async (e) => {
    e.preventDefault();
    const response = await emptyCart(user.cart);
    console.log(response)
    if (response.status === 'success') {

      toast.success(response.message, {
        autoClose: 2000,
        closeButton: true,
        hideProgressBar: true,
        className: 'toast-success'
      })
    }
  }

  const removeProduct = async (e, pid) => {
    e.preventDefault();
    const response = await removeProductById(pid);
    if (response.status === 'success') {
      toast.success('Producto eliminado de la venta !', {
        autoClose: 2000,
        closeButton: true,
        hideProgressBar: true,
        className: 'toast-success'
      })
    }
  }


  return (
    <>
      <div className="cart">
        {cart.products?.length === 0 ?
          <Card className="empty">
            <div>
              <i className="fa-solid fa-circle-exclamation fa-xl"></i>
            </div>
            <p>No hay ninguna venta en curso.</p>
          </Card>
          :
          <>
            <table className="cart__table">
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
                {cart.products?.map((value, index) => {

                  return (

                    <tr key={index}>
                      <td>{value.product.code}</td>
                      <td>{value.product.title}</td>
                      <td align="center">
                        {value.quantity - 1 > 0 &&
                          <Button color="red" onClick={(e) => handleRemove(e, value)}>
                            <i className="fa-solid fa-circle-minus fa-xl"></i>
                          </Button>
                        }
                        {value.quantity}
                        {value.quantity + 1 <= value.product.stock &&
                          <Button color="green" onClick={(e) => handleAdd(e, value)}>
                            <i className="fa-solid fa-circle-plus fa-xl"></i>
                          </Button>
                        }
                      </td>
                      <td align="center">${value.product.sellingPrice.toFixed(2)}</td>
                      <td align="center">${value.totalPrice.toFixed(2)}</td>
                      <td align="center">
                        <Button color="red" onClick={(e) => removeProduct(e, value.product._id)}>
                          <i className="fa-solid fa-trash-can"></i>
                        </Button>
                      </td>
                    </tr>
                  )
                })}


              </tbody>
            </table>

            <Button color="red" onClick={clearCart}>Eliminar todo</Button>
          </>
        }
      </div>
    </>
  );
};

export default Cart;
