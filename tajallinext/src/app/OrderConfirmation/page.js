'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './OrderConfirmation.css';
import logo from '../../../public/assets/logo.webp';
import { useOrder } from '@/Context/OrderContext';
import Image from 'next/image';

const OrderConfirmation = () => {
    const orderDetail = useOrder();
    const { updateOrderState } = useOrder();
    const router = useRouter();
    const searchParams = useSearchParams();
    const couponFromUrl = searchParams.get('coupon');
    const autoApply = searchParams.get('autoApply') === 'true';
    const orderDetails = orderDetail?.orderDetails;

    // State for coupon handling
    const [couponCode, setCouponCode] = useState('');
    const initialSubTotal = orderDetails?.reduce((acc, product) => acc + product.price, 0) || 0;
    const [totalPay, setTotalPay] = useState(initialSubTotal);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(1);
    const [userinfo, setUserinfo] = useState('');
    const [useReferral, setUseReferral] = useState(true);
    const [deliveryChargeState, setDeliveryChargeState] = useState(0);
    const [shippingDetails, setShippingDetails] = useState({
        order_id: "224-47821",
        order_date: "2024-07-01 11:11",
        pickup_location: "Delhi",
        billing_customer_name: "",
        billing_last_name: "",
        billing_address: "",
        billing_city: "",
        billing_pincode: "",
        billing_state: "",
        billing_country: "India",
        billing_email: "",
        billing_phone: "",
        shipping_is_billing: true,
        payment_method: "Prepaid",
        sub_total: totalPay,
        length: "10",
        breadth: "15",
        height: "20",
        weight: orderDetails?.weight,
        productId: orderDetails?.productId
    });

    const [couponDiscount, setCouponDiscount] = useState(0);
    const [referralDiscount, setReferralDiscount] = useState(0);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Function to apply coupon
    const applyCoupon = async (code) => {
        if (!code) return;
        
        try {
            console.log('Applying coupon:', code);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/coupon/use`, {
                price: shippingDetails.sub_total,
                couponName: code
            });

            if (response.status === 200 && response.data.discountedPrice !== undefined) {
                const discount = shippingDetails.sub_total - response.data.discountedPrice;
                setCouponDiscount(discount);
                setCouponCode(code);
                setReferralDiscount(0);
                setUseReferral(false);
                setTotalPay(response.data.discountedPrice);
                console.log('Coupon applied successfully');
            } else {
                console.error('Failed to apply coupon:', response.data.message);
            }
        } catch (error) {
            console.error('Error applying coupon:', error.message);
        }
    };

    // Initialize shipping details with total pay
    useEffect(() => {
        if (orderDetails) {
            const initialTotal = orderDetails.reduce((acc, product) => acc + product.price, 0);
            setTotalPay(initialTotal);
        }
    }, [orderDetails]);

    // Check for coupon in localStorage on component mount
    useEffect(() => {
        const checkAndApplyCoupon = () => {
            const tempCouponDetails = localStorage.getItem('tempCouponDetails');
            console.log('Checking localStorage for coupon:', tempCouponDetails);
            
            if (tempCouponDetails) {
                try {
                    const { coupon, autoApply } = JSON.parse(tempCouponDetails);
                    console.log('Found coupon details:', { coupon, autoApply });
                    
                    if (coupon && autoApply) {
                        setCouponCode(coupon);
                        // Small delay to ensure shipping details are initialized
                        setTimeout(() => {
                            applyCoupon(coupon);
                        }, 100);
                    }
                    // Clean up localStorage
                    localStorage.removeItem('tempCouponDetails');
                } catch (error) {
                    console.error('Error parsing coupon details:', error);
                }
            }
        };

        // Initial check
        checkAndApplyCoupon();

        // Also check after a short delay to ensure all state is initialized
        const timer = setTimeout(checkAndApplyCoupon, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleApplyCoupon = () => {
        applyCoupon(couponCode);
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setUseReferral(checked);
    
        if (checked && userinfo.discount >= 100) {
            const referral = shippingDetails.sub_total * 0.1;
            setReferralDiscount(referral);
            setCouponDiscount(0);
        } else {
            setReferralDiscount(0);
        }
    };
    
    useEffect(() => {
        const totalDiscount = couponDiscount + referralDiscount;
        const newTotal = shippingDetails.sub_total - totalDiscount;
        setTotalPay(newTotal);
    }, [couponDiscount, referralDiscount, shippingDetails.sub_total]);
    
    useEffect(() => {
        const fetchUserData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser`, config);
                setShippingDetails(prevDetails => ({
                    ...prevDetails,
                    billing_customer_name: response.data.firstName,
                    billing_last_name: response.data.lastName,
                    billing_address: response.data.address,
                    billing_city: response.data.city,
                    billing_pincode: response.data.pincode,
                    billing_state: response.data.state,
                    billing_email: response.data.email,
                    billing_phone: response.data.phone
                }));

            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token]);

        useEffect(() => {
        const userinfolocal= JSON.parse(localStorage.getItem('user'))
        setUserinfo(userinfolocal);
        if (userinfolocal.discount >= 100) {
            const referral = shippingDetails.sub_total * 0.1;
            setReferralDiscount(referral);
        } else {
            setReferralDiscount(0);
        }
        }, [])

    useEffect(() => {
        const loadRazorpay = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        };

        loadRazorpay();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!shippingDetails.billing_customer_name) newErrors.billing_customer_name = 'First Name is required';
        if (!shippingDetails.billing_address) newErrors.billing_address = 'Address is required';
        if (!shippingDetails.billing_city) newErrors.billing_city = 'City is required';
        if (!shippingDetails.billing_pincode) newErrors.billing_pincode = 'Pincode is required';
        if (!shippingDetails.billing_state) newErrors.billing_state = 'State is required';
        if (!shippingDetails.billing_email) newErrors.billing_email = 'Email is required';
        if (!shippingDetails.billing_phone) newErrors.billing_phone = 'Phone is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateDeliveryCharge = () => {
        console.log('calculateDeliveryCharge called from function definition');
        // Apply a flat delivery charge of 200 for all carts
        console.log('Applying flat delivery charge of 200');
        return 200;
    };

    console.log('calculateDeliveryCharge called from render');
    const deliveryCharge = calculateDeliveryCharge();
    const totalPayable = totalPay + deliveryChargeState;
    const saved = shippingDetails.sub_total - totalPay;

    // Calculate delivery charge when shipping details are updated
    useEffect(() => {
        console.log('Calculating delivery charge in useEffect');
        const calculatedCharge = calculateDeliveryCharge();
        if (calculatedCharge !== deliveryChargeState) {
            setDeliveryChargeState(calculatedCharge);
        }
    }, [shippingDetails.billing_state, initialSubTotal]);

    const renderDeliveryCharges = () => {
        return (
            <div className="delivery-charges">
                <h3>Delivery Charges</h3>
                <p>{deliveryChargeState === 0 ? 'Free Delivery' : `₹${deliveryChargeState}`}</p>
            </div>
        );
    };

    const renderTotalPayableAmount = () => {
        return (
            <div className="total-payable">
                <h3>Total Payable Amount</h3>
                <p>₹{totalPayable}</p>
            </div>
        );
    };

    const renderProgressBar = () => {
        return (
            <div className="progress-bar">
                <div className={`progress ${activeStep >= 2 ? 'active' : ''}`}><span className={`checkbox-icon ${activeStep >= 2 ? 'active' : ''}`}>✓</span>Customer Details</div>
                <div className={`progress ${activeStep >= 3 ? 'active' : ''}`}><span className={`checkbox-icon ${activeStep >= 3 ? 'active' : ''}`}>✓</span>Shipping & Payment</div>
                <div className={`progress ${activeStep >= 4 ? 'active' : ''}`}><span className={`checkbox-icon ${activeStep >= 4 ? 'active' : ''}`}>✓</span>Order Confirmation</div>
            </div>
        );
    };

    const handleNextStep = () => {
        if (!validateForm()) return;
        setActiveStep(prevStep => prevStep + 1);
    };

    const renderProductDetails = () => {
        return (
            <div className="order-confirmation-container">
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    {orderDetails.map((product, index) => (
                        <div key={index} className="product-details-orderconfirm">
                            <Image width={500} height={500} src={product.productImg} alt={product.title} />
                            <div className="product-info">
                                <h3>{product.title}</h3>
                                <p>Weight: {product.weight}g</p>
                                <p>Price: ₹{product.price / product.quantity}</p>
                                <p>Quantity: {product.quantity}</p>
                                <p>Subtotal: ₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handlePayment = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            console.log('calculateDeliveryCharge called from handlePayment');
            const deliveryCharge = calculateDeliveryCharge();
            const total_pay = totalPay + deliveryCharge;
            console.log("totttt", total_pay);
            const amountInPaisa = Math.max(total_pay, 100);

            const razorpayresponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/createOrder`, {
                amount: amountInPaisa,
                currency: 'INR',
                name: 'Product Name',
                description: 'Product Description'
            });

            const { currency, amount, razorpay_signature } = razorpayresponse.data.order;
            const order_id = razorpayresponse.data.order_id;
            console.log(order_id);
            console.log(razorpayresponse.data);
            console.log(amount);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: amount,
                currency: currency,
                order_id: order_id,
                razorpay_signature: razorpay_signature,
                handler: async function (response) {
                    try {
                      // 1. Verify payment first
                      const verifyResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        applyReferral:useReferral,
                        userId:userinfo.id
                      });
                  
                      if (!verifyResponse.data.success) {
                        throw new Error('Payment verification failed');
                      }
                  
                      // 2. Prepare order data
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                      const productsData = orderDetails.map(product => ({
                        cartId: product.cartId,
                        productId: product.productId,
                        productName: product.title,
                        quantity: product.quantity,
                        weight: product.weight,
                        price: product.price,
                        productImg: product.productImg,
                        slug:product.slug
                      }));
                  
                      // 3. Create order
                      const createOrderResponse = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/panelOrder`,
                        {
                          orderItems: productsData,
                          order_id: order_id,
                          total_pay: total_pay,
                          payment_id: response.razorpay_payment_id,
                          shippingAddress: {
                            name: `${shippingDetails.billing_customer_name} ${shippingDetails.billing_last_name}`,
                            address: shippingDetails.billing_address,
                            city: shippingDetails.billing_city,
                            state: shippingDetails.billing_state,
                            country: shippingDetails.billing_country,
                            pincode: shippingDetails.billing_pincode,
                            email: shippingDetails.billing_email,
                            phone: shippingDetails.billing_phone,
                          }
                        },
                        {
                          headers: { Authorization: `Bearer ${token}` }
                        }
                      );
                  
                      if (!createOrderResponse.data.success) {
                        throw new Error('Failed to create order');
                      }
                  
                      // 4. Update context state
                      await updateOrderState({
                        orderDetails, 
                        shippingDetails,
                        payment_id: response.razorpay_payment_id
                      });
                  
                      // 5. Navigate to success page
                      router.push('/order-success');
                  
                    } catch (error) {
                      console.error('Payment processing error:', error.message);
                      alert(`Payment failed: ${error.message}`);
                      // Consider reverting any local state changes here if needed
                    }
                  },
                prefill: {
                    name: `${shippingDetails.billing_customer_name} ${shippingDetails.billing_last_name}`,
                    email: shippingDetails.billing_email,
                    contact: shippingDetails.billing_phone
                },
                theme: {
                    color: '#723207'
                }
            };

            if (typeof window !== 'undefined' && window.Razorpay) {
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                throw new Error('Razorpay SDK not loaded');
            }
        } catch (error) {
            console.error('Error during payment:', error.message);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div className="order-confirmation-main">
          
            <div className='toplogo'>
                <img src={logo.src} alt="logo" className='img0' />
            </div>
            <div className="mainflex container">
                <div className='sideflex'>
                    {renderProductDetails()}
                    <hr></hr>
                    <div className='totalprice'>
                        <div className='p1'>
                            <p>Subtotal</p>
                            <p> ₹{shippingDetails.sub_total}/-</p>
                        </div>
                        <div className='p2'>
                            <p>Delivery Charges</p>
                            <p>₹{deliveryChargeState}/-</p>
                        </div>
                        <hr></hr>
                        <div className='totalorder'>
                            <p>Total Price </p>
                            <p>₹{shippingDetails.sub_total + deliveryChargeState}/-</p>
                        </div>
                        <hr></hr>
                        <div className="coupon-code">
                            <h3>Have a coupon?</h3>
                            <div className='coupon_class'>
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button type="button" onClick={handleApplyCoupon}>
                                    Apply Coupon
                                </button>
                            </div>
                        </div>
                        {couponDiscount > 0 && (
                            <h2 className='saved'>
                                Congratulation! You saved <span>₹{couponDiscount}/-</span> by <span>{couponCode}</span> coupon
                            </h2>
                        )}
                        <hr></hr>
                        {userinfo.discount >=100 && (
                            <>
                        <div className="form-check d-flex align-items-center gap-2">
                        <input className="form-check-input" type="checkbox" value="" id="checkChecked" checked={useReferral}
                            onChange={handleCheckboxChange} />
                        <label className="form-check-label" htmlFor="checkChecked">
                            Use <b>100 Refral Point</b> = <span className='text-danger fw-bold'>10% off</span>
                        </label>
                        </div>
                        <hr></hr>
                            </>
                        )}
                        {referralDiscount > 0 && (
                            <h2 className='saved'>
                                100 Referral Point Used. You Save! <span>₹{referralDiscount}/-</span> 
                            </h2>
                        )}
                        <div className='totalorder'>
                            <p className='h5'>Total Price after discount</p>
                            <p className='h5 text-success fw-bold'>₹{totalPayable}/-</p>
                        </div>
                    </div>
                </div>
                <div className="order-confirmation-container">
                    {renderProgressBar()}
                    <div className="checkout-content">
                        <div className={`checkout-section ${activeStep === 1 ? 'active' : ''}`}>
                            <form className="shipping-form py-5">
                                <h3>Customer Details</h3>
                                <div className='customerdetails'>
                                    <div>
                                        <label>
                                            First Name:
                                            <input type="text" name="billing_customer_name" value={shippingDetails.billing_customer_name} onChange={handleChange} />
                                            {errors.billing_customer_name && <p className="error">{errors.billing_customer_name}</p>}
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Last Name:
                                            <input type="text" name="billing_last_name" value={shippingDetails.billing_last_name} onChange={handleChange} />
                                            {errors.billing_last_name && <p className="error">{errors.billing_last_name}</p>}
                                        </label>
                                    </div>
                                </div>

                                <h3>Shipping Details</h3>
                                <label>
                                    Address:
                                    <input type="text" name="billing_address" value={shippingDetails.billing_address} onChange={handleChange} />
                                    {errors.billing_address && <p className="error">{errors.billing_address}</p>}
                                </label>
                                <div className='customerdetails'>
                                    <label>
                                        City:
                                        <input type="text" name="billing_city" value={shippingDetails.billing_city} onChange={handleChange} />
                                        {errors.billing_city && <p className="error">{errors.billing_city}</p>}
                                    </label>
                                    <label>
                                        Pincode:
                                        <input type="number" name="billing_pincode" value={shippingDetails.billing_pincode} onChange={handleChange} />
                                        {errors.billing_pincode && <p className="error">{errors.billing_pincode}</p>}
                                    </label>
                                    <label>
                                        State:
                                        <input type="text" name="billing_state" value={shippingDetails.billing_state} onChange={handleChange} />
                                        {errors.billing_state && <p className="error">{errors.billing_state}</p>}
                                    </label>
                                </div>
                                <div className='customerdetails'>
                                    <label>
                                        Email:
                                        <input type="email" name="billing_email" value={shippingDetails.billing_email} onChange={handleChange} />
                                        {errors.billing_email && <p className="error">{errors.billing_email}</p>}
                                    </label>
                                    <label>
                                        Phone:
                                        <input type="tel" name="billing_phone" value={shippingDetails.billing_phone} onChange={handleChange} />
                                        {errors.billing_phone && <p className="error">{errors.billing_phone}</p>}
                                    </label>
                                </div>
                                <button type="button" className="next-btn" onClick={handleNextStep}>Next</button>
                            </form>
                        </div>
                        <div className={`checkout-section ${activeStep === 2 ? 'active' : ''}`}>
                            <h3>Shipping & Payment</h3>
                            <div className="shipping-address-details">
                                <p>Customer Name: {shippingDetails.billing_customer_name}</p>
                                <p>product cost: {shippingDetails.sub_total}</p>
                                <p>Shipping Address: {shippingDetails.billing_address}</p>
                                <p>City:{shippingDetails.billing_city}</p>
                                <p> state:     {shippingDetails.billing_state}</p>
                                <p>  country:    {shippingDetails.billing_country}</p>
                                <p>   pincode:{shippingDetails.billing_pincode}</p>
                                <p>  email:{shippingDetails.billing_email}</p>
                                <p>    phone:  {shippingDetails.billing_phone}</p>
                            </div>
                            <div className='delivery-charges'>
                                {renderDeliveryCharges()}
                                {renderTotalPayableAmount()}
                            </div>

<button
  type="button"
  className="pay-btn"
  onClick={() => alert('⚠️ Payment Gateway is under maintenance. Please try after some time.')}
>
  Pay Now
</button>

                            {/* <button type="button" className="pay-btn" onClick={handlePayment}>Pay Now</button> */}
                            
                        </div>
                    </div>
                </div>
            </div>
                  </div>
    );
};

export default OrderConfirmation;

