'use client';

import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload || [];
    case 'ADD_TO_CART':
      const existingItemIndex = state.findIndex(item =>
        item.productId === action.payload.productId &&
        item.weight === action.payload.weight
      );
      if (existingItemIndex !== -1) {
        const newState = [...state];
        newState[existingItemIndex].quantity += action.payload.quantity;
        return newState;
      } else {
        return [...state, action.payload];
      }
    case 'REMOVE_FROM_CART':
      return state.filter(item =>
        !(item.productId === action.payload.productId &&
        item.weight === action.payload.weight));
    case 'UPDATE_QUANTITY': {
      const { productId, weight, quantity } = action.payload;
      return state.map(item => {
        if (item.productId === productId && item.weight === weight) {
          return { ...item, quantity };
        }
        return item;
      });
    }
    case 'CLEAR_CART':
      return []; // Clear entire cart
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const { authState } = useAuth();

  useEffect(() => {

    // Load cart from localStorage for guest users on initial load
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    const fetchCart = async () => {
      if (authState.isAuthenticated) {
        try {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart`, {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          });
          dispatch({ type: 'SET_CART', payload: data });
        } catch (error) {
          console.error('Failed to fetch cart', error);
        }
      }
      else {
        // For guest users, set cart from localStorage
        dispatch({ type: 'SET_CART', payload: localCart });
      }
      
    };

    fetchCart();
  }, [authState]);

  // const addToCart = async (product) => {
  //   try {
  //     const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart/add`, product, {
  //       headers: {
  //         Authorization: `Bearer ${authState.token}`,
  //       },
  //     });
  //     dispatch({ type: 'ADD_TO_CART', payload: data });
  //     dispatch({ type: 'SET_CART', payload: data });
  //   } catch (error) {
  //     console.error('Failed to add to cart', error);
  //   }
  // };

  const addToCart = async (product) => {
    if (!authState.isAuthenticated) {
      // For guest users, store cart items in localStorage
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Check if the product with the same weight already exists in cart
      const existingItemIndex = currentCart.findIndex(
        (item) => item.productId === product.productId && item.weight === product.weight
      );
  
      if (existingItemIndex !== -1) {
        // If item exists, update the quantity
        currentCart[existingItemIndex].quantity += product.quantity;
      } else {
        // If item does not exist, add to cart
        currentCart.push(product);
      }
  
      localStorage.setItem("cart", JSON.stringify(currentCart));
      dispatch({ type: "SET_CART", payload: currentCart });
    } else {
      // For logged-in users, send API request to update cart on server
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/cart/add`,
          product,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        console.log(product,"cartdat")
        dispatch({ type: "SET_CART", payload: data });
      } catch (error) {
        console.error("Failed to add to cart", error);
      }
    }
  };
  
  // useEffect(() => {
  //   const syncLocalCartToServer = async () => {
  //     if (authState.isAuthenticated) {
  //       const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        
  //       if (localCart.length > 0) {
  //         try {
  //           await axios.post(
  //             `${process.env.NEXT_PUBLIC_API_URL}/api/user/cart/mergecart`,
  //             { items: localCart },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${authState.token}`,
  //               },
  //             }
  //           );
  
  //           // Clear localStorage cart after syncing
  //           localStorage.removeItem("cart");
  //         } catch (error) {
  //           console.error("Failed to sync local cart to server", error);
  //         }
  //       }
  
  //       // Fetch updated cart from server
  //       try {
  //         const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart`, {
  //           headers: {
  //             Authorization: `Bearer ${authState.token}`,
  //           },
  //         });
  //         dispatch({ type: "SET_CART", payload: data });
  //       } catch (error) {
  //         console.error("Failed to fetch cart", error);
  //       }
  //     }
  //   };
  
  //   syncLocalCartToServer();
  // }, [authState]);
  

useEffect(() => {
  const syncLocalCartToServer = async () => {
    if (!authState.isAuthenticated) return ; // Exit if user is not logged in

    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    try {
      if (localCart.length > 0) {
        // Merge local cart with server
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/cart/mergecart`,
          { guestCart: localCart },
          {
            headers: { Authorization: `Bearer ${authState.token}` },
          }
        );
      }

      // Fetch the updated cart from server
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });

      dispatch({ type: "SET_CART", payload: data });

      // Keep local cart intact by updating localStorage after fetching server cart
      localStorage.setItem("cart", JSON.stringify(data));
      localStorage.removeItem("cart")

    } catch (error) {
      console.error("Cart sync error:", error);
    }
  };

  syncLocalCartToServer();
}, [authState, dispatch]);


  // const removeFromCart = async (productId, weight) => {
  //   try {
  //     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart/remove`, { productId, weight }, {
  //       headers: {
  //         Authorization: `Bearer ${authState.token}`,
  //       },
  //     });
  //     dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, weight } });
  //   } catch (error) {
  //     console.error('Failed to remove from cart', error);
  //   }
  // };

  const removeFromCart = async (productId, weight) => {
    if (!authState.isAuthenticated) {
      // Handle removal from localStorage for guest users
      let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Filter out the item to be removed
      currentCart = currentCart.filter(
        (item) => !(item.productId === productId && item.weight === weight)
      );
  
      // Update localStorage and context state
      localStorage.setItem("cart", JSON.stringify(currentCart));
      dispatch({ type: "SET_CART", payload: currentCart });
    } else {
      // Handle removal via API for logged-in users
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart/remove`, { productId, weight }, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        dispatch({ type: "REMOVE_FROM_CART", payload: { productId, weight } });
      } catch (error) {
        console.error("Failed to remove from cart", error);
      }
    }
  };
  

  const updateQuantity = async (productId, weight, quantity) => {
    if (!authState.isAuthenticated) {
      // For guest users, update the cart in localStorage
      let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Find the index of the item to be updated
      const itemIndex = currentCart.findIndex(item => item.productId === productId && item.weight === weight);
  
      if (itemIndex !== -1) {
        // Update the item's quantity if found
        currentCart[itemIndex].quantity = quantity;
        // Save the updated cart back to localStorage
        localStorage.setItem("cart", JSON.stringify(currentCart));
        // Update the cart state in context
        dispatch({ type: 'SET_CART', payload: currentCart });
      }
    } 


    else{
      try {
        const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart/update`, { productId, weight, quantity }, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, weight, quantity } });
      } catch (error) {
        console.error('Failed to update cart quantity', error);
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, dispatch, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
