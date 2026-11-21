import Link from 'next/link';
import style from './BlogList.module.css';
import BlogCard from './BlogCard';
import { SITE_URL, getBlogs, jsonLd, tagToSlug, blogUrl, publishedDate } from '@/lib/blog';

export const revalidate = 300;

const TITLE = 'Blog – Dry Fruit Tips, Health Benefits & Recipes | Tajalli';
const DESCRIPTION =
  'Read the Tajalli blog for dry fruit health benefits, nutrition guides, storage tips and recipes with premium almonds, pistachios, raisins and more.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blogs`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Tajalli',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default async function BlogListPage() {
  const blogs = await getBlogs();
  const tags = [...new Set(blogs.flatMap((b) => b.tags || []))].sort();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Tajalli Blog',
    url: `${SITE_URL}/blogs`,
    description: DESCRIPTION,
    publisher: { '@type': 'Organization', name: 'Tajalli', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
    blogPost: blogs.slice(0, 20).map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      url: blogUrl(b.slug),
      image: b.image,
      datePublished: new Date(publishedDate(b)).toISOString(),
    })),
  };

  return (
    <div className="bloglist">
      <section className={style.aboutus_header}>
        <h1>
          <strong>Blogs</strong>
        </h1>
      </section>

      <section className="container py-5">
        <p className={style.intro}>{DESCRIPTION}</p>

        {tags.length > 0 && (
          <nav aria-label="Blog topics" className={style.taglist}>
            {tags.map((tag) => (
              <Link key={tag} href={`/blogs/tags/${tagToSlug(tag)}`} className="btn btn-outline-secondary btn-sm m-1">
                {tag}
              </Link>
            ))}
          </nav>
        )}

        {blogs.length === 0 ? (
          <p className="text-center py-5">New articles are coming soon. Check back shortly!</p>
        ) : (
          <div className="row">
            {blogs.map((post, index) => (
              <BlogCard key={post._id} post={post} priority={index < 3} />
            ))}
          </div>
        )}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
    </div>
  );
}
