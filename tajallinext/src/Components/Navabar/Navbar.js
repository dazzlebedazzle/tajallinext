'use client';
import './Navbar.css';
import React, { useState, useContext, useEffect, useRef } from 'react';
import logo from '../../../public/assets/logo.webp';
import Link from "next/link"
import Image from 'next/image';
import { useCart } from '@/Context/CartContext';
import { FaSistrix, FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { PiArrowBendRightDownLight } from "react-icons/pi";
import dropdown from '../../../public/assets/dropdown.webp';
import axios from 'axios';
import Cart from '@/app/Cart/page';
// import { useParams } from 'react-router-dom';
import { AuthContext } from '@/Context/AuthContext';
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation"; 




const Navbar = () => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const {cart, addToCart } = useCart();
  // const {title} = useParams;
  const router = useRouter();
  const navbarRef = useRef(null);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  // const navigate = useNavigate();
  const { authState , logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll
  const [isCartOpen, setIsCartOpen] = useState(false);


  useEffect(() => {
    setActiveLink(pathname); // Update active link when the route changes
  }, [pathname]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchUserDetails();
    }
  }, [authState.isAuthenticated]);


  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token'); // or use context if stored there

      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser`, config); // Change the endpoint to match your backend
      setProfileImage(response.data.profileImage || '/default-profile.png');
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

 const handleCategoryClick = (category) => {
  if (!category) return;
  const formattedTitle = category.replace(/\s+/g, "-").replace(/[%|]/g, "");
  sessionStorage.setItem("selectedCategory", category);
  setIsOpen(false); // ✅ Close mobile menu
  router.push(`/Shop/${formattedTitle}`);
};

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
        router.push(`/Shop/All-Products?query=${encodeURIComponent(query)}`);
    }
};

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };


  

  return (
    <nav className="navbar">
      <div className="navbar-container" ref={navbarRef}>
      <Link href="/"  alt='mylogo' id='res_logo'  className='mylogo'>
          <Image src={logo} alt="logo" width={300} height={100} priority className='logo'/>
        </Link>
     <div className='main_navi'>
     <div className={`navbar-toggle ${isOpen ? '' : 'active'}`} onClick={toggleMenu}>
            <span className="navbar-toggle-icon"></span>
            <span className="navbar-toggle-icon"></span>
            <span className="navbar-toggle-icon"></span>
          </div>
      <Link href="/"  className={`mylogo ${isScrolled ? 'hidden' : ''}`}>
          <Image src={logo} alt="My logo"  width={300} height={100}  property='' className={`logo ${isScrolled ? 'hidden' : ''}`}/>
        </Link>
        <div   className={`search45 ${isScrolled ? '' : 'hidden'}`}>
            <div className="search-box">
              <FaSistrix className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
               <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
           
          </div>
        <div className='navi'>
        <div className='iconsmain'>
            {/* <Link href='/Cart'>
              <FaShoppingCart className="cart" />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link> */}
            <FaShoppingCart className="cart" onClick={() => setIsCartOpen(true)}/>
                 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      {isCartOpen && <div className="overlay" onClick={() => setIsCartOpen(false)}></div>}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {authState.isAuthenticated ? (
              <Link href="/Login" aria-label="click to my account" className={`profile-picture2 ${isScrolled ? 'hidden' : ''}`}>
                {profileImage ? (
                <Image src={profileImage} width="600" height="400" loading="lazy" alt="Profile" className="profile-picture" />
              ) : (
                <MdAccountCircle className="account" />
              )}
              </Link>
            ) : (
              <Link href="/Login" className={`profile-picture2 ${isScrolled ? 'hidden' : ''}`}><MdAccountCircle className="account" /></Link>
            )}
          </div>
      </div>
     </div>
      <div   className={`search45 ${isScrolled ? 'hidden' : ''}`}>
            <div className="search-box">
              <FaSistrix className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
               <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
           
          </div>
          <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
  <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
    <li className='close_li'>
      <button id='close' onClick={handleClose}><IoCloseSharp /></button>
    </li>
    <li>
  <Link href="/" className={activeLink === "/" ? "active" : ""} onClick={() => setIsOpen(false)}>
    Home
  </Link>
</li>

    <li className="dropdown">
   <Link
  href="/Shop/All-Products"
  className={activeLink === "/Shop/All-Products" ? "active" : ""}
  onClick={() => setIsOpen(false)}
>
  Shop <PiArrowBendRightDownLight />
</Link>

      <div className="dropdown-content">
        <div className='left'>
          <ul> {/* ✅ Wrap <li> inside <ul> */}
            <li onClick={() => handleCategoryClick('Almonds')}>Almonds</li>
            <li onClick={() => handleCategoryClick('Walnuts')}>Walnuts</li>
            <li onClick={() => handleCategoryClick('Figs')}>Figs</li>
            <li onClick={() => handleCategoryClick('Dates')}>Dates</li>
            <li onClick={() => handleCategoryClick('Berries')}>Berries</li>
          </ul>
        </div>
        <div className='middle'>
          <ul> {/* ✅ Wrap <li> inside <ul> */}
            <li onClick={() => handleCategoryClick('Nuts')}>Nuts</li>
            <li onClick={() => handleCategoryClick('Cashews')}>Cashews</li>
            <li onClick={() => handleCategoryClick('Seeds')}>Seeds</li>
            <li onClick={() => handleCategoryClick('Special Item')}>Special Item</li>
            <li onClick={() => handleCategoryClick('Mixtures')}>Mixtures</li>
          </ul>
        </div>
        <div className='right'>
          <ul> {/* ✅ Wrap <li> inside <ul> */}
            <li onClick={() => handleCategoryClick('Fruits')}>Fruits</li>
            <li onClick={() => handleCategoryClick('Apricots')}>Apricots</li>
            <li onClick={() => handleCategoryClick('Raisins')}>Raisins</li>
            <li onClick={() => handleCategoryClick('Dry Fruits')}>Dry Fruits</li>
            <li onClick={() => handleCategoryClick('All Products')}>All Products</li>
          </ul>
        </div>
        <Image src={dropdown} alt='dropdown' width="600" height="400" loading="lazy" className='dorpdownnav' />
      </div>
    </li>
  <li>
  <Link
    href="/Aboutus"
    className={activeLink === "/Aboutus" ? "active" : ""}
    onClick={() => setIsOpen(false)}
  >
    About Us
  </Link>
</li>
<li>
  <Link
    href="/contact-us"
    className={activeLink === "/contact-us" ? "active" : ""}
    onClick={() => setIsOpen(false)}
  >
    Contact Us
  </Link>
</li>
<li>
  <Link
    href="/My-Order"
    className={activeLink === "/My-Order" ? "active" : ""}
    onClick={() => setIsOpen(false)}
  >
    My Orders
  </Link>
</li>

    <li>
      {isCartOpen && <div className="overlay" onClick={() => setIsCartOpen(false)}></div>}
    </li>
  </ul>
</div>

        <div className='main-div'>
          <div className='search'>
            <div className="search-box">
              <FaSistrix className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
            </div>
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>
          <div className='iconsmain'>
            {/* <Link href='/Cart'>
              <FaShoppingCart className="cart" />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link> */}
                 <FaShoppingCart className="cart" onClick={() => setIsCartOpen(true)}/>
                 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      {isCartOpen && <div className="overlay" onClick={() => setIsCartOpen(false)}></div>}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            
            {authState.isAuthenticated ? (
              <Link href="/Login" aria-label="click to my account">
                {profileImage ? (
                <Image src={profileImage} width="600" height="400" loading="lazy" alt="Profile" className="profile-picture" />
              ) : (
                <MdAccountCircle className="account" />
              )}
              </Link>
            ) : (
              <Link href="/Login"><MdAccountCircle className="account" /></Link>
            )}
          </div>
        </div>
        </div>
        <div className='res_search_ham'>
          <div className='search_res'>
            <div className="search-box_res">
           
              {isSearchOpen && (
                <div className="search-overlay">
                  <div className="search-box-overlay-search-box2">
                    <FaSistrix className="search-icon2" onClick={handleSearch} />
                    <input
                      type="text"
                      className="search-input2"
                      placeholder="Search..."
                      value={query}
                      onChange={handleQueryChange}
                    />
                    <IoCloseSharp className="close-icon2" onClick={toggleSearch} />
                  </div>
                </div>
              )}
            </div>
          </div>
         
        </div>
     
    </nav>
  );
};

export default Navbar;

