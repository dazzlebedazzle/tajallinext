"use client";

import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '@/Context/AuthContext';
import { useCart } from '@/Context/CartContext';
import axios from 'axios';
import ConfirmationModal from '@/Components/ConfirmationModal/ConfirmationModal';
import Head from 'next/head';
import './Login.css'; // Regular CSS import
import Image from 'next/image';
import pointimg from '../../../public/assets/tajallicoin.gif'

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { authState, login, logout, verifOtp } = useContext(AuthContext);
  const { clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageOptionsVisible, setIsImageOptionsVisible] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(true);
  const [mobileError, setMobileError] = useState('');
  const [userDetails, setUserDetails] = useState({
    firstname: '',
    lastname: '',
    address: '',
    email: '',
    profileImage: '',
    referralCode:'',
    referredBy:'',
    discount:''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      await fetchUserDetails();
      if (authState.isAuthenticated) {
        router.push('/'); // Redirect to homepage or another page after successful login
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsModalOpen(true); // Show the confirmation modal
  };

  const confirmLogout = () => {
    logout();
    clearCart(); // Clear cart after logout
    setIsModalOpen(false); // Close the modal
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token'); // or use context if stored there

      if (!token) {
        logout();
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser`, config);
      setUserDetails(response.data);
    } catch (err) {
      console.error('Error fetching user details:', err);
      confirmLogout()
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // or use context if stored there

      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      const formData = new FormData();
      formData.append('firstname', userDetails.firstname);
      formData.append('lastname', userDetails.lastname);
      formData.append('address', userDetails.address);
      if (userDetails.profileImage instanceof File) {
        formData.append('profileImage', userDetails.profileImage);
      }
      const updatedUserDetails = {
        ...userDetails,
        profileImage: userDetails.profileImage instanceof File ? URL.createObjectURL(userDetails.profileImage) : userDetails.profileImage,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const config2 = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/edit-user`, updatedUserDetails, config);
      if (userDetails.profileImage instanceof File) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/edit-user-pro`, formData, config2);
      }

      await fetchUserDetails(); // Fetch the updated details
      alert('User details updated successfully.');
    } catch (err) {
      console.error('Error updating user details:', err);
      alert('Failed to update user details.');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setUserDetails({ ...userDetails, profileImage: e.target.files[0] });
    }
  };

  const validateMobile = (number) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const handleSendOtp = async () => {
    if (!validateMobile(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setMobileError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/sendOTP`, { mobile });
      setOtpSent(true);
    } catch (err) {
      setError('User Not Registerd');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault(); // Prevent form submission if used with a form
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    try {
      const response = await verifOtp({ mobile, otp });
      if (response && response.success) {
        router.push('/');
      } else {
        setError(response?.error || 'Incorrect OTP . Try Again');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong');

    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchUserDetails();
    }
  }, [authState.isAuthenticated]);

  if (authState.isAuthenticated) {
    return (
      <div className="logged-in_main py-5">
        <Head>
          <link rel="canonical" href="https://www.tajalli.co.in/Login" />
        </Head>
        
        <div className="logged-in-container">
        <div className='tajlli-point' onClick={()=>{router.push("/Rewards")}}> <Image height={50} width={50} src={pointimg} alt=" tajalli points" /> <p className='text-light'>Get 100</p></div>
          <h2>Welcome, {userDetails.firstname}</h2>
          <p>Email: {userDetails.email}</p>
          <div className="profile-image-container">
            {userDetails.profileImage && typeof userDetails.profileImage === 'string' ? (
              <Image width={500} height={500} src={userDetails.profileImage} alt="Profile" className="profile-image" />
            ) : (
              userDetails.profileImage && <Image width={500} height={500} src={URL.createObjectURL(userDetails.profileImage)} alt="Profile" className="profile-image" />
            )}
            <div className="image-options">
              <div className="half" onClick={() => window.open(userDetails.profileImage, '_blank')}>Show Image</div>
              <div className="half">
                <label htmlFor="profileImageUpload" className="update-image-button">Update Image</label>
                <input
                  type="file"
                  id="profileImageUpload"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <button onClick={handleLogout}>Logout</button>
          <h3>Update Your Details</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                value={userDetails.firstname}
                onChange={(e) => setUserDetails({ ...userDetails, firstname: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                value={userDetails.lastname}
                onChange={(e) => setUserDetails({ ...userDetails, lastname: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={userDetails.address}
                onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                required
              />
            </div>
            <button type="submit">Update Details</button>
          </form>
        </div>
        
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmLogout}
          message="Are you sure you want to Logout ?"
        />
      </div>
    );
  }

  return (
    <div className="login-main  py-5">
    
      <div className="login-container">
        <h2>LOGIN</h2>
        {isOtpLogin ? (
          <div>
            <p>Login with Mobile OTP</p>
            {error && <p className="error text-danger">{typeof error === 'string' ? error : error.message || 'Something went wrong'}</p>}

            <form>
              <div className="form-group">
                <input
                  type='tel'
                  placeholder='Mobile Number'
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
                {mobileError && <p className="error">{mobileError}</p>}
              </div>
              {otpSent && (
                <div className="form-group">
                  <input
                    type='text'
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}
              {!otpSent ? (
                <button type='button' onClick={handleSendOtp}>Send OTP</button>
              ) : (
                <button type='submit' onClick={handleOtpVerification}>Verify OTP</button>
              )}
            </form>
          </div>
        ) : (
          <div>
            <p>Login with Email & Password</p>
        {error && <p className="error text-danger">{error}</p>}
            <form onSubmit={handlePasswordLogin}>
              <div className="form-group">
                <input
                  type='email'
                  placeholder='E-mail'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>
              <div className="links">
                <Link href='/forgotpassword'>Forgot Password?</Link>
              </div>
              <button type='submit'>Login</button>
            </form>
          </div>
        )}

        <div className="links">
          <button onClick={() => setIsOtpLogin(!isOtpLogin)}>
            {isOtpLogin ? 'Login with Email & Password' : 'Login with Mobile OTP'}
          </button>
        </div>
        <div className="links">
          <Link href='/register'><span>Don’t have an account? </span>Sign Up</Link>
        </div>
      </div>
    
    </div>
  );
};

export default Login;