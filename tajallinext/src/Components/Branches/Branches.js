"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axios from "axios";
import { Pagination, Navigation } from "swiper/modules";
import { FaArrowRight } from "react-icons/fa";
import './Branches.css'
import defaltimg from '../../../public/assets/logo.webp'

const SwiperSlider = () => {
  const [offers, setOffers] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/offer1`);
        if (Array.isArray(response.data)) {
        setOffers(response.data);
        }
        else {
          console.error("Offers is not an array", response.data);
          setOffers([]);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="swiper-container3">
      <Swiper
         pagination={{ clickable: true }}
         navigation={false}  // Disabled navigation arrows
         spaceBetween={50}
         slidesPerView={1}
         loop={true}
      >
          {offers.map((slide, index) => {
  if (!slide.productId || !slide.productId.title) return null;

  const filterurl = slide.productId.title
    .slice(0, slide.productId.title.indexOf("|"))
    .trim()
    .replace(/\s+/g, "-");
          return (
            <SwiperSlide key={slide.id}>
              <div className="swipe" style={{ padding: "20px", textAlign: "center" }}>
              <Image
                src={slide.image && slide.image.startsWith("http") 
                    ? slide.image.replace("/upload/", "/upload/c_scale,w_900/f_webp/q_auto/")
                    .replace(/\.(jpg|jpeg|png)$/, ".webp")
                    : "/assets/branches.webp"}  // Fallback image in public folder
                alt={`Slide ${slide.id}`}
                width={900}
                height={500}
                style={{ width: "100%", height: "auto" }}
                priority
                />
                <button>
                  <Link href={`/product/${slide.productId.slug}`} style={{ textDecoration: "none", border: "none", color: "black" }}>
                    Learn more
                  </Link>
                  <FaArrowRight className="arr" />
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SwiperSlider;
