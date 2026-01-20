'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import useInView from '@/app/hooks/useInView';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import styles from './blogs.module.css';

function BlogSkeleton() {
  return (
    <Card className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonText} style={{ height: '18px', marginBottom: '0.5rem' }} />
      <div className={styles.skeletonText} style={{ height: '12px', marginBottom: '0.5rem', width: '90%' }} />
      <div className={styles.skeletonText} style={{ height: '12px', width: '70%', marginBottom: '1rem' }} />
      <div className={styles.skeletonText} style={{ height: '10px', width: '50%' }} />
    </Card>
  );
}

function BlogCardComponent({ blog, isFeatured = false, isVisible = false }) {
  const readTime = Math.ceil((blog.content?.length || 0) / 600);
  const tags = blog.tags || inferTagsFromTitle(blog.title);
  const excerpt = blog.content?.substring(0, 120) || blog.description || 'Read this travel story...';

  return (
    <Card className={`${styles.blogCard} ${isFeatured ? styles.featured : ''} ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
      {isFeatured && <div className={styles.featuredBadge}>✨ Editor's Pick</div>}
      <div className={styles.blogImage} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop')` }} />
      <div className={styles.blogContent}>
        <h3>{blog.title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.blogMeta}>
          <div className={styles.authorSection}>
            <div className={styles.avatar}>{(blog.author?.username || 'A')[0].toUpperCase()}</div>
            <div>
              <p className={styles.author}>{blog.author?.username || 'Anonymous'}</p>
              <p className={styles.date}>{readTime} min read</p>
            </div>
          </div>
        </div>
        <div className={styles.tags}>
          {tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
        <Link href={`/blogs/${blog.slug || blog._id}`}>
          <Button variant="secondary" style={{ width: '100%', marginTop: '1rem' }}>
            Read Story →
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function inferTagsFromTitle(title) {
  const tags = ['Travel'];
  if (title.toLowerCase().includes('hotel')) tags.push('Hotels');
  if (title.toLowerCase().includes('budget')) tags.push('Budget');
  if (title.toLowerCase().includes('luxury')) tags.push('Luxury');
  return tags;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const { ref: headerRef, isVisible: headerVisible } = useInView({ threshold: 0.3 });
  const { ref: newsletterRef, isVisible: newsletterVisible } = useInView({ threshold: 0.3 });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/blogs');
      const blogsData = res.data.data || res.data.blogs || res.data || [];
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || inferTagsFromTitle(blog.title).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const featuredBlog = blogs[0];
  const otherBlogs = filteredBlogs.slice(1);
  const allTags = ['Travel', 'Hotels', 'Budget', 'Luxury'];

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>⚠️ Unable to Load Blogs</h2>
          <p className={styles.errorMessage}>{error}</p>
          <Button onClick={fetchBlogs}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <section className={`section-sm ${styles.header}`} ref={headerRef}>
        <div className={`container ${headerVisible ? 'fade-in visible' : 'fade-in'}`}>
          <SectionHeader
            title="Travel Stories & Insights"
            description="Discover travel tips, hotel reviews, and inspiring stories from our community"
            align="center"
          />
        </div>
      </section>

      {/* Featured Blog */}
      {!loading && featuredBlog && (
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            <div className={styles.featuredGrid}>
              <BlogCardComponent blog={featuredBlog} isFeatured={true} isVisible={headerVisible} />
            </div>
          </div>
        </section>
      )}

      {/* Search & Filter Section */}
      <section className={`section-sm ${styles.filterSection}`}>
        <div className="container">
          <div className={styles.filterGrid}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.tagFilter}>
              <button
                className={`${styles.tagBtn} ${!selectedTag ? styles.active : ''}`}
                onClick={() => setSelectedTag('')}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.tagBtn} ${selectedTag === tag ? styles.active : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      {loading ? (
        <section className={`section ${styles.blogsSection}`}>
          <div className="container">
            <div className={styles.blogsGrid}>
              {Array.from({ length: 6 }).map((_, i) => <BlogSkeleton key={i} />)}
            </div>
          </div>
        </section>
      ) : blogs.length === 0 ? (
        <section className={`section ${styles.emptyState}`}>
          <div className="container">
            <p>📝 No blog posts available yet.</p>
            <p>Check back soon for travel stories and tips!</p>
          </div>
        </section>
      ) : (
        <section className={`section ${styles.blogsSection}`}>
          <div className="container">
            <div className={styles.blogsGrid}>
              {otherBlogs.map((blog, idx) => (
                <div key={blog._id} style={{ animationDelay: `${idx * 50}ms` }}>
                  <BlogCardComponent blog={blog} isVisible={headerVisible} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className={`section ${styles.newsletterSection}`} ref={newsletterRef}>
        <Card className={`container ${styles.newsletterCard} ${newsletterVisible ? 'fade-in visible' : 'fade-in'}`}>
          <div className={styles.newsletterContent}>
            <h2>Don't Miss Travel Stories</h2>
            <p>Get our latest travel tips and hotel recommendations straight to your inbox.</p>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" className={styles.emailInput} />
              <Button variant="primary">Subscribe</Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
