'use client';

import { useState, useEffect } from 'react';
import OrderDetails from '@/Components/OrderDetails/OrderDetails';
import './MyOrders.css';
import axios from 'axios';
import Link from 'next/link';
import ConfirmationModal from '@/Components/ConfirmationModal/ConfirmationModal';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/Login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getorders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const openConfirmation = (orderId) => {
        setOrderToCancel(orderId);
        setIsConfirmationOpen(true);
    };

    const closeConfirmation = () => {
        setOrderToCancel(null);
        setIsConfirmationOpen(false);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/orders/${orderToCancel}/cancel`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 200) {
                throw new Error('Failed to cancel order');
            }

            fetchOrders();
            closeConfirmation();
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: require('../../../public/noorders.json'),
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='myorders-main'>
            <Head>
                <link rel="canonical" href="https://www.tajalli.co.in/My-Order" />
            </Head>

            <div className="my-orders py-5">
                <h1>My Orders</h1>
                <div className="order-list">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <div className="order-card" key={order._id || order.order_id}>
                                <div className="order-card-header">
                                    <div>
                                        <p className="order-label">Order ID</p>
                                        <h2>{order.order_id || order._id}</h2>
                                    </div>
                                    <span className={`order-status ${order.orderStatus === 'Canceled' ? 'cancelled' : ''}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className='order-card2'>
                                    {order.orderItems.map((orderItem, index) => (
                                        <div className='block2' key={`${orderItem.productId || orderItem.slug || orderItem.productName}-${index}`}>
                                            <Link href={`/product/${orderItem.slug || ''}`} className="product-image-link">
                                                <Image
                                                    src={orderItem.productImg || '/default-image.png'}
                                                    alt={orderItem.productName || 'Product'}
                                                    className="product-image"
                                                    width={200}
                                                    height={200}
                                                />
                                            </Link>
                                            <div className='block1'>
                                                <Link href={`/product/${orderItem.slug || ''}`}>
                                                    <h3>{orderItem.productName}</h3>
                                                </Link>
                                                <div className='pnq'>
                                                    <p><strong>Quantity</strong><span>{orderItem.quantity}</span></p>
                                                    <p><strong>Weight</strong><span>{orderItem.weight}g</span></p>
                                                    <p><strong>Price</strong><span>Rs{orderItem.price}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='order_buttons'>
                                    <button onClick={() => openModal(order)}>View Details</button>
                                    <button onClick={() => openConfirmation(order.order_id || order._id)}>Cancel Order</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-orders">
                            <p>No orders found</p>
                            {typeof window !== 'undefined' && Lottie && (
                                <Lottie options={defaultOptions} height={300} width={300} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <OrderDetails order={selectedOrder} onClose={closeModal} />
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmationOpen}
                onClose={closeConfirmation}
                onConfirm={confirmCancelOrder}
                message="Are you sure you want to cancel this order?"
            />
        </div>
    );
};

export default MyOrders;
