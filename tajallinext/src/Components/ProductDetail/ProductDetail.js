"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Card from '@/Components/CardShop/CardShop';
import ReactImageMagnify from "react-image-magnify";
import { useCart } from "@/Context/CartContext";
import './ProductDetail.css';
import axios from "axios";
import { useOrder } from "@/Context/OrderContext";
import Loader from "../Loader/Loader";
import cartGif from '../../../public/assets/Addtocart.gif';


const baseURL = process.env.NEXT_PUBLIC_API_URL;

const ProductDetail = ({ slug }) => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const {setOrderDetails}=useOrder()
  const [selectedWeight, setSelectedWeight] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useCart();
  const [popupType, setPopupType] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${baseURL}/api/product/slug/${slug}`);
        const data = await res.json();
        setProduct(data);
        setSelectedWeight(data.weights?.[0]);
        setSelectedImage(data.images?.[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/404");
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) return;

      try {
        const response = await axios.get(`${baseURL}/api/product/allproduct`, {
          params: {
            category: product.category,
            limit: 5,
            page
          }
        });

        const updatedProducts = new Map(relatedProducts.map(p => [p._id, p]));

        response.data.forEach(p => {
          if (p._id !== product._id && !updatedProducts.has(p._id)) {
            updatedProducts.set(p._id, p);
          }
        });

        setRelatedProducts(Array.from(updatedProducts.values()));
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [product?.category, page]);

  const handleShowMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleWeightChange = (event) => {
    const weight = parseInt(event.target.value, 10);
    if (!isNaN(weight)) {
      setSelectedWeight(weight);
    }
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(parseInt(event.target.value, 10));
  };

  if (!product) return <Loader/>;

  const closePopup = () => setPopupType(null);

  const calculatedPrice = Math.round(product.price * selectedWeight / 1000);
  const cartItemId = `${slug}${selectedWeight}`;

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');

    // if (!token) {
    //   setPopupType('login');
    //   return;
    // }

    const orderDetails = {
      cartId: cartItemId,
      productId: product._id,
      title: product.title,
      image: product.images[0],
      category: product.category,
      weight: selectedWeight,
      price: calculatedPrice,
      totalPrice: calculatedPrice,
      quantity: selectedQuantity,
      slug:product.slug
    };
    
    addToCart(orderDetails);
    setPopupType('success');
    setTimeout(() => setPopupType(null), 2000);
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setPopupType('login');
      return;
    }

    const orderDetails = [{
      cartId: cartItemId,
      productImg: product.images[0],
      productId: product._id,
      title: product.title,
      category: product.category,
      weight: selectedWeight,
      quantity: selectedQuantity,
      totalPrice: calculatedPrice * selectedQuantity,
      price: calculatedPrice * selectedQuantity,
      slug:product.slug
    }];

    setOrderDetails(orderDetails);
    router.push('/OrderConfirmation')
  };

  const goToLogin = () => {
    router.push('/Login');
  };

  return (
    <div className="productdetails_main">
      <div className="product-detail">
        <div className="image-gallery">
          <div className="focused-image">
            <ReactImageMagnify
              {...{
                smallImage: { 
                  alt: product.title, 
                  isFluidWidth: true, 
                  src: selectedImage || "/placeholder.jpg" 
                },
                largeImage: { 
                  src: selectedImage || "/placeholder.jpg", 
                  width: 1200, 
                  height: 1200 
                },
                enlargedImageContainerStyle: { background: "#fff", zIndex: 999 },
                enlargedImagePosition: "over",
              }}
            />
          </div>
          <div className="thumbnails">
            {product.images?.map((image, index) => (
              <Image 
                key={index} 
                src={image} 
                alt={`${product.title} thumbnail ${index + 1}`} 
                width={50} 
                height={50} 
                onClick={() => setSelectedImage(image)} 
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="price my-4"><del className='me-2'>₹{Math.floor(calculatedPrice*(10/8))}/-</del>₹{calculatedPrice}/-</p>
          
          <div className="d-flex gap-3 my-2">
            <div className="weight-selection">
              <p>SIZE</p>
              <select value={selectedWeight} onChange={handleWeightChange}>
                {product.weights.map((weight, index) => (
                  <option key={index} value={weight}>{weight}g</option>
                ))}
              </select>
            </div>
            <div className="quantity-selection">
              <p>Select Quantity:</p>
              <select value={selectedQuantity} onChange={handleQuantityChange}>
                {[...Array(10).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>{num + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="buttons my-4">
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
            <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
          </div>
          <hr />
                    <div className="description">
                        <h2>Description</h2>
                        <ul>
                            {/* {product.aboutProduct.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))} */}
                             {product.aboutProduct.map((line, index) => (
    <div key={index}>
      {line.split('\n').map((part, idx) => (
        <p key={idx}>{part}</p>
      ))}
    </div>
  ))}
                        </ul>
                    </div>
                    <div className='product-INFO'>
                {/* <div className="product-details">
                    <div className='product_info_header'>
                        <h2>Product Information</h2>
                       <p>{product.aboutProduct[0]}</p> 
                    </div>
                   
                </div> */}
               
                    <div className="more-details">
                        <div className='desc'>
                            <h3>Product key Features</h3>

                            <div style={{ whiteSpace: 'pre-line' }}>
  {product.details.netQuantity}
</div>

                        </div>
                        <div className='desc'>
                            <h3>Country of Origin: {product.details.origin}</h3>
                            <p>{product.details.addedPreservatives}</p>
                            <p>FSSAI Approved: {product.details.fssaiApproved}</p>
                        </div>
                        <div className='desc'>
                            <h3>Usage Details</h3>
                            <p>Place Of Storage & Temperature: {product.details.storage}</p>
                            <p>Allergen Warning: {product.details.allergen}</p>
                        </div>
                        <div className='desc'>
                            <h4>Item Dimensions</h4>
                            <p>Length: {product.details.length}</p>
                            <p>width: {product.details.width}</p>
                            <p>Height: {product.details.height}</p>
                           
                        </div>
                    </div>
               
            </div>
        </div>
      </div>

      <div className='related-products'>
        <h2>You May Also Like</h2>
        <div className="product-list">
          {relatedProducts.map(relatedProduct => (
            <Card key={relatedProduct._id} product={relatedProduct} />
          ))}
        </div>
        {relatedProducts.length < total && (
          <button className="show-more" onClick={handleShowMore}>Show More</button>
        )}
      </div>

      {popupType === 'success' && (
        <div className="popup-overlay">
          <div className="popup-content">
            <Image src={cartGif} alt="add to cart" width={400} height={300} priority />
            <p> Item added to cart!</p>
            <button className="popup-close" onClick={closePopup}>×</button>
          </div>
        </div>
      )}

      {popupType === 'login' && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Please login or signup to add products to your cart.</p>
            <button className="popup-button" onClick={goToLogin}>Go to Login</button>
            <button className="popup-close" onClick={closePopup}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;