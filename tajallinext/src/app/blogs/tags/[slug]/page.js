import Link from 'next/link';
import style from '@/app/blogs/BlogList.module.css';
import BlogCard from '../../BlogCard';
import { SITE_URL, getBlogsByTag, slugToTag, tagToSlug } from '@/lib/blog';

export const revalidate = 300;

const titleCase = (text) => text.replace(/\b\w/g, (c) => c.toUpperCase());

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tag = slugToTag(slug);
  const blogs = await getBlogsByTag(tag);
  const title = `${titleCase(tag)} – Articles & Tips | Tajalli Blog`;
  const description =
    blogs[0]?.desc || `Read Tajalli blog articles about ${tag}: dry fruit health benefits, nutrition and buying tips.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blogs/tags/${tagToSlug(tag)}` },
    // Empty tag pages add nothing to search results
    robots: blogs.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: { type: 'website', url: `${SITE_URL}/blogs/tags/${tagToSlug(tag)}`, title, description },
  };
}

export default async function BlogTag({ params }) {
  const { slug } = await params;
  const tag = slugToTag(slug);
  const blogs = await getBlogsByTag(tag);

  return (
    <div className="bloglist">
      <section className={style.aboutus_header}>
        <h1>
          <strong>Blog</strong>
        </h1>
      </section>

      <section className="container py-5">
        <nav aria-label="Breadcrumb" className="mb-3">
          <Link href="/">Home</Link> › <Link href="/blogs">Blogs</Link> › {titleCase(tag)}
        </nav>
        <h2>Articles tagged “{titleCase(tag)}”</h2>

        {blogs.length === 0 ? (
          <p className="py-4">
            No articles for this topic yet. <Link href="/blogs">Browse all blogs</Link>.
          </p>
        ) : (
          <div className="row">
            {blogs.map((post, index) => (
              <BlogCard key={post._id} post={post} priority={index < 3} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
