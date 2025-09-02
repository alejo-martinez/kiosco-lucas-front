'use client';

import socket from "@/utils/socket.config";

import { useSession } from "@/context/SessionContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useProduct } from "@/context/ProductContext";
import { Modal, Button } from "@/components";


const Searcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSession();
  const { searchProductByCode, searchProductByTitle } = useProduct();

  const [showProductInfo, setShowProductInfo] = useState(false);
  const [productInfo, setProductInfo] = useState(null);


  const handleSubmitSearch = (e) => {
    if (e.key === 'Enter') {
      if (pathname === "/") {
        socket.emit('search', { query: e.target.value, cid: user.cart, quantity: 1, socketId: socket.id });
        e.target.value = '';
      } else if (pathname === "/panel") {
        socket.emit('searchCode', { query: e.target.value, socketId: socket.id });
        e.target.value = '';
      }
    }
  }

  const handleSearchProductByCode = async (e) => {
    if (e.key === 'Enter') {
      socket.emit('searchCode', { query: e.target.value, socketId: socket.id });
      e.target.value = '';
    }
  }

  const handleSearchProductByTitle = (e) => {
    if (e.target.value.length > 2) {
      socket.emit('searchTitle', { query: e.target.value, socketId: socket.id });
    }
    if (e.target.value.length === 0) {
      socket.emit('searchTitle', { query: null, socketId: socket.id });
    }
  }

  useEffect(() => {
    const handleResultCode = async (data) => {
      if (pathname === "/panel") {
        if (!data.producto) {
          toast.error('Código inválido', {
            autoClose: 2000,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            className: 'toast-error'
          });
        } else {
          if (!searchProductByCode) {
            router.push(`/panel/update/${data.producto?._id}`);
          } else {
            setProductInfo(data.producto);
            setShowProductInfo(true);
          }
        }
      } else if (pathname === '/') {
        if (!data.producto) {
          toast.error('Código inválido', {
            autoClose: 2000,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            className: 'toast-error'
          });
        } else {
          setProductInfo(data.producto);
          setShowProductInfo(true);
        }
      }
    };

    // Limpiamos el listener anterior y registramos uno nuevo con la versión actual del callback
    socket.off('resultCode', handleResultCode);
    socket.on('resultCode', handleResultCode);

    return () => {
      socket.off('resultCode', handleResultCode);
    };
  }, [pathname, searchProductByCode]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) return null;
  else return (
    <>
      <div className="searcher">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder={searchProductByTitle ? 'Producto' : 'Código'} onKeyDown={!searchProductByCode ? handleSubmitSearch : handleSearchProductByCode} onChange={searchProductByTitle ? handleSearchProductByTitle : undefined} />
      </div>
      <Modal isOpen={showProductInfo} setIsOpen={() => setShowProductInfo(true)} title="Información del producto">
        <div className="product-info">
          <span>Producto: {productInfo?.title}</span>
          <span>Precio: ${productInfo?.costPrice}</span>
          <span>Stock: {productInfo?.stock}</span>
          <Button onClick={() => setShowProductInfo(false)} color="red">Cerrar</Button>
        </div>
      </Modal>
    </>
  );
};

export default Searcher;
