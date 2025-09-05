'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

import api from "@/utils/axios.config";
import socket from "@/utils/socket.config";
// import { toast } from "react-toastify";
import { useSession } from "./SessionContext";

const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {
    const { user } = useSession();
    const [products, setProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [updateProd, setUpdateProd] = useState(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [addStockModal, setAddStockModal] = useState(false);
    const [updateLowStock, setUpdateLowStock] = useState(null);
    const [searchProductByCode, setSearchProductByCode] = useState(false);
    const [searchProductByTitle, setSearchProductByTitle] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/products/lowstock');
            const data = response.data;
            if (data.status === 'success') {
                if (data.payload.length > 0) {
                    setLowStockProducts(data.payload);

                }
                else {

                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getFilterProds = async (queryParams) => {
        try {
            const response = await api.get(`/api/products/filter/?${queryParams.toString() ? queryParams.toString() : 'query=1'}`)
            const data = response.data;
            if (data.status === 'success') {
                return data
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) fetchProducts();

        const handleResultTitle = (data) => {
            if (data.empty) return;
            if (data.results.length > 0) {
                setProducts(data.results);
            }
        };

        const handleLowStock = (data) => {
            setLowStockProducts(prev => {
                // Verificamos si ya existe el producto para evitar duplicados (opcional)
                console.log(data.prod);
                if (data.length === 0) return prev;
                const exists = prev.some(p => p._id === data.prod._id);
                if (exists) return prev;

                const updated = [...prev, data.prod];

                return updated;
            });
        };

        socket.on('resultTitle', handleResultTitle);
        socket.on('lowstock', handleLowStock);

        return () => {
            socket.off('resultTitle', handleResultTitle);
            socket.off('lowstock', handleLowStock);
        };
    }, [user, products]);

    return (
        <ProductContext.Provider value={{ products, setProducts, lowStockProducts, updateProd, setUpdateProd, showStockModal, setShowStockModal, getFilterProds, addStockModal, setAddStockModal, updateLowStock, setUpdateLowStock, searchProductByCode, setSearchProductByCode, searchProductByTitle, setSearchProductByTitle }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useCart must be used within a ProductProvider');
    }
    return context;
}