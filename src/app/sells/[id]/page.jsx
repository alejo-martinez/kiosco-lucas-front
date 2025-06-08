'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/axios.config";
import { Card } from "@/components";

const Sell = () => {

    const { id } = useParams();

    const [sell, setSell] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get(`/api/ticket/${id}`);
            const data = response.data;
            console.log(data.payload)
            setSell(data.payload);
            setLoading(false);
        } catch (error) {
            toast.error(error.message, {
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                hideProgressBar: true,
                closeButton: false,
                className: 'toast-error'
            })
        }
    }

    const formatDate = (date) => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Mostrar en formato de 24 horas
            timeZone: 'America/Argentina/Buenos_Aires' // Especifica la zona horaria de Argentina
        };
        return new Date(date).toLocaleDateString('es-AR', options);
    }

    const formatPaymentMethod = (data) => {
        switch (data) {
            case "eft":
                return "Efectivo"

            case "mp":
                return "Mercado Pago"

            case "td":
                return "Tarjeta de débito"
            case "tc":
                return "Tarjeta de crédito"
            default:
                break;
        }
    }

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="resume">
            {loading ?
                <p>Cargando...</p>
                :
                <>
                    <h2>Venta</h2>

                    <Card className="resume__header">
                        <div className="resume__header__detail">
                            <div>
                                <div>
                                    <p>Realizada el día</p>
                                    <span>{formatDate(sell.created_at)} hs</span>
                                </div>

                                <div>
                                    <p>Realizada por</p>
                                    <span>{sell.seller.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="resume__header__total">
                            <p>Total</p>
                            <span>${sell.amount.toFixed(2)}</span>
                        </div>
                    </Card>

                    <h2>Método de pago</h2>

                    <div className="resume__payment-methods">
                        <Card className="resume__payment-methods__method">
                            <p>{formatPaymentMethod(sell.payment_method)}</p>
                        </Card>
                    </div>

                    <h2>Productos</h2>

                    <div className="resume__products">
                        {sell.products.map((value, index) => {
                            return (
                                <Card className="resume__product" keyId={index}>
                                    <div className="resume__product__detail">
                                        <p>{value.product.title}</p>
                                        <p>
                                            Cantidad: <span>{value.quantity}</span>
                                        </p>
                                        <p>
                                            Precio unitario: <span>${(value.totalPrice / value.quantity).toFixed(2)}</span>
                                        </p>
                                        <p>
                                            Total: <span>${value.totalPrice.toFixed(2)}</span>
                                        </p>
                                    </div>

                                </Card>
                            )
                        })}
                    </div>
                </>
            }
        </div>
    )
};

export default Sell;