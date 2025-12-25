import Link from "next/link";
import axios from "axios";
import style from "@/app/blogs/BlogList.module.css";
import Image from "next/image";

// Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
    const { slug: tag } = params;

    if (!tag) {
        return {
            title: "Blogs | Tajalli",
            description: "Explore our latest blogs on Tajalli.",
        };
    }

    const formattedTag = tag.replace(/-/g, " ").replace(/%20/g, " ");
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const res = await fetch(`${baseURL}/api/blogs/getBlogTag/${formattedTag}`);
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const blogs = await res.json();
        const firstBlog = blogs.length > 0 ? blogs[0] : null;

        return {
            title: `Tag: ${formattedTag} | Tajalli Blogs`,
            description: firstBlog ? firstBlog.desc : "Explore our insightful blogs on Tajalli.",
            alternates: {
                canonical: `https://www.tajalli.co.in/blogs/tags/${tag}`,
            },
        };
    } catch (error) {
        console.error("Metadata fetch error:", error);
        return {
            title: "Blogs | Tajalli",
            description: "Explore our latest blogs on Tajalli.",
        };
    }
}

// Fetch blogs based on the tag
async function fetchBlogsByTag(tag) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const formattedTag = tag.replace(/-/g, " ").replace(/%20/g, " ");

    try {
        const res = await fetch(`${baseURL}/api/blogs/getBlogTag/${formattedTag}`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch blog details:", error);
        return null;
    }
}

// BlogTag Component
export default async function BlogTag({ params }) {
    const { slug: tag } = params;
    const blogs = await fetchBlogsByTag(tag);

    if (!blogs || blogs.length === 0) {
        return <p>No blogs found for this tag.</p>;
    }

    const spaceTag = tag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <div className="bloglist">
            <section className={style.aboutus_header}>
                <h1>
                    <strong>Blog</strong>
                </h1>
            </section>

            <section>
                <div className="container py-5">
                    <div className="row">
                        <h1>Tag: {spaceTag}</h1>
                        {blogs.map((data) => (
                            <div className="col-lg-4 col-md-6 mt-md-4" key={data._id}>
                                <Link href={`/blogs/${data.slug}`} className={style.bloglink}>
                                    <div className={style.bloglistitem}>
                                        <Image width={500} height={500} src={data.image} alt={data.title} />
                                        <div className={style.blogdesc}>
                                            <h3>{data.title}</h3>
                                            <p>{data.desc}</p>
                                            <div className={style.writerdetail}>
                                                <p>{data.author}</p>
                                                <p>{new Date(data.createdAt).toLocaleDateString("en-GB")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
