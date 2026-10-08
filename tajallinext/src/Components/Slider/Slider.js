"use client";

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import './Slider.css';

const bannerSlides = [
  {
    src: '/assets/tj1.jpeg',
    alt: 'Tajalli festive season nutritious deals gift combo banner',
  },
  {
    src: '/assets/tj2.jpeg',
    alt: 'Tajalli festive season dry fruits deal banner',
  },
  {
    src: '/assets/tj3.jpeg',
    alt: 'Tajalli festive season nutritious deals banner',
  },
  {
    src: '/assets/tj4.jpeg',
    alt: 'Tajalli festive premium gift combos banner',
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





// "use client";

// import React from 'react';
// import Slider from 'react-slick';
// import { useRouter } from "next/navigation";  // ✅ Use next/navigation
// import Image from 'next/image';
// import './Slider.css'

// const SimpleSlider = () => {
//   const router = useRouter();

//   const handleShopNowClick = () => {
//     router.push("/Shop");
//   };

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     autoplay: true,  
//     autoplaySpeed: 3000
//   };

//   return (
//     <div className="slider-container">
//       <Slider {...settings}>
//         <div className="btn2">
//           <Image src="https://res.cloudinary.com/dqa6jk5fx/image/upload/c_scale,w_2200/f_auto/q_60/v1722759470/nltkiyr5lnr3uoldrpef.webp" 
//             loading="eager" width={1600}  height={580} alt="Slide 1" layout='intrinsic'    />
//         </div>
//         <div className="btn2">
//           <Image src="https://res.cloudinary.com/dqa6jk5fx/image/upload/c_scale,w_2200/f_auto/q_60/v1722759786/aivsoiekpkunr1jjvlww.webp" 
//             loading="lazy" width={1600} height={580} alt="Slide 2" layout='intrinsic'    />
//         </div>
//         <div className="btn2">
//           <Image src="https://res.cloudinary.com/dqa6jk5fx/image/upload/c_scale,w_2200/f_auto/q_60/v1722759842/tzftgw3y9ly0k08c4nlo.webp" 
//             loading="lazy" width={1600} height={580} alt="Slide 3" layout='intrinsic'    />
//         </div>
//         <div className="btn2">
//           <Image src="https://res.cloudinary.com/dqa6jk5fx/image/upload/c_scale,w_2200/f_auto/q_60/v1722759885/ncuxy7cxzqu97gwi3gz6.webp" 
//             loading="lazy" width={1600} height={580} alt="Slide 4" layout='intrinsic'    />
//         </div>
//       </Slider>
//     </div>
//   );
// };

// export default SimpleSlider;
