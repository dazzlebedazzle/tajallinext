"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Register.css';

const Registration = () => {
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");
      if (refCode) {
        setFormData((prev) => ({ ...prev, ref: refCode }));
      }
    }
  }, []);

  const router = useRouter();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: '',
    mob: '',
    otp: '',
    ref:''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  

  useEffect(() => {
  const fetchCountries = async () => {
    try {
      const response = await fetch('/countryCodes.json');
      const result = await response.json();

      if (!Array.isArray(result.countries)) {
        console.error("Invalid country data format");
        return;
      }

      const countryList = result.countries.map((c) => ({
        name: c.name,
        callingCode: c.code,
      }));

      countryList.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(countryList);
    } catch (error) {
      console.error('Error fetching local country data:', error);
    }
  };

  fetchCountries();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  const handleSendOtp = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/sendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: formData.mob }),
      });

      if (response.ok) {
        setOtpSent(true);
        setOtpError('');
      } else {
        const error = await response.json();
        setOtpError(error.error);
        alert(error.error);
      }
    } catch (error) {
      setOtpError('Failed to send OTP. Please try again.');
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/verifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: formData.mob, otp: formData.otp }),
      });

      if (response.ok) {
        setOtpVerified(true);
        setOtpError('');
      } else {
        const error = await response.json();
        setOtpError(error.error);
        alert(error.error);
      }
    } catch (error) {
      setOtpError('Failed to verify OTP. Please try again.');
      alert('Failed to verify OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match.');
      alert('Passwords do not match.');
      return;
    }

    const dataToSend = {
      firstname: formData.fname,
      lastname: formData.lname,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      mobile: selectedCountryCode + formData.mob,
      referralCode:formData.ref
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registration successful:', result);
        router.push('/RegistrationSuccess');
      } else {
        const error = await response.json();
        console.log('Registration failed:', error);
        setSubmitError(error.message);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitError('Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/google-callback&response_type=code&scope=email%20profile&access_type=offline`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className='register_main'>
      <div className="registration-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
        {submitError && <p className="error text-center text-danger h5">{submitError}</p>}
          <div className="form-group">
            <label htmlFor="username"></label>
            <div className='register_name'>
              <input
                type="text"
                id="fname"
                name="fname"
                placeholder='First Name'
                value={formData.fname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                id="lname"
                name="lname"
                placeholder='Last Name'
                value={formData.lname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="countryCode">Country Code</label>
           <select
  id="countryCode"
  name="countryCode"
  value={selectedCountryCode}
  onChange={handleCountryCodeChange}
  required
>
  <option value="" disabled>Select Country Code</option>
  {countries.map((country, index) => (
    <option key={index} value={country.callingCode}>
      {country.name} ({country.callingCode})
    </option>
  ))}
</select>

          </div>
          <div className="form-group">
            <label htmlFor="Mobile no."></label>
            <input
              type="tel"
              id="mob"
              name="mob"
              placeholder='Mobile NO.'
              value={formData.mob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='E-Mail'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password"></label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword"></label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Refral Code">Refral Code:</label>
            <input
              type="text"
              name="ref"
              placeholder='Refral Code'
              value={formData.ref}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <div className="links">
          <Link href="/Login"><span> have an account? </span>Log In</Link>
        </div>
        <button onClick={handleGoogleLogin} className="google-signin-button">Sign in with Google</button>
      </div>
    </div>
  );
};

export default Registration;