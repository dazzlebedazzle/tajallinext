import React from 'react'
import Image from 'next/image';
import "./About_us.css";
import our_story from "../../../public/assets/our-story.webp";
  
  import top from "../../../public/assets/top.webp";
  import midle from "../../../public/assets/midle.webp";

const page = () => {
  return (
    < div className="aboutus_main pb-5">
    <section className="aboutus-header">

      <h1>
        <strong>About Us</strong>
      </h1>
{/* <Image height={120} width={140} src={rose} alt="about page" /> */}
      
    </section>

    <section className="our-story">
      <div className="ourstory-content">
        <h2>Welcome to TAJALLI Dry Fruits</h2>
        <p>
        At TAJALLI Dry Fruits, we are dedicated to delivering an unparalleled selection of premium dried fruits that embody both luxury and natural goodness. Tajalli Dry Fruit by Dazzle & Bedazzle Private Limited brings you the finest quality, blending tradition with excellence. Sourced from the pristine landscapes of Afghanistan, our products are a testament to the rich traditions and exceptional quality that define this region’s heritage.
        </p>
      </div>

      <div className="ourstory-img">
        <Image height={200} width={500} src={our_story} alt="about page" />
      </div>
    </section>

    <section className="branches_main">
<section className="branches">
  <div>
    <h2>Explore the Beauty and Taste of Afghanistan</h2>
  </div>
  <div className="branches-container">
    <div className="img-back">
      <img src="https://i.insider.com/5a454888ec1ade23e7749b7f?width=600&format=jpeg&auto=webp" alt="about page" />
      <div className="overlay"><h2>Experience Afghanistan's Natural Riches</h2>
      Immerse yourself in the vibrant natural beauty of Afghanistan with our premium dry fruits. Grown in the country's verdant valleys, these fruits embody the unique flavors and rich traditions of Afghan agriculture. Every bite offers a glimpse into the lush landscapes and heritage of this remarkable region.</div>
    </div>
    <div className="img-back">
      <img src="https://i.insider.com/5a454886ec1ade23e7749b76?width=1136&format=jpeg" alt="about page" />
      <div className="overlay"><h2>A Taste of Afghan Tradition</h2>
      Our dry fruits capture the essence of Afghanistan's diverse landscapes and cultural richness. Harvested from ancient orchards and cared for by local farmers, these fruits reflect the dedication and expertise that have been passed down through generations. Enjoy a taste of tradition and the distinctive charm of Afghan-grown produce</div>
    </div>
    <div className="img-back">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwYxh30TG4yw26fxAhpoSrqDu1vcS_1oN9Dg&s" alt="about page" />
      <div className="overlay"><h2>Nature's Bounty from Afghanistan</h2>
      Delight in the exceptional quality of Afghan dry fruits, nurtured by the country's natural bounty. The fertile soils and favorable climate create ideal conditions for cultivating fruits that are both delicious and nutritious. Each piece is a testament to Afghanistan's fertile lands and the timeless beauty of its environment.</div>
    </div>
    <div className="img-back">
      <img src="https://live.staticflickr.com/8167/7518674622_d8f9a1452f_z.jpg" alt="about page" />
      <div className="overlay"><h2>Authentic Afghan Flavor</h2>
      Discover the authentic flavor of Afghanistan with our carefully selected dry fruits. From the sun-drenched highlands to the fertile lowlands, these fruits capture the essence of Afghan terroir. Savor the rich, complex tastes that tell a story of the land's natural beauty and agricultural heritage.</div>
    </div>
    <div className="img-back">
      <img src="https://c4.wallpaperflare.com/wallpaper/847/108/967/mountains-dark-ravine-snow-wallpaper-preview.jpg" alt="about page" />
      <div className="overlay"><h2>Rich Cultural Heritage</h2>
      The country boasts a rich tapestry of cultural heritage with historical sites such as the ancient city of Bamiyan, known for its monumental Buddha statues carved into cliff faces, and the vibrant architectural marvels of cities like Herat and Kabul. This blend of historical and cultural landmarks reflects Afghanistan's deep historical roots and artistic achievements.</div>
    </div>
    <div className="img-back">
      <img src="https://i.pinimg.com/736x/71/6a/ab/716aab2c02a55fd77642720056ae319a.jpg" alt="about page" />
      <div className="overlay"><h2>Stunning Landscapes</h2>
      Afghanistan is renowned for its breathtaking natural scenery, ranging from the rugged, snow-capped peaks of the Hindu Kush mountains to the vast, serene expanses of the deserts. The diverse landscapes include lush valleys, picturesque lakes like Band-e Amir, and ancient rock formations that offer awe-inspiring vistas.</div>
    </div>
  </div>
 
</section>
</section>

    <section className="why-us">
      <h2>Why Choose TAJALLI?</h2>
<section className="block-section">

<div className="quality">
        <Image height={120} width={140} src={top} alt="about page" className="whyus-peragraph_img1" />
        <p className="whyus-peragraph">
        <img src={top} alt="about page" className="whyus-peragraph_img" />
        Our commitment to excellence means that every dried fruit we offer is 100% natural, with no added chemicals or artificial ingredients. Each piece is carefully processed to preserve its inherent flavors, vit``amins, and minerals, ensuring that you enjoy not only the finest taste but also a nutritious boost with every bite.
        </p>
      </div>

      <div className="quality">
        <p className="whyus-peragraph" >
        <Image height={120} width={140} src={midle} alt="about page" className="whyus-peragraph_img" />
        With a network of distinguished stores spanning across India, TAJALLI Dry Fruits is your go-to destination for high-quality dried fruits. Our comprehensive shipping and delivery system ensures that you can enjoy our luxurious products right at your doorstep, no matter where you are located in the country.
        </p>
        <Image height={120} width={140} src={midle} alt="about page" className="whyus-peragraph_img1" />
      </div>

      <div className="quality">
      <Image height={120} width={140} src={top} alt="about page" className="whyus-peragraph_img1" />
        <p className="whyus-peragraph">
        <Image height={120} width={140} src={top} alt="about page" className="whyus-peragraph_img" />
          
In addition to our physical locations, we are proud to make our exceptional range of dried fruits available through leading online platforms such as Amazon, Flipkart, JioMart, and India Mart. This multi-channel approach allows us to reach and serve our customers with convenience and efficiency.
        </p>
      </div>
      <div className="quality">
        <p className="whyus-peragraph" >
        <Image height={120} width={140} src={midle} alt="about page" className="whyus-peragraph_img" />
        As we continue to grow, our mission remains steadfast: to expand our presence, open new stores, and provide more people with access to the finest natural dried fruits. We are driven by a passion for quality and a desire to share the exquisite flavors of our products with a broader audience.
        </p>
        <Image height={120} width={140} src={midle} alt="about page" className="whyus-peragraph_img1" />
      </div>
      </section>
    </section>
    <section className="contact-info">
      <h2>For Further Inquiries</h2>
      <p><strong>Phone:</strong> 8826069897</p>
      <p><strong>Email:</strong> info@tajalli.co.in</p>
      <p>Discover the essence of luxury and natural goodness with TAJALLI Dry Fruits—where every bite is a celebration of quality and taste.</p>
    </section>
   
  </div>
  )
}

export default page