
export default BlogCarousel;
import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import React Slick
import "slick-carousel/slick/slick.css"; // Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Slick Theme CSS
import style from "./BlogCarousel.module.css";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Loader from "../Loader/Loader";

const BlogCarousel = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/blogs/getBlog`);
        if (Array.isArray(response.data)) {
        setBlog(response.data);
        }
        else {
          console.error("blog is not an array", res.data);
          setBlog([])
        }
      } catch (err) {
        setError("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) return <Loader/>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>No blog found.</p>;

  // Slick Carousel Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 blogs at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Hide left and right buttons 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bloglist">
      {/* Blog Carousel Section */}
      <section>
        <div className="container py-5">
          <Slider {...settings}>
            {blog.map((data) => {
              const urltitle = data.title.slice(0, data.title.indexOf("|")).trim();
              const formattedTitle = urltitle.replace(/\s+/g, "-").replace(/[%|]/g, "");

              return (
                <div className="p-1">
                <div key={data._id} className={` ${style.blogcarousel}`}>
                  <Link href={`/blogs/${ data.slug }`} className={style.bloglink}>
                    <div className={style.bloglistitem}>
                      <Image width={500} height={500} src={data.image.replace('/upload/', '/upload/c_scale,w_900/f_webp/q_auto/').replace(/\.(jpg|jpeg|png)$/, '.webp')} alt={data.title}  loading="lazy" />
                      <div className={style.blogdesc}>
                        <h3>{data.title}</h3>
                        <p>{data.desc}</p>
                        <div className={style.writerdetail}>
                          <p>{data.author}</p>
                          <p>{formatDate(data.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>

    </div>
  );
};

export default BlogCarousel;
