"use client";

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import './Slider.css';

const bannerSlides = [
  {
    src: '/assets/tj01.jpeg',
    alt: 'Tajalli festive season nutritious deals gift combo banners',
  },
  {
    src: '/assets/tj02.jpeg',
    alt: 'Tajalli festive season dry fruits deal banners',
  },
  {
    src: '/assets/tj03.jpeg',
    alt: 'Tajalli festive season nutritious deals banners',
  },

];

const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {bannerSlides.map((slide, index) => (
          <div className="btn2" key={slide.src}>
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1600}
              height={580}
              priority={index === 0}
              loading={index === 0 ? undefined : 'lazy'}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SimpleSlider;


