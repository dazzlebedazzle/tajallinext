import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import './Testimonial.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import aamir from '../../../public/assets/testimonial_img/aamir.webp'
import amit from '../../../public/assets/testimonial_img/amit.webp'
import dheeraj_lalit from '../../../public/assets/testimonial_img/dheeraj_lalit.webp'
import himmat from '../../../public/assets/testimonial_img/himmat.webp'
import kiran from '../../../public/assets/testimonial_img/kiran.webp'
import lalit from '../../../public/assets/testimonial_img/lalit.webp'
import mewara from '../../../public/assets/testimonial_img/mewara.webp'
import monika from '../../../public/assets/testimonial_img/monika.webp'
import stars from '../../../public/assets/stars.webp';

const SwiperSlider = () => {
  const swiperRef = useRef(null);

  const slides = [
    {
      id: 1,
      name: "Rajesh Gupta",
      imageUrl: mewara,
      comment: "I ordered almonds and walnuts for my family, and they arrived super fast! The packaging was really nice and secure. Definitely gonna order again!"
    },
    {
      id: 2,
      name: "Sunita Patel",
      imageUrl: kiran,
      comment: "The cashews I ordered were so fresh, I couldn't resist eating them all in one go! Great service, will recommend to my friends for sure."
    },
    {
      id: 3,
      name: "Amit Kumar",
      imageUrl: amit,
      comment: "Got my order of pistachios and raisins. Initially, there was some confusion with the delivery date, but the customer support team sorted it out quickly."
    },
    {
      id: 4,
      name: "Priya Sharma",
      imageUrl: monika,
      comment: "I loved the variety of products available on the website. My order of dates and apricots was delivered on time.The recipient loved them!"
    },
    {
      id: 5,
      name: "Sanjay Singh",
      imageUrl: himmat,
      comment: "The website was easy to navigate, and I found exactly what I was looking for - quality almonds and figs. The checkout process was smooth,"
    },
    {
      id: 6,
      name: "Dheeraj Mourya",
      imageUrl: dheeraj_lalit,
      comment: "The dried fruits were delicious! However, there was a small delay in delivery, probably due to the festive season rush. Nonetheless, I'm happy with my purchase."
    },
    {
      id: 7,
      name: "Vikram Reddy",
      imageUrl: lalit,
      comment: "Ordered some mixed dry fruits for gifting purposes.  I had a bit of trouble applying the discount code, but customer service helped me out quickly."
    },
    {
      id: 8,
      name: "Aamir Suhail",
      imageUrl: aamir,
      comment: "The quality of the products was excellent, especially the figs and cashews. It took a little longer than expected for the order to arrive, but it was worth the wait."
    }
  ];

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.slideNext();
      }
    }, 2000); // 1 second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='container1'>
      <div className='container2'>
        <h2>What our Clients say about us</h2>
        <hr />
      </div>
      <div className="swiper-container">
   <Swiper
  ref={swiperRef}
  modules={[Navigation]}
  navigation
  loop={true}
  spaceBetween={30}
  breakpoints={{
    320: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1080: { slidesPerView: 3 }
  }}
  className="mySwiper"
>

          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className='testimonial'>
               <Image src={slide.imageUrl} alt={slide.name} className="profile-img" />

                <h2>{slide.name}</h2>
                <p>{slide.comment}</p>
                <Image className='rating' src={stars} alt="Rating" />

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperSlider;
