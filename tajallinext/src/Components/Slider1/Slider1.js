'use client';
import React from 'react';
import Slider from 'react-slick';
import './Slider1.css';
import imageUrls from '../../../public/assets/Data/ImgUrls';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Custom Arrows
const NextArrow = ({ onClick }) => (
  <div className="slick-arrow next" onClick={onClick}>›</div>
);

const PrevArrow = ({ onClick }) => (
  <div className="slick-arrow prev" onClick={onClick}>‹</div>
);

const SimpleSlider = () => {
  const router = useRouter();

  const handleCategoryClick = (category) => {
    router.push(`/Shop/${category}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="slider-container1">
      <Slider {...settings} className="custom-slick-track">
        {imageUrls.map((image) => (
          <Image
            key={image.category}
            src={image.imageUrl}
            alt="slide"
            width={200}
            height={200}
            priority
            className="category-item"
            onClick={() => handleCategoryClick(image.category)}
          />
        ))}
      </Slider>
    </div>
  );
};

export default SimpleSlider;
