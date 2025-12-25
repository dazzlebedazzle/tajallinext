// PolicyOfTajalli.js

import React, { useState, useEffect,useContext } from 'react';
import './policyOfTajalli.css'
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth'; 


const PolicyOfTajalli = () => {
  const { authState, logout } =useContext(AuthContext);
  if (authState.authLoading) {
    return <Loader />; // or any other loading indicator
  }
  

  return  authState.isAuthenticated ?  (
   <div>
    <Sidebar/>
     <div className="policy-container ">
      <section id="no-return-refund">
        <h2>No Return and No Refund Policy</h2>
        <p>
          At TAJALLI, we prioritize delivering premium quality dry fruits to our valued customers. It's important to note that we strictly adhere to a policy of no returns and no refunds, except in the case of damaged or spoiled products upon delivery.
        </p>
        <h3>Damaged Products</h3>
        <p>
          If your order arrives damaged or spoiled, we kindly request that you contact our customer support team within 24 hours of receiving your shipment. To expedite the resolution process, please take clear photographs of the damaged or spoiled items and promptly email them to us at <a href="mailto:care@tajalli.co.in">care@tajalli.co.in</a> or call us directly at <a href="tel:+918826069897">+91 8826069897</a>. Please include your order number and a brief description of the issue.
        </p>
        <p>
          Upon receiving your notification and verifying the damage, we will initiate either a refund for the affected items or arrange for a replacement, depending on your preference and product availability. We strive to ensure that you receive the freshest and highest quality products from us.
        </p>
        <h3>Cancellation Policy</h3>
        <p>
          Once an order has been successfully placed, it cannot be cancelled or modified. Our team processes orders promptly to maintain the quality and freshness of our products, which are shipped out efficiently to meet your expectations.
        </p>
        <h3>Contact Us</h3>
        <p>
          For any inquiries regarding our refund and return policy or for assistance with any issues related to your order, please do not hesitate to reach out to our dedicated customer support team. You can contact us via email at <a href="mailto:info@tajalli.co.in">info@tajalli.co.in</a> or by calling <a href="tel:+918826069897">+91 8826069897</a>. We are committed to providing exceptional customer service and ensuring your satisfaction with every purchase.
        </p>
        <p>
          Thank you for choosing Tajalli. We appreciate your trust in our products and look forward to serving you.
        </p>
        <p>
          Tajalli reserves the right to update or revise this policy as necessary without prior notice.
        </p>
      </section>

      <section id="privacy-policy">
        <h2>Privacy Policy for Tajalli Dry Fruits</h2>
        <p>
          Welcome to Tajalli Dry Fruits! We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from us.
        </p>
        <h3>Information We Collect</h3>
        <p>
          When you visit our website, we may collect the following types of information:
        </p>
        <ul>
          <li>Personal Information</li>
          <li>Contact Information: Name, email address, phone number, and shipping address.</li>
          <li>Payment Information: Credit card details or other payment information required to process your orders.</li>
          <li>Non-Personal Information</li>
          <li>Usage Data: Information about your interaction with our website, including IP address, browser type, pages visited, and time spent on the site.</li>
          <li>Cookies: Small data files stored on your device that help us improve your experience.</li>
        </ul>
        <h3>How We Use Your Information</h3>
        <p>
          We use the information we collect for various purposes, including order processing, customer support, marketing communications, and website improvement. We do not sell or rent your personal information to third parties.
        </p>
        <h3>Sharing Your Information</h3>
        <p>
          We may share your information with service providers who assist us in operating our website and conducting our business, as well as when required by law or to protect our rights.
        </p>
        <h3>Data Security</h3>
        <p>
          We take the security of your personal information seriously and implement reasonable security measures to protect it from unauthorized access, alteration, disclosure, or destruction.
        </p>
        <h3>Your Rights</h3>
        <p>
          You have the right to access, correct, and request the deletion of your personal information, subject to certain exceptions.
        </p>
        <h3>Changes to This Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time, and any changes will be posted on this page.
        </p>
        <h3>Contact Us</h3>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <ul>
          <li>Email: <a href="mailto:info@tajalli.co.in">info@tajalli.co.in</a></li>
          <li>Phone: <a href="tel:+918826069897">+91 8826069897</a></li>
          <li>Address: 16-B, Jangpura Road, Bhogal Jangpura, New Delhi 110014</li>
        </ul>
        <p>
          Thank you for choosing Tajalli Dry Fruits. Your privacy is important to us!
        </p>
      </section>

      <section id="terms-and-conditions">
        <h2>Terms and Conditions for Tajalli Dry Fruits</h2>
        <p>
          Welcome to Tajalli Dry Fruits! By using our website and purchasing our products, you agree to the following terms and conditions.
        </p>
        <h3>Acceptance of Terms</h3>
        <p>
          By accessing our website, you confirm that you have read and understood these Terms and Conditions. If you don’t agree with any part of them, we kindly ask you not to use our site.
        </p>
        <h3>Our Products</h3>
        <p>
          At Tajalli Dry Fruits, we offer only the highest quality dry fruits and nuts, carefully selected to ensure your satisfaction.
        </p>
        <h3>Order Processing and Shipping</h3>
        <p>
          <strong>Processing Time:</strong> We aim to process your order within 1-3 business days.<br />
          <strong>Shipping Time:</strong> You can expect your order to be shipped within 7 to 12 days from the date of order confirmation.
        </p>
        <h3>No Return and Refund Policy</h3>
        <p>
          Due to the nature of our products, all sales are final. We do not accept returns or provide refunds once an order is shipped.
        </p>
        <p>
          If your product arrives spoiled or damaged, please contact us within 48 hours of delivery with photographic evidence for assistance.
        </p>
        <h3>Payment</h3>
        <p>
          All payments are due at the time of purchase. We accept various payment methods listed on our website.
        </p>
        <h3>Intellectual Property</h3>
        <p>
          All content on our website—including text, graphics, logos, and images—is owned by Tajalli Dry Fruits and is protected by copyright and trademark laws.
        </p>
        <h3>Limitation of Liability</h3>
        <p>
          Tajalli Dry Fruits is not liable for any indirect, incidental, or consequential damages arising from your use of our products or website.
        </p>
        <h3>Changes to Terms and Conditions</h3>
        <p>
          We may update these Terms and Conditions from time to time, and any changes will be posted on our website.
        </p>
        <h3>Contact Us</h3>
        <p>
          If you have any questions or concerns about these Terms and Conditions, please reach out to us using the contact information provided below:
        </p>
        <ul>
          <li>Email: <a href="mailto:info@tajalli.co.in">info@tajalli.co.in</a></li>
          <li>Phone: <a href="tel:+918826069897">+91 8826069897</a></li>
          <li>Address: 16-B, Jangpura Road, Bhogal Jangpura, New Delhi 110014</li>
        </ul>
        <p>
          Thank you for choosing Tajalli Dry Fruits. We appreciate your support!
        </p>
      </section>
    </div>
   </div>
  ): (
    <Navigate to="/login" />
  );
}

export default PolicyOfTajalli;

