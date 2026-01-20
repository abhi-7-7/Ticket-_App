'use client';

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import api from '@/lib/api';
import useInView from '@/app/hooks/useInView';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SectionHeader from '@/components/ui/SectionHeader';
import { getFirstHotelImage } from '@/lib/fallbackImages';
import styles from './home.module.css';

function HotelSkeleton() {
  return (
    <Card className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonText} style={{ height: '16px', marginBottom: '0.75rem' }} />
      <div className={styles.skeletonText} style={{ height: '12px', width: '70%' }} />
    </Card>
  );
}

function BlogSkeleton() {
  return (
    <Card className={styles.skeleton}>
      <div className={styles.skeletonText} style={{ height: '18px', marginBottom: '0.5rem' }} />
      <div className={styles.skeletonText} style={{ height: '12px', marginBottom: '0.5rem' }} />
      <div className={styles.skeletonText} style={{ height: '12px', width: '60%', marginBottom: '1rem' }} />
      <div className={styles.skeletonText} style={{ height: '10px', width: '50%' }} />
    </Card>
  );
}

function HeroSection() {
  const { ref, isVisible } = useInView({ threshold: 0.3 });
  
  return (
    <section className={`section-sm ${styles.heroSection}`} ref={ref}>
      <div className={`container ${styles.heroContent} ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
        <h1>Discover Your Next Adventure</h1>
        <p className={styles.heroSubtitle}>
          Book premium hotels, manage reservations, and share travel stories all in one place.
        </p>
        <div className={styles.heroCta}>
          <Link href="/hotels">
            <Button variant="primary">Explore Hotels</Button>
          </Link>
          <Link href="/blogs">
            <Button variant="ghost">Read Travel Stories</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuickSearchSection() {
  const { ref, isVisible } = useInView({ threshold: 0.3 });
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    window.location.href = `/hotels?${params.toString()}`;
  };

  return (
    <section className={`section ${styles.searchSection}`} ref={ref}>
      <Card className={`container ${styles.searchCard} ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
        <SectionHeader title="Find Your Stay" align="left" />
        <div className={styles.searchGrid}>
          <div className={styles.searchField}>
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className={styles.searchField}>
            <label>Check-in</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className={styles.searchField}>
            <label>Check-out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className={styles.searchField}>
            <label>Guests</label>
            <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button variant="primary" onClick={handleSearch} style={{ width: '100%', marginTop: '1rem' }}>
          Search Hotels
        </Button>
      </Card>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { icon: '🔍', title: 'Search Hotels', desc: 'Browse thousands of hotels across your favorite destinations.' },
    { icon: '✓', title: 'Book Instantly', desc: 'Secure your reservation in seconds with instant confirmation.' },
    { icon: '🎉', title: 'Enjoy Your Stay', desc: 'Check in, manage your booking, and create memories.' },
  ];

  const { ref, isVisible } = useInView({ threshold: 0.2 });

  return (
    <section className={`section ${styles.howItWorks}`} ref={ref}>
      <div className="container">
        <SectionHeader title="How It Works" align="center" />
        <div className={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`${styles.stepCard} ${isVisible ? 'fade-in visible' : 'fade-in'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedHotelsSection() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useInView({ threshold: 0.2 });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get('/hotels?limit=4');
        const data = Array.isArray(res.data.hotels) ? res.data.hotels : Array.isArray(res.data) ? res.data : [];
        setHotels(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <section className={`section ${styles.featuredSection}`} ref={ref}>
      <div className="container">
        <SectionHeader
          title="Featured Hotels"
          description="Handpicked properties for unforgettable stays"
          align="center"
        />
        <div className={styles.hotelGrid}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <HotelSkeleton key={i} />)
            : hotels.map((hotel) => (
                <Card key={hotel.id} className={`${styles.hotelCard} ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                  <img src={getFirstHotelImage(hotel)} alt={hotel.name} className={styles.hotelImage} />
                  <h3>{hotel.name}</h3>
                  <p className={styles.hotelCity}>📍 {hotel.city}</p>
                  <p className={styles.hotelPrice}>From ${hotel.basePrice}/night</p>
                  <Link href={`/hotels/${hotel.id}`}>
                    <Button variant="secondary" style={{ width: '100%' }}>
                      View Details
                    </Button>
                  </Link>
                </Card>
              ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/hotels">
            <Button variant="ghost">View All Hotels →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedBlogsSection() {
  const [blogs, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useInView({ threshold: 0.2 });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs?limit=3');
        const data = Array.isArray(res.data.blogs) ? res.data.blogs : Array.isArray(res.data) ? res.data : [];
        setBlog(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className={`section ${styles.featuredSection}`} ref={ref}>
      <div className="container">
        <SectionHeader
          title="Travel Stories"
          description="Inspiration and tips from our community"
          align="center"
        />
        <div className={styles.blogGrid}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)
            : blogs.map((blog) => (
                <Card key={blog.id} className={`${styles.blogCard} ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                  <h3>{blog.title}</h3>
                  <p className={styles.blogExcerpt}>{blog.content?.substring(0, 80) || 'Discover this travel story...'}...</p>
                  <div className={styles.blogMeta}>
                    <Badge variant="neutral">{blog.author?.username || blog.author?.email || 'Anonymous'}</Badge>
                    {blog.createdAt && (
                      <span className={styles.metaText}>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Link href={`/blogs/${blog.slug || blog.id}`}>
                    <Button variant="secondary" style={{ width: '100%', marginTop: '1rem' }}>
                      Read Story →
                    </Button>
                  </Link>
                </Card>
              ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/blogs">
            <Button variant="ghost">Read All Stories →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const { ref, isVisible } = useInView({ threshold: 0.3 });
  const metrics = [
    { label: '500+', value: 'Hotels Listed' },
    { label: '50+', value: 'Cities' },
    { label: '10k+', value: 'Happy Travelers' },
  ];

  return (
    <section className={`section ${styles.trustSection}`} ref={ref}>
      <div className="container">
        <div className={styles.metricsGrid}>
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`${styles.metricCard} ${isVisible ? 'fade-in visible' : 'fade-in'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className={styles.metricValue}>{metric.label}</div>
              <div className={styles.metricLabel}>{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoSection() {
  const { ref, isVisible } = useInView({ threshold: 0.3 });

  return (
    <section className={`section ${styles.promoSection}`} ref={ref}>
      <div className="container">
        <Card className={`${styles.promoBanner} ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
          <div className={styles.promoLabel}>✨ Featured Offer</div>
          <h2>Exclusive Travel Deals</h2>
          <p>Get up to 30% off your first hotel booking with our partners.</p>
          <Link href="/hotels">
            <Button variant="primary">Claim Offer</Button>
          </Link>
        </Card>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  const { user } = useContext(AuthContext);
  const { ref, isVisible } = useInView({ threshold: 0.3 });

  return (
    <section className={`section-sm ${styles.finalCta}`} ref={ref}>
      <div className={`container ${styles.ctaContent} ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
        <h2>Ready to Start Your Adventure?</h2>
        <p>Join thousands of travelers discovering their perfect stays.</p>
        <div className={styles.ctaButtons}>
          {user ? (
            <>
              <Link href="/hotels">
                <Button variant="primary">Browse Hotels</Button>
              </Link>
              <Link href="/bookings">
                <Button variant="secondary">My Bookings</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Log In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <QuickSearchSection />
      <HowItWorksSection />
      <FeaturedHotelsSection />
      <FeaturedBlogsSection />
      <TrustSection />
      <PromoSection />
      <FinalCtaSection />
    </main>
  );
}
