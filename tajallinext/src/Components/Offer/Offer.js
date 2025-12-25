'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import Card1 from '../CardN/CardN';
import "./Offer.css";

// ✅ Custom arrow components
const PrevArrow = ({ className, onClick }) => (
  <div className={className} onClick={onClick} style={{ zIndex: 2 }}>
    <span style={{ fontSize: "24px", color: "black" }}>←</span>
  </div>
);

const NextArrow = ({ className, onClick }) => (
  <div className={className} onClick={onClick} style={{ zIndex: 2 }}>
    <span style={{ fontSize: "24px", color: "black" }}>→</span>
  </div>
);

function Offer() {
  const [offers, setOffers] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${apiUrl}/api/offer/`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOffers(res.data);
        } else {
          console.error("Offers is not an array", res.data);
          setOffers([]);
        }
      })
      .catch((err) => console.error("Error fetching offers:", err));
  }, []);

  const settings = {
    infinite: true,
    lazyLoad: true,
    arrows: true,
    dots: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 2,
          centerPadding: "0",
          centerMode: false,
          beforeChange: (current, next) => setImageIndex(next - 1),
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          centerMode: false,
          beforeChange: (current, next) => setImageIndex(next - 1),
          centerPadding: "0px",
          dots: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: true,
          centerPadding: "0px",
          dots: true,
        }
      }
    ]
  };

  const getMiddleIndex = () => {
    const middle = Math.floor(settings.slidesToShow / 2);
    return (((imageIndex + middle) % offers.length));
  };

  const middleIndex = getMiddleIndex();
  const defaultProductId = 'default-id';

  if (!isClient || offers.length === 0) return null;

  return (
    <div className="contain">
      <div className="Wpp">
        <Slider {...settings}>
          {offers.map((offer, idx) =>
            offer?.image ? (
              <div
                key={idx}
                className={idx === middleIndex ? "slide activeSlide" : "slide"}
              >
                <Card1
                  img={offer.image
                    .replace('/upload/', '/upload/c_scale,w_400/f_webp/q_auto/')
                    .replace(/\.(jpg|jpeg|png)$/, '.webp')}
                  discountPercent={offer.discountPercentage}
                  productId={offer.productId?.slug || defaultProductId}
                  loading="lazy"
                />
              </div>
            ) : null
          )}
        </Slider>
      </div>
    </div>
  );
}

export default Offer;

