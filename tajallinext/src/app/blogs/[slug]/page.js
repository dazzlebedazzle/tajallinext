import React from "react";
import axios from "axios";
import style from './BlogDetails.module.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export const dynamic = "force-dynamic"; // ✅ Add this at the top

// Fetch a single blog based on slug
async function fetchBlog(slug) {
    const baseURL = "https://api.tajalli.co.in";
    try {
        const response = await axios.get(`${baseURL}/api/blogs/getBlogSlug/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching blog data:", error);
        return null;
    }
}

// Dynamic Metadata
export async function generateMetadata({ params }) {
    const blog = await fetchBlog(params.slug);
    console.log(params)

    if (!blog) {
        return {
            title: "Blog Not Found | Tajalli",
            description: "The requested blog could not be found. Explore our other insightful blogs.",
        };
    }

    return {
        title: `${blog.title} | Tajalli Blog`,
        description: blog.desc,
        openGraph: {
            title: blog.title,
            description: blog.desc,
            images: [{ url: blog.image }],
            url: `https://www.tajalli.co.in/blogs/${params.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.desc,
            image: blog.image,
        }
    };
}

// Blog Detail Page
const BlogPage = async ({ params }) => {
    const blog = await fetchBlog(params.slug);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };


    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.tajalli.com/blogs/${blog.slug}`
        },
        "headline": blog.title,
        "description": blog.desc,
        "image": blog.image,
        "author": {
          "@type": "Organization",
          "name": "TAJALLI"
        },
        "publisher": {
          "@type": "Organization",
          "name": "TAJALLI",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.tajalli.co.in/logo.png" // Replace with your actual logo
          }
        },
        "datePublished": formatDate(blog.createdAt)
      };

    if (!blog) {
        return (
            <section className="container py-5">
                <div className="border rounded p-4 my-3 text-center">
                    <h1>Blog Not Found</h1>
                    <p>The requested blog could not be found. Please try again later.</p>
                    <Link href="/" className="btn btn-primary mt-3">
                        Back to Home
                    </Link>
                </div>
            </section>
        );
    }

    return (
            <>
            <section>
            <div className={`container ${style.blog_container}`}>
            <div className={`${style.blog_box} py-5`}>
            <h1>{blog.title}</h1>
            <div className={style.imagebox}>
            <Image width={1080} height={1080} src={blog?.image} alt={blog.title}  className={`my-5 ${style.image}`}/>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content.replace(/\\n/g, '\n')}
            </ReactMarkdown>
                <hr />
            <div className="mt-4">
                <span>Tags:</span>
            {blog.tags.map((data, index) => {
                // const urltitle = data.slice(0, data.title.indexOf("|")).trim();
                const formattedTitle = data.replace(/\s+/g, '-').replace(/[%|]/g, '');   
                return(
                <Link  key={index} href={`/blogs/tags/${formattedTitle}`} className="btn btn-outline-secondary m-2">{data}</Link>
                )
                })}
            </div>
            </div>
            </div>
            </section>
            <Script
                id="json-ld-blog-post"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            </>
    );
};

export default BlogPage;
