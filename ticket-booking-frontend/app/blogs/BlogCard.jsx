'use client';

import Link from 'next/link';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { calculateReadingTime, getExcerpt } from '@/utils/blog.utils';
import animStyles from '@/styles/animations.module.css';
import styles from './blogs.module.css';

export default function BlogCard({ blog }) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <article 
      ref={ref} 
      className={`${styles.blogCard} ${isVisible ? animStyles.fadeUp : ''}`}
    >
      {/* Card content */}
      <div className={styles.cardContent}>
        <Link 
          href={`/blogs/${blog.slug}`} 
          className={styles.cardLink}
          aria-label={`Read article: ${blog.title}`}
        >
          <h2 className={styles.blogTitle}>{blog.title}</h2>
        </Link>

        {/* Blog metadata */}
        <div className={styles.metadata} aria-label="Article metadata">
          <span className={styles.author}>
            <span aria-hidden="true">✍️</span>
            <span className="sr-only">Author:</span> {blog.author?.username || 'Anonymous'}
          </span>
          <span className={styles.date}>
            <span aria-hidden="true">📅</span>
            <span className="sr-only">Published on:</span> {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Blog excerpt */}
        <p className={styles.excerpt}>
          {getExcerpt(blog.body, 150)}
        </p>

        {/* Reading time and metadata footer */}
        <div className={styles.footer}>
          <span className={styles.readingTime} aria-label={`Reading time: ${calculateReadingTime(blog.body)} minutes`}>
            <span aria-hidden="true">⏱️</span> {calculateReadingTime(blog.body)} min read
          </span>
          <Link 
            href={`/blogs/${blog.slug}`} 
            className={styles.readMore}
            aria-label={`Read full article: ${blog.title}`}
          >
            Read Article →
          </Link>
        </div>

        {/* Read more link */}
        <Link 
          href={`/blogs/${blog.slug}`} 
          className={styles.readMore}
          aria-label={`Read more about ${blog.title}`}
        >
          Read More →
        </Link>
      </div>

      {/* Card footer */}
      <div className={styles.cardFooter}>
        <Link 
          href={`/blogs/${blog.slug}`} 
          className={styles.viewBtn}
          aria-label={`View article: ${blog.title}`}
        >
          View Article
        </Link>
      </div>
    </article>
  );
}
