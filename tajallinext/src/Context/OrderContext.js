'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

// export const OrderProvider = ({ children }) => {
//   // Initialize state with values from localStorage if they exist
//   const [orderDetails, setOrderDetails] = useState(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('orderDetails');
//       return saved ? JSON.parse(saved) : [];
//     }
//     return [];
//   });




//   // Single state object to hold all order-related data
//   const [orderState, setOrderState] = useState(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('orderState');
//       return saved ? JSON.parse(saved) : {
//         orderDetails: null,
//         shippingDetails: null,
//         payment_id: null
//       };
//     }
//     return {
//       orderDetails: null,
//       shippingDetails: null,
//       payment_id: null
//     };
//   });

//   // Update localStorage whenever orderDetails changes
//   useEffect(() => {
//     localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
//   }, [orderDetails]);

//   // Update localStorage whenever orderState changes
//   useEffect(() => {
//     localStorage.setItem('orderState', JSON.stringify(orderState));
//   }, [orderState]);

//   // Function to update any part of the order state
//   const updateOrderState = (newData) => {
//     setOrderState(prev => ({
//       ...prev,
//       ...newData
//     }));
//   };

//   // Function to clear the entire order state
//   const clearOrderState = () => {
//     setOrderState({
//       orderDetails: null,
//       shippingDetails: null,
//       payment_id: null
//     });
//     setOrderDetails([]);
//     localStorage.removeItem('orderDetails');
//     localStorage.removeItem('orderState');
//   };

//   return (
//     <OrderContext.Provider value={{ 
//       orderDetails, 
//       setOrderDetails,
//       orderState,
//       updateOrderState,
//       clearOrderState
//     }}>
//       {children}
//     </OrderContext.Provider>
//   );
// };

export const OrderProvider = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderState, setOrderState] = useState({
    orderDetails: null,
    shippingDetails: null,
    payment_id: null,
  });

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Ensure code runs only on the client
    const savedDetails = localStorage.getItem('orderDetails');
    const savedState = localStorage.getItem('orderState');

    if (savedDetails) {
      setOrderDetails(JSON.parse(savedDetails));
    }

    if (savedState) {
      setOrderState(JSON.parse(savedState));
    }

    setHasMounted(true);
  }, []);

  // Sync orderDetails to localStorage
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }
  }, [orderDetails, hasMounted]);

  // Sync orderState to localStorage
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('orderState', JSON.stringify(orderState));
    }
  }, [orderState, hasMounted]);

  // Function to update any part of the order state
  const updateOrderState = (newData) => {
    setOrderState((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Function to clear the entire order state
  const clearOrderState = () => {
    setOrderState({
      orderDetails: null,
      shippingDetails: null,
      payment_id: null,
    });
    setOrderDetails([]);
    localStorage.removeItem('orderDetails');
    localStorage.removeItem('orderState');
  };

  // Avoid rendering children until component is mounted
  if (!hasMounted) return null;

  return (
    <OrderContext.Provider
      value={{
        orderDetails,
        setOrderDetails,
        orderState,
        updateOrderState,
        clearOrderState,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
export const useOrder = () => useContext(OrderContext);