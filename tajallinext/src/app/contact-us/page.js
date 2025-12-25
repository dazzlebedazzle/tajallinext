"use client"; // ✅ Ensures this is a client-side component

import React, { useState } from "react";
import dynamic from "next/dynamic"; // ✅ Lazy load Lottie
import left from "../../../public/assets/left.webp";
import right from "../../../public/assets/right.webp";
import animationData from "../../../public/assets/Data/contact_ani.json";
import loaderAnimation from "../../../public/assets/Data/loader.json";
import './Contactus.css'
import Image from "next/image";

// ✅ Lazy-load Lottie to avoid "document is not defined" error
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const Page = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "14c0d073-75fc-4513-a39e-e5460d1601ce");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully!");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setResult("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loaderOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="contact_us_main">
      <div className="contact_us">
        <section className="main1">
          <Image src={left} alt="Left Decoration" />
          <h1>Contact Us</h1>
          <Image src={right} alt="Right Decoration" />
        </section>

        <p className="here"><b>We would love to hear from you</b></p>
        <hr />

        <section className="contact-container">
          <div className="header-contact">
            <Lottie options={defaultOptions} height={"100%"} width={"100%"} />
          </div>
          <div className="contact-content">
            {loading ? (
              <div className="loading-container">
                <Lottie options={loaderOptions} height={"100%"} width={"100%"} />
                <p>{result}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit}>
                <div className="input-group">
                  <input type="text" name="fname" placeholder="First name" required />
                  <input type="text" name="lname" placeholder="Last name" required />
                </div>
                <div className="input-group">
                  <input type="tel" name="mobile" placeholder="Phone" required />
                  <input type="email" name="email" placeholder="E-mail" required />
                </div>
                <input type="text" name="subject" placeholder="Subject" required />
                <textarea name="message" placeholder="Your message here" required></textarea>
                <button type="submit">SUBMIT</button>
              </form>
            )}
            {!loading && result && <p className="result-message">{result}</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
