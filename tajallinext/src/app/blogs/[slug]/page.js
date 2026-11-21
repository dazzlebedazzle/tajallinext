import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import style from './BlogDetails.module.css';
import BlogCard from '../BlogCard';
import {
  SITE_URL,
  blogUrl,
  formatDate,
  getBlog,
  getBlogs,
  jsonLd,
  publishedDate,
  readingMinutes,
  tagToSlug,
} from '@/lib/blog';

export const revalidate = 300;

// Pre-render known posts at build time; new posts are rendered on first visit, then cached
export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: 'Blog Not Found | Tajalli', robots: { index: false } };
  }

  const title = blog.metaTitle || `${blog.title} | Tajalli Blog`;
  const description = blog.metaDescription || blog.desc;
  const url = blogUrl(blog.slug);
  const image = { url: blog.image, alt: blog.imageAlt || blog.title };

  return {
    title,
    description,
    keywords: blog.tags,
    authors: [{ name: blog.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'Tajalli',
      images: [image],
      publishedTime: new Date(publishedDate(blog)).toISOString(),
      modifiedTime: new Date(blog.updatedAt || publishedDate(blog)).toISOString(),
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: { card: 'summary_large_image', title, description, images: [blog.image] },
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const content = String(blog.content || '').replace(/\\n/g, '\n');
  const published = publishedDate(blog);
  const url = blogUrl(blog.slug);

  // Up to 3 other posts, preferring ones that share a tag
  const others = (await getBlogs()).filter((b) => b.slug !== blog.slug);
  const related = [
    ...others.filter((b) => (b.tags || []).some((t) => blog.tags?.includes(t))),
    ...others.filter((b) => !(b.tags || []).some((t) => blog.tags?.includes(t))),
  ].slice(0, 3);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      headline: blog.title,
      description: blog.metaDescription || blog.desc,
      image: [blog.image],
      keywords: (blog.tags || []).join(', '),
      wordCount: content.split(/\s+/).filter(Boolean).length,
      author: { '@type': 'Person', name: blog.author },
      publisher: {
        '@type': 'Organization',
        name: 'Tajalli',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
      },
      datePublished: new Date(published).toISOString(),
      dateModified: new Date(blog.updatedAt || published).toISOString(),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE_URL}/blogs` },
        { '@type': 'ListItem', position: 3, name: blog.title, item: url },
      ],
    },
  ];

  return (
    <>
      <article className={`container ${style.blog_container}`}>
        <div className={`${style.blog_box} py-5`}>
          <nav aria-label="Breadcrumb" className={style.breadcrumb}>
            <Link href="/">Home</Link> <span aria-hidden="true">›</span> <Link href="/blogs">Blogs</Link>
          </nav>

          <header>
            <h1>{blog.title}</h1>
            <p className={style.meta}>
              By {blog.author} · <time dateTime={new Date(published).toISOString()}>{formatDate(published)}</time> ·{' '}
              {readingMinutes(content)} min read
            </p>
          </header>

          <div className={style.imagebox}>
            <Image
              width={1200}
              height={675}
              sizes="(max-width: 900px) 90vw, 70vw"
              src={blog.image}
              alt={blog.imageAlt || blog.title}
              className={`my-4 ${style.image}`}
              priority
            />
          </div>

          <div className={style.content}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>

          {blog.tags?.length > 0 && (
            <>
              <hr />
              <div className="mt-4">
                <span>Tags:</span>
                {blog.tags.map((tag) => (
                  <Link key={tag} href={`/blogs/tags/${tagToSlug(tag)}`} className="btn btn-outline-secondary m-2">
                    {tag}
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="mt-4 d-flex flex-wrap gap-2">
            <Link href="/blogs" className="btn btn-outline-dark">← All blogs</Link>
            <Link href="/Shop/All-Products" className="btn btn-dark">Shop dry fruits</Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="container pb-5" aria-labelledby="related-heading">
          <h2 id="related-heading" className={style.relatedTitle}>You may also like</h2>
          <div className="row">
            {related.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
    </>
  );
}
