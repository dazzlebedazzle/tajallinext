"use client"; // Ensure this component is treated as a Client Component in Next.js

import { useState, useContext } from "react";
import { useCart } from "@/Context/CartContext"; // Update the import path
import { AuthContext } from "@/Context/AuthContext"; // Update the import path
import { useRouter } from "next/navigation"; // Use Next.js router
import { IoClose } from "react-icons/io5"; // Close icon
import dynamic from "next/dynamic";
import "./Cart.css"; // Ensure the CSS file is correctly imported
import { FiShoppingCart } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import emptyCartAnimation from '../../../public/emptykart.json';
import { useOrder } from "@/Context/OrderContext";
import Image from "next/image";
import Loader from "@/Components/Loader/Loader";


// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: emptyCartAnimation, // ✅ Correct
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, addToCart } = useCart();
  const { verifOtp } = useContext(AuthContext);
  const { setOrderDetails } = useOrder();
  const router = useRouter(); // Use Next.js router
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);


  if (!Array.isArray(cart)) {
    return <Loader/>;
  }

  const handleRemove = (productId, weight) => {
    removeFromCart(productId, weight);
  };

  const handleIncrease = (productId, weight, quantity) => {
    updateQuantity(productId, weight, quantity + 1);
  };

  const handleDecrease = (productId, weight, quantity) => {
    if (quantity > 1) {
      updateQuantity(productId, weight, quantity - 1);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async () => {
    if (!validateEmail(emailAddress)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setIsLoadingOtp(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/sendOTP`, {
        email: emailAddress,
      });
      setOtpSent(true);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || "User Not Registered");
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await verifOtp({ email: emailAddress, otp });
      const token = localStorage.getItem("token");
      if (token) {
        setShowLoginPopup(false);
        // Fetch account products from API
        const { data: accountProducts } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/cart`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Merge cart items with account products
        const allProducts = [...cart, ...accountProducts];

        // Prepare order details
        const orderDetails = allProducts.map((item) => ({
          cartId: item.cartId || null,
          productImg: item.image,
          productId: item.productId,
          title: item.title,
          category: item.category,
          weight: item.weight,
          quantity: item.quantity,
          price: item.totalPrice * item.quantity,
          slug: item.slug
        }));
        setOrderDetails(orderDetails);
        router.push("/OrderConfirmation", { state: { orderDetails } }); // Use Next.js router
      } else {
        setError(response?.error || response?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err.response?.data || err.message);
      setError(err?.response?.data?.error || "Invalid OTP. Please try again.");
    }
  };

  // const handleProceedToPayment = () => {
  //   const user = localStorage.getItem("token"); // Check if user is logged in

  //   if (!user) {
  //     setShowLoginPopup(true);
  //     return;
  //   }
  //   if (cart.length === 0 || totalPrice <= 0) {
  //     setError("Your cart is empty. Please add products before checkout.");
  //     return;
  //   }

  //   const orderDetails = cart.map((item) => ({
  //     cartId: item.cartId,
  //     productImg: item.image,
  //     productId: item.productId,
  //     title: item.title,
  //     category: item.category,
  //     weight: item.weight,
  //     quantity: item.quantity,
  //     price: item.totalPrice * item.quantity,
  //   }));
  //   localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  //   router.push("/OrderConfirmation"); // Use Next.js router
  // };


  
// const handleProceedToPayment = () => {

//   const router = useRouter();

//   const user = localStorage.getItem('token');
//   if (!user) {
//     setShowLoginPopup(true);
//     return;
//   }
//   if (cart.length === 0 || totalPrice <= 0) {
//     setError('Your cart is empty. Please add products before checkout.');
//     return;
//   }

//   const orderDetails = cart.map(item => ({
//     cartId: item.cartId,
//     productImg: item.image,
//     productId: item.productId,
//     title: item.title,
//     category: item.category,
//     weight: item.weight,
//     quantity: item.quantity,
//     price: item.totalPrice * item.quantity,
//   }));

//   setOrderDetails(orderDetails);
//   router.push('/OrderConfirmation');
// };

const handleProceedToPayment = () => {
  if (cart.length === 0 || totalPrice <= 0) {
    setError('Your cart is empty. Please add products before checkout.');
    return;
  }

  const orderDetails = cart.map(item => ({
    cartId: item.cartId,
    productImg: item.image,
    productId: item.productId,
    title: item.title,
    category: item.category,
    weight: item.weight,
    quantity: item.quantity,
    price: item.totalPrice * item.quantity,
    slug: item.slug
  }));

  setOrderDetails(orderDetails);
  router.push('/OrderConfirmation');
  onClose();
};

  const truncateTitle = (title, wordLimit) => {
    const words = title.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : title;
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.totalPrice * item.quantity,
    0
  );

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: emptyCartAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>
          <span className="me-1">
            <FiShoppingCart />
          </span>{" "}
          Your Cart · <span className="itemin">{cart.length} items</span>
        </h2>
        <button className="close-btn" aria-label="Close button" onClick={onClose}>
          <IoClose size={24} />
        </button>
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart" key="emptycart">
            <Lottie
              options={defaultOptions}
              height={"100%"}
              width={"100%"}
              className="emptycarticon"
            />
            <p className="emptycartpara">Your cart is empty.</p>
          </div>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={item.cartId || `${item.productId}-${item.weight}-${index}`} className="cart-item">
                <Image
                width={500} height={500}
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{truncateTitle(item.title, 7)}</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="m-0">
                      Rs.{item.totalPrice}
                      <span>
                        &nbsp; Rs.<s> {item.totalPrice + 100}</s>
                      </span>
                    </p>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleDecrease(item.productId, item.weight, item.quantity)
                        }
                        className="buttons"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleIncrease(item.productId, item.weight, item.quantity)
                        }
                        className="buttons"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.productId, item.weight)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="cart-footer">
        <h2>
          ₹{totalPrice} <span>Estimated total</span>
        </h2>
       
        <button
          className="checkout-btn"
          onClick={handleProceedToPayment}
          disabled={cart.length === 0 || totalPrice <= 0}
        >
          Checkout
        </button>
      </div>

      {/* Mobile OTP Login Popup */}
      {showLoginPopup && (
        <div className="login-popup">
          <div className="login-popup-content">
            <button
              className="loginpopup-closebtn"
              onClick={() => setShowLoginPopup(false)}
            >
              <IoIosCloseCircleOutline />
            </button>
          
            {isLoadingOtp ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', flexDirection: 'column' }}>
                <Loader />
                <p style={{ marginTop: '20px' }}>Sending OTP...</p>
              </div>
            ) : !otpSent ? (
              <>
                <p style={{color:"red"}}>{error}</p>
                <p>Enter your email address to continue:</p>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  disabled={isLoadingOtp}
                />
                <button className="login-btn" onClick={handleSendOtp} disabled={isLoadingOtp}>
                  {isLoadingOtp ? 'Sending...' : 'Send OTP'}
                </button>
                {emailError && <p className="error-message">{emailError}</p>}
              </>
            ) : (
              <>
                <p>
                  Enter the OTP sent to {emailAddress}:{" "}
                  <sup
                    className="editnumbersup"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    <FaEdit />
                  </sup>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <button className="verify-btn" onClick={handleOtpVerification}>
                  Verify OTP
                </button>
                {error && <p className="error-message">{error}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;





