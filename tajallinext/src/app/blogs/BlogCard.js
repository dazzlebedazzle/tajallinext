import Link from 'next/link';
import Image from 'next/image';
import style from './BlogList.module.css';
import { formatDate, publishedDate } from '@/lib/blog';

// Server component: one post in a blog grid
export default function BlogCard({ post, priority = false }) {
  return (
    <article className="col-lg-4 col-md-6 mt-4">
      <Link href={`/blogs/${post.slug}`} className={style.bloglink}>
        <div className={style.bloglistitem}>
          <Image
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={post.image}
            alt={post.imageAlt || post.title}
            priority={priority}
          />
          <div className={style.blogdesc}>
            <h2 className={style.cardtitle}>{post.title}</h2>
            <p>{post.desc}</p>
            <div className={style.writerdetail}>
              <p>{post.author}</p>
              <p>
                <time dateTime={new Date(publishedDate(post)).toISOString()}>{formatDate(publishedDate(post))}</time>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
