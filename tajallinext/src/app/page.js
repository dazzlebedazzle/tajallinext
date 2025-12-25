'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import './page.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SimpleSlider = dynamic(() => import('@/Components/Slider/Slider'));
const Slider1 = dynamic(() => import('@/Components/Slider1/Slider1'));
const Card = dynamic(() => import('@/Components/CardShop/CardShop'));
const Offer = dynamic(() => import('@/Components/Offer/Offer'));
const Branches = dynamic(() => import('@/Components/Branches/Branches'));
const Feature = dynamic(() => import('@/Components/Feature/Feature'));
const Imageslider1 = dynamic(() => import('@/Components/ImageSlider/ImageSlider'));
const Testimonial = dynamic(() => import('@/Components/Testimonial/Testimonial'));
// const BlogCarousel = dynamic(() => import('@/Components/BlogCarousel/BlogCarousel'));
// const Homecontent = dynamic(() => import('@/Components/HomeContent/page'));

export default function Home() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [products, setProducts] = useState([]);
  const [raisin, setRaisin] = useState([]);
  const [berries, setBerries] = useState([]);
  const [almonds, setAlmonds] = useState([]);
  const [bestseller, setBestseller] = useState([]);
  const [items, setItems] = useState([]);

  const [errorBestSeller, setErrorBestSeller] = useState('');
  const [errorRaisin, setErrorRaisin] = useState('');
  const [errorBerries, setErrorBerries] = useState('');
  const [errorAlmonds, setErrorAlmonds] = useState('');
  const [errorItems, setErrorItems] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchAll();
    fetchRaisin();
    fetchBerries();
    fetchItems();
    fetchAlmonds();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/allproduct`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const fetchAll = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/search`, {
        params: { query: 'all' }
      });
      setBestseller(response.data.products || []);
      setErrorBestSeller(response.data.products.length > 0 ? '' : 'No products found');
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      setErrorBestSeller('Error fetching best sellers');
    }
  };

  const fetchRaisin = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/search`, {
        params: { query: 'Raisin' }
      });
      setRaisin(response.data.products || []);
      setErrorRaisin(response.data.products.length > 0 ? '' : 'No raisins found');
    } catch (error) {
      console.error('Error fetching raisins:', error);
      setErrorRaisin('Error fetching raisins');
    }
  };

  const fetchBerries = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/search`, {
        params: { query: 'Berries' }
      });
      setBerries(response.data.products || []);
      setErrorBerries(response.data.products.length > 0 ? '' : 'No berries found');
    } catch (error) {
      console.error('Error fetching berries:', error);
      setErrorBerries('Error fetching berries');
    }
  };

  const fetchAlmonds = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/search`, {
        params: { query: 'Almonds' }
      });
      setAlmonds(response.data.products || []);
      setErrorAlmonds(response.data.products.length > 0 ? '' : 'No almonds found');
    } catch (error) {
      console.error('Error fetching almonds:', error);
      setErrorAlmonds('Error fetching almonds');
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/search`, {
        params: { query: 'Special Item' }
      });
      setItems(response.data.products || []);
      setErrorItems(response.data.products.length > 0 ? '' : 'No items found');
    } catch (error) {
      console.error('Error fetching items:', error);
      setErrorItems('Error fetching items');
    }
  };

  const handleCategoryClick2 = (category) => {
    router.push(`/Shop/${category}`);
  };

  const limitedall = bestseller.slice(0, 5);
  const limitedRaisin = raisin.slice(0, 5);
  const limitedAlmonds = almonds.slice(0, 5);
  const limitedBerries = berries.slice(0, 5);
  const limitedItems = items.slice(0, 5);

  return (
    <div className="home">
      <section className="first">
        <SimpleSlider />

        <section className="nth">
          <div className="top">
            <h2 className="tittle">Categories <hr /></h2>
          </div>
          <Slider1 />
        </section>

        <section className="second">
          <div className="top">
            <h3 className="tittle">Best Seller <hr /></h3>
            <button onClick={() => handleCategoryClick2("All-Products")}>View all</button>
          </div>
          <div className="delicacies">
            {errorBestSeller ? <p>{errorBestSeller}</p> :
              limitedall.map(product => <Card key={product._id} product={product} />)}
          </div>
        </section>

        <section className="second2">
          <div className="top">
            <h2 className="tittle">Best in Almonds <hr /></h2>
            <button onClick={() => handleCategoryClick2("Almonds")}>View all</button>
          </div>
          <div className="delicacies">
            {errorAlmonds ? <p>{errorAlmonds}</p> :
              limitedAlmonds.map(product => <Card key={product._id} product={product} />)}
          </div>
        </section>

        <section className="third">
          <div className="top">
            <h2 className="tittle">Exciting Offers<hr /></h2>
            <button onClick={() => handleCategoryClick2("All-Products")}>View all</button>
          </div>
          <div className="offer_home">
            <Offer />
          </div>
        </section>

        <section className="second3">
          <div className="top">
            <h2 className="tittle">Best in Raisins <hr /></h2>
            <button onClick={() => handleCategoryClick2("Raisins")}>View all</button>
          </div>
          <div className="delicacies">
            {errorRaisin ? <p>{errorRaisin}</p> :
              limitedRaisin.map(product => <Card key={product._id} product={product} />)}
          </div>
        </section>

        <section className="second4">
          <div className="top">
            <h2 className="tittle">Best in Berries <hr /></h2>
            <button onClick={() => handleCategoryClick2("Berries")}>View all</button>
          </div>
          <div className="delicacies">
            {errorBerries ? <p>{errorBerries}</p> :
              limitedBerries.map(product => <Card key={product._id} product={product} />)}
          </div>
        </section>

        <section className="second5">
          <div className="top">
            <h2 className="tittle">Special Items <hr /></h2>
            <button><Link href="/Shop/Special-Item">View all</Link></button>
          </div>
          <div className="delicacies">
            {errorItems ? <p>{errorItems}</p> :
              limitedItems.map(product => <Card key={product._id} product={product} />)}
          </div>
        </section>

        <section className="Availableon py-5">
          <Branches />
        </section>

        <Feature />
        <Imageslider1 />

        <section className="fourth">
          <Testimonial />
        </section>

        {/*
        <section>
          <div className="top">
            <h2 className="tittle">Blogs <hr /></h2>
            <button onClick={() => router.push("/blogs")}>View all</button>
          </div>
          <BlogCarousel />
        </section>

        <Homecontent />
        */}
      </section>
    </div>
  );
}
