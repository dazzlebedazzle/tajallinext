'use client';
import React from 'react';
import Slider from 'react-slick';
import './Slider1.css';
import imageUrls from '../../../public/assets/Data/ImgUrls';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const NextArrow = ({ onClick }) => (
  <div className="slick-arrow next" onClick={onClick}>›</div>
);

const PrevArrow = ({ onClick }) => (
  <div className="slick-arrow prev" onClick={onClick}>‹</div>
);

const SimpleSlider = () => {
  const router = useRouter();

  const handleCategoryClick = (category) => {
    const slug = category.replace(/\s+/g, '-');
    router.push(`/Shop/${slug}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2, arrows: false } }
    ]
  };

  return (
    <>
     

      <div className="slider-container1">
        <Slider {...settings}>
          {imageUrls.map((item, idx) => (
            <div
              key={item.category}
              className="image-card-wrapper"
              onClick={() => handleCategoryClick(item.category)}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="image-card">
                <div className="image-container">
                  <Image
                    src={item.imageUrl}
                    alt={item.category}
                    width={140}
                    height={140}
                    className="card-image"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default SimpleSlider;
