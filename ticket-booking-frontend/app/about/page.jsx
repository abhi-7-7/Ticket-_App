'use client';

import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SectionHeader from '@/components/ui/SectionHeader';
import styles from './about.module.css';

export default function AboutPage() {
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: whyRef, inView: whyInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const stats = [
    { number: '500K+', label: 'Travelers', icon: '✈️' },
    { number: '10K+', label: 'Hotels', icon: '🏨' },
    { number: '50K+', label: 'Reviews', icon: '⭐' },
    { number: '98%', label: 'Satisfaction', icon: '😊' },
  ];

  const whyChooseUs = [
    {
      icon: '🛡️',
      title: 'Secure & Trusted',
      description: 'Bank-level encryption and industry-standard security practices',
    },
    {
      icon: '⚡',
      title: 'Fast & Easy',
      description: 'Book in minutes with our intuitive, mobile-friendly interface',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Price matching guarantee and exclusive member-only deals',
    },
    {
      icon: '🎯',
      title: 'Personalized',
      description: 'Smart recommendations based on your travel preferences',
    },
    {
      icon: '📱',
      title: 'Modern Tech',
      description: 'Built with latest technologies for optimal performance',
    },
    {
      icon: '24/7',
      title: 'Always Available',
      description: 'Round-the-clock customer support when you need us',
    },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'Launched our comprehensive travel booking platform',
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to 50+ countries with local partnerships',
    },
    {
      year: '2025',
      title: 'AI Features',
      description: 'Introducing smart travel recommendations powered by AI',
    },
  ];

  const techStack = [
    { category: 'Frontend', tech: 'Next.js 13, React 18, Axios' },
    { category: 'Backend', tech: 'Express.js, MongoDB, Mongoose' },
    { category: 'Auth', tech: 'Passport.js, JWT, Session Management' },
    { category: 'Deployment', tech: 'Vercel, Docker, CI/CD Pipeline' },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About Ticket Booking</h1>
          <p className={styles.heroSubtitle}>
            Your trusted platform for seamless hotel bookings and travel adventures
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className={`${styles.section} ${missionInView ? styles.fadeIn : ''}`}>
        <div className={styles.sectionContainer}>
          <SectionHeader
            kicker="Our Purpose"
            title="Making Travel Accessible to Everyone"
            description="We believe travel connects people, cultures, and communities. Our mission is to make booking accommodations effortless and enjoyable."
          />

          <div className={styles.missionGrid}>
            <Card padding="lg" className={styles.missionCard}>
              <div className={styles.cardIcon}>✈️</div>
              <h3>Seamless Bookings</h3>
              <p>Intuitive interface makes booking your next stay just a few clicks away</p>
            </Card>

            <Card padding="lg" className={styles.missionCard}>
              <div className={styles.cardIcon}>🌍</div>
              <h3>Global Reach</h3>
              <p>Access thousands of hotels in destinations across the world</p>
            </Card>

            <Card padding="lg" className={styles.missionCard}>
              <div className={styles.cardIcon}>🤝</div>
              <h3>Community Focus</h3>
              <p>Connect with other travelers and share your travel stories</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className={`${styles.stats} ${statsInView ? styles.fadeIn : ''}`}>
        <div className={styles.sectionContainer}>
          <SectionHeader
            kicker="By The Numbers"
            title="Trusted by Millions"
            description="Join our growing community of travelers worldwide"
          />

          <div className={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <div key={idx} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyRef} className={`${styles.section} ${whyInView ? styles.fadeIn : ''}`}>
        <div className={styles.sectionContainer}>
          <SectionHeader
            kicker="Why Choose Us"
            title="Experience the Difference"
            description="What sets us apart from other booking platforms"
          />

          <div className={styles.whyGrid}>
            {whyChooseUs.map((item, idx) => (
              <Card key={idx} padding="md" className={styles.whyCard}>
                <div className={styles.whyIcon}>{item.icon}</div>
                <h4 className={styles.whyTitle}>{item.title}</h4>
                <p className={styles.whyDescription}>{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <SectionHeader
            kicker="Our Journey"
            title="From Startup to Leader"
            description="Our milestones in transforming travel bookings"
          />

          <div className={styles.timeline}>
            {timeline.map((item, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineYear}>{item.year}</div>
                  <h4 className={styles.timelineTitle}>{item.title}</h4>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <SectionHeader
            kicker="Technology"
            title="Built with Modern Stack"
            description="Leveraging the latest technologies for reliability and performance"
          />

          <div className={styles.techGrid}>
            {techStack.map((item, idx) => (
              <Card key={idx} padding="md" className={styles.techCard}>
                <div className={styles.techCategory}>{item.category}</div>
                <div className={styles.techList}>
                  {item.tech.split(', ').map((tech, i) => (
                    <Badge key={i} variant="primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className={`${styles.ctaSection} ${ctaInView ? styles.fadeIn : ''}`}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of travelers already booking with us
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/hotels">
                <Button variant="primary" size="lg">
                  Explore Hotels
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#333' }}>How It Works</h2>
        <ol style={{ fontSize: '1.1rem', color: '#555', lineHeight: '2' }}>
          <li><strong>Sign Up:</strong> Create your account to access all features</li>
          <li><strong>Browse Hotels:</strong> Search hotels by city and view detailed information</li>
          <li><strong>Make Bookings:</strong> Select your dates, choose a room, and confirm your booking</li>
          <li><strong>Manage:</strong> Track your bookings and make changes as needed</li>
          <li><strong>Explore Blogs:</strong> Read travel experiences and get inspired for your next trip</li>
        </ol>
      </section>

      {/* Project Information */}
      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#333' }}>Project Information</h2>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '0.5rem' }}>
          <strong>Project Type:</strong> Full-stack Web Application (Internship Project)
        </p>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '0.5rem' }}>
          <strong>Database:</strong> MongoDB (NoSQL)
        </p>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '0.5rem' }}>
          <strong>Authentication:</strong> Passport.js with session-based auth
        </p>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          <strong>Version:</strong> 1.0.0
        </p>
      </section>

      {/* Footer CTA */}
      <section style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Built with ❤️ for travelers and hospitality professionals
        </p>
      </section>
    </div>
  );
}
