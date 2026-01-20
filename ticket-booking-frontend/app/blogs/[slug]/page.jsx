'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { blogsAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import styles from './blogDetail.module.css';

export default function BlogDetailPage() {
  const params = useParams();
  const { slug } = params;
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await blogsAPI.getBySlug(slug);
      const blogData = res.data.data || res.data.blog || res.data;
      setBlog(blogData);
      
      // Fetch related blogs
      try {
        const allBlogs = await blogsAPI.list({ limit: 20 });
        const blogs = Array.isArray(allBlogs.data) ? allBlogs.data : allBlogs.data.blogs || [];
        const related = blogs.filter((b) => b._id !== blogData._id).slice(0, 3);
        setRelatedBlogs(related);
      } catch (err) {
        console.warn('Failed to fetch related blogs');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return 3;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const shareOptions = [
    { icon: '𝕏', label: 'Twitter', href: '#' },
    { icon: '📘', label: 'Facebook', href: '#' },
    { icon: '💼', label: 'LinkedIn', href: '#' },
    { icon: '🔗', label: 'Copy Link', href: '#' },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSkeleton}>
          <div className={styles.skeletonHeader} />
          <div className={styles.skeletonContent} />
          <div className={styles.skeletonContent} />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Article Not Found</h2>
          <p>Sorry, we couldn't find the article you're looking for.</p>
          <Link href="/blogs">
            <Button variant="primary">Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(blog.content);
  const authorInitial = blog.author?.[0]?.toUpperCase() || 'A';

  return (
    <div className={styles.page}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <Link href="/blogs" className={styles.breadcrumb}>
              ← Back to articles
            </Link>
            
            <h1 className={styles.heroTitle}>{blog.title}</h1>
            
            <p className={styles.heroDescription}>
              {blog.description || blog.excerpt || 'Read this article to learn more'}
            </p>

            {/* Article Meta */}
            <div className={styles.articleMeta}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>{authorInitial}</div>
                <div className={styles.authorDetails}>
                  <p className={styles.authorName}>{blog.author || 'Travel Insights'}</p>
                  <p className={styles.articleStats}>
                    {formatDate(blog.createdAt)} · {readTime} min read
                  </p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className={styles.shareButtons}>
                {shareOptions.map((option, idx) => (
                  <a
                    key={idx}
                    href={option.href}
                    className={styles.shareButton}
                    title={option.label}
                  >
                    {option.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {blog.image && (
            <div className={styles.heroCover}>
              <img src={blog.image} alt={blog.title} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Article Content */}
        <article className={styles.articleContent}>
          <div className={styles.articleBody}>
            {blog.content ? (
              <div className={styles.richContent}>
                {blog.content.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && (
                    <p key={idx} className={styles.paragraph}>
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            ) : (
              <p className={styles.paragraph}>{blog.description}</p>
            )}
          </div>

          {/* Article Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className={styles.tagSection}>
              <p className={styles.tagLabel}>Topics:</p>
              <div className={styles.tagList}>
                {blog.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className={styles.bottomCTA}>
            <Card padding="md" className={styles.ctaCard}>
              <h3>Ready to book your next adventure?</h3>
              <p>Explore our curated collection of hotels and flights</p>
              <div className={styles.ctaButtons}>
                <Link href="/hotels">
                  <Button variant="primary">Explore Hotels</Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="secondary">View My Bookings</Button>
                </Link>
              </div>
            </Card>
          </div>
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <Card padding="md" className={styles.sidebarCard}>
              <h4 className={styles.sidebarTitle}>Related Articles</h4>
              <div className={styles.relatedList}>
                {relatedBlogs.map((related) => (
                  <Link
                    key={related._id}
                    href={`/blogs/${related.slug || related._id}`}
                    className={styles.relatedItem}
                  >
                    <h5 className={styles.relatedTitle}>{related.title}</h5>
                    <p className={styles.relatedMeta}>
                      {formatDate(related.createdAt)} · {calculateReadTime(related.content)} min
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Newsletter Signup */}
          <Card padding="md" className={styles.sidebarCard}>
            <h4 className={styles.sidebarTitle}>Travel Tips Weekly</h4>
            <p className={styles.newsletterText}>
              Get insider tips and exclusive deals in your inbox
            </p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="your@email.com"
                className={styles.newsletterInput}
                required
              />
              <Button variant="primary" size="sm" className={styles.newsletterButton}>
                Subscribe
              </Button>
            </form>
          </Card>

          {/* Share Section */}
          <Card padding="md" className={styles.sidebarCard}>
            <h4 className={styles.sidebarTitle}>Share Article</h4>
            <div className={styles.socialLinks}>
              {shareOptions.map((option, idx) => (
                <a
                  key={idx}
                  href={option.href}
                  className={styles.socialLink}
                  title={option.label}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </a>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
