'use client';

import { Button, Tooltip, Pagination, Modal, Input } from "@/components";
import { useEffect, useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { useSession } from "@/context/SessionContext";
import { useSearchParams } from 'next/navigation';
import api from "@/utils/axios.config";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Stock = () => {
  const router = useRouter();
  //Elementos de contextos
  const { getFilterProds, addStockModal, setAddStockModal, setUpdateLowStock, updateLowStock } = useProduct();
  const { user, adminLogued } = useSession();

  //Parámetros de búsqueda
  const searchParams = useSearchParams();
  const paramValue = searchParams.get("query");
  const filterParam = searchParams.get("filter");
  const valueFilterParam = searchParams.get("valueFilter");

  //Estados locales
  const [products, setProducts] = useState([]);
  const [setings, setSetings] = useState({});
  const [loading, setLoading] = useState(true);
  const [stockValue, setStockValue] = useState(0);
  const [indexProd, setIndexProd] = useState(null);
  const [deleteProd, setDeleteProd] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [indexDelete, setIndexDelete] = useState(null)

  //Función para traer la data
  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (paramValue) queryParams.append("query", paramValue);
      if (filterParam && valueFilterParam) {
        queryParams.append("filter", filterParam);
        queryParams.append("valueFilter", valueFilterParam);
      }

      const data = await getFilterProds(queryParams);
      setProducts(data.payload.docs);
      setSetings({ hasNextPage: data.payload.hasNextPage, hasPrevPage: data.payload.hasPrevPage, nextPage: data.payload.nextPage, page: data.payload.page, prevPage: data.payload.prevPage, totalPages: data.payload.totalPages });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const openModalLowStock = (e, prod, index) => {
    e.preventDefault();
    setUpdateLowStock(prod);
    setAddStockModal(true)
    setIndexProd(index)
  }

  const submitUpdateStock = async (e) => {
    e.preventDefault();
    const response = await api.put(`/api/products/update/${updateLowStock._id}`, {
      field: 'stock',
      value: stockValue
    });
    const data = response.data;
    if (data.status === 'success') {
      setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        newProducts[indexProd] = {
          ...newProducts[indexProd], // Copiás el producto existente
          stock: newProducts[indexProd].stock + Number(stockValue) // Sumás el stock
        };
        return newProducts;            // Devolvés el nuevo array para setear el estado
      });
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

  const openModalDelete = (e, prod, index) => {
    e.preventDefault();
    setDeleteProd(prod);
    setShowDeleteModal(true);
    // setIndexDelete(index)
  }

  const deleteProduct = async (e) => {
    try {
      e.preventDefault();
      const response = await api.delete(`/api/products/delete/${deleteProd._id}`);
      const data = response.data;
      if (data.status === 'success') {
        setProducts(prev => prev.filter(p => p._id !== deleteProd._id));
        toast.success('Producto eliminado !', {
          autoClose: 2000,
          closeButton: true,
          hideProgressBar: true,
          className: 'toast-success'
        })
        setShowDeleteModal(false);
        setDeleteProd(null);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        className: 'toast-error'
      })
    }
  }

  const navigateUpdateProduct = (e, pid) => {
    e.preventDefault();
    router.push(`/panel/update/${pid}`);
  }

  const handleChangeStockValue = (e) => {
    setStockValue(e.target.value);
  }



  useEffect(() => {
    fetchData();

  }, [paramValue, filterParam, valueFilterParam]);

  return (
    <>
      {loading ? <p>Cargando...</p>
        :
        <div className="stock">

          <table className="stock__table">
            <thead>
              <tr>
                <th align="left">Código</th>
                <th align="left">Producto</th>
                {adminLogued &&
                  <th>Precio de costo</th>
                }
                <th>Precio de venta</th>
                <th>Stock en tienda</th>
                <th>Stock total</th>
                {adminLogued &&
                  <th>Porcentaje de ganancia</th>
                }
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((value, index) => {

                return (
                  <tr key={index}>
                    <td>{value.code}</td>
                    <td align="left">{value.title}</td>
                    {adminLogued &&
                      <td align="center">${value.costPrice}</td>
                    }
                    <td align="center">${value.sellingPrice}</td>
                    <td align="center">
                      {value.stock}
                      {value.stock <= 0 &&
                        <Tooltip component="Sin stock disponible.">
                          <span className="stock__table__notification stock__table__notification--danger">
                            <i className="fa-solid fa-exclamation fa-xs"></i>
                          </span>
                        </Tooltip>
                      }
                      {(value.stock > 0 && value.stock < 2) &&
                        <Tooltip component="Quedan pocas unidades en stock.">
                          <span className="stock__table__notification stock__table__notification--warning">
                            <i className="fa-solid fa-exclamation fa-xs"></i>
                          </span>
                        </Tooltip>}
                    </td>
                    <td align="center">{value.totalStock}</td>
                    {user?.role === 'admin' &&
                      <td align="center">{value.percentage.toFixed(2)}%</td>
                    }
                    <td align="center">
                      <Button color="green" onClick={(e) => openModalLowStock(e, value, index)}>
                        <i title="Agregar stock" className="fa-solid fa-plus"></i>
                      </Button>
                      {user?.role === 'admin' &&
                        <Button onClick={(e) => navigateUpdateProduct(e, value._id)}>
                          <i title="Editar producto" className="fa-solid fa-pen"></i>
                        </Button>
                      }
                      {user?.role === 'admin' &&
                        <Button color="red" onClick={(e) => openModalDelete(e, value, index)}>
                          <i title="Eliminar producto" className="fa-solid fa-trash-can"></i>
                        </Button>
                      }
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </table>

          <Pagination pagination={setings} url={'/panel'} filters={{ valueFilterParam, filterParam }} />
        </div>
      }
      <Modal isOpen={addStockModal} setIsOpen={() => setAddStockModal(true)} title="Agregar stock">
        <Input placeholder={"Ingrese stock a agregar"} value={stockValue} type="number" onChange={handleChangeStockValue} />
        <div className="products__expense">
          <span>Producto: {updateLowStock?.title}</span>
          <span>Stock actual: {updateLowStock?.stock}</span>
        </div>

        <div>
          <Button color="green" onClick={submitUpdateStock}>Agregar</Button>
        </div>
        <Button color="red" onClick={() => setAddStockModal(false)}>Cancelar</Button>
      </Modal>
      <Modal isOpen={showDeleteModal} setIsOpen={() => setShowDeleteModal(true)} title="Eliminar producto">
        <p className="title__delete">¿Seguro que quieres eliminar el producto {deleteProd?.title}?</p>
        <div className="butons__modal">
          <Button onClick={deleteProduct} color="green">Aceptar</Button>
          <Button onClick={() => setShowDeleteModal(false)} color="red">Cancelar</Button>
        </div>
      </Modal>
    </>
  );
};

export default Stock;
