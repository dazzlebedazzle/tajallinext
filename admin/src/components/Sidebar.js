import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import tazallilogo from '../assets/logotazalli.png'

import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineQuestionCircle,
  AiOutlineSetting,
  AiOutlineLock,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineFileText
} from 'react-icons/ai';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const sidebarRef = useRef(null);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth <= 768) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    // Update active link based on current path
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className='sidebar_main' ref={sidebarRef}>
      <div className="hamburger" onClick={toggleSidebar}>
        <AiOutlineMenu />
      </div>
      <div className={`container ${isSidebarOpen ? 'open' : ''}`}>
        <div className="navigation">
          <div className='clogo'>
            <img src={tazallilogo}/>
          </div>
          <ul>
            <li>
              <Link to="/" onClick={() => setActiveLink('/')}>
                <span className="icon">
                  
                </span>
                {/* <span className="title">TAZALLI</span> */}
              </Link>
            </li>

            <li className={activeLink === '/dashboard' ? 'hovered' : ''}>
              <Link to="/dashboard" onClick={() => setActiveLink('/dashboard')}>
                <span className="icon">
                  <AiOutlineHome />
                </span>
                <span className="title">Dashboard</span>
              </Link>
            </li>

            <li className={activeLink === '/products' ? 'hovered' : ''}>
              <Link to="/products" onClick={() => setActiveLink('/products')}>
                <span className="icon">
                  <AiOutlineUser />
                </span>
                <span className="title">Products</span>
              </Link>
            </li>

            <li className={activeLink === '/order' ? 'hovered' : ''}>
              <Link to="/order" onClick={() => setActiveLink('/order')}>
                <span className="icon">
                  <AiOutlineMessage />
                </span>
                <span className="title">Order</span>
              </Link>
            </li>

            <li className={activeLink === '/categories' ? 'hovered' : ''}>
              <Link to="/categories" onClick={() => setActiveLink('/categories')}>
                <span className="icon">
                  <AiOutlineQuestionCircle />
                </span>
                <span className="title">Categories</span>
              </Link>
            </li>

            <li className={activeLink === '/CreateOffer' ? 'hovered' : ''}>
              <Link to="/CreateOffer" onClick={() => setActiveLink('/settings')}>
                <span className="icon">
                  <AiOutlineSetting />
                </span>
                <span className="title">Create Offer</span>
              </Link>
            </li>

            <li className={activeLink === '/policyOfTajalli' ? 'hovered' : ''}>
              <Link to="/policyOfTajalli" onClick={() => setActiveLink('/password')}>
                <span className="icon">
                  <AiOutlineLock />
                </span>
                <span className="title">Policy</span>
              </Link>
            </li>
            <li className={activeLink === '/signout' ? 'hovered' : ''}>
              <Link to="/CreateBanner" onClick={() => setActiveLink('/CreateBanner')}>
                <span className="icon">
                  <AiOutlineLogout />
                </span>
                <span className="title">Create Banner</span>
              </Link>
            </li>

            <li className={activeLink === '/SendCoupon' ? 'hovered' : ''}>
              <Link to="/SendCoupon" onClick={() => setActiveLink('/SendCoupon')}>
                <span className="icon">
                  <AiOutlineLogout />
                </span>
                <span className="title">Send Coupon</span>
              </Link>
            </li>

            <li className={activeLink === '/blog' ? 'hovered' : ''}>
              <Link to="/blog" onClick={() => setActiveLink('/blog')}>
                <span className="icon">
                  <AiOutlineFileText />
                </span>
                <span className="title">Blog Management</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
