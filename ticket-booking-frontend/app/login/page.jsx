'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useInView from '@/app/hooks/useInView';
import styles from '@/app/auth/auth.module.css';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { ref, isVisible } = useInView({ threshold: 0.3 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: '🎫', title: 'Easy Bookings', desc: 'Book hotels in seconds' },
    { icon: '📋', title: 'Manage Trips', desc: 'View and modify reservations' },
    { icon: '💾', title: 'Save Preferences', desc: 'Personalized experience' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Column - Form */}
        <div className={`${styles.formColumn} ${isVisible ? 'fade-in visible' : 'fade-in'}`} ref={ref}>
          <Card className={styles.card}>
            <div className={styles.header}>
              <p className={styles.kicker}>Welcome back</p>
              <h1 className={styles.title}>Log in to continue</h1>
              <p className={styles.subtitle}>Access your bookings and manage your trips securely.</p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label htmlFor="username" className={styles.label}>Username</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>👤</span>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter your username"
                  />
                </div>
                <p className={styles.helper}>Use the username you registered with.</p>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🔒</span>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter your password"
                  />
                </div>
                <p className={styles.helper}>🔐 Your password is encrypted and never shared.</p>
              </div>

              <Button variant="primary" type="submit" loading={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <div className={styles.footer}>
              <p className={styles.helper}>Forgot your password? <Link href="/reset-password" className={styles.linkButton}>Reset it here</Link></p>
              <p className={styles.helper}>New here? <Link href="/signup" className={styles.linkButton}>Create an account</Link></p>
            </div>
          </Card>
        </div>

        {/* Right Column - Benefits */}
        <div className={`${styles.benefitsColumn} ${isVisible ? 'fade-in visible' : 'fade-in'}`} style={{ transitionDelay: '100ms' }}>
          <div className={styles.benefitsContent}>
            <h2>Why create an account?</h2>
            <div className={styles.benefitsList}>
              {benefits.map((benefit, idx) => (
                <div key={idx} className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>{benefit.icon}</div>
                  <div>
                    <p className={styles.benefitTitle}>{benefit.title}</p>
                    <p className={styles.benefitDesc}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className={styles.trustCard}>
              <p>✅ <strong>Secure</strong> — Your data is encrypted</p>
              <p>✅ <strong>Private</strong> — We never share your info</p>
              <p>✅ <strong>Fast</strong> — No hidden fees or surprises</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
