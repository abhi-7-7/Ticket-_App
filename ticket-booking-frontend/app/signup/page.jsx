'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import styles from '@/app/auth/auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    passwordsMatch &&
    formData.agreeToTerms &&
    passwordStrength !== 'weak';

  function calculatePasswordStrength(pwd) {
    if (!pwd) return null;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    const length = pwd.length >= 8;

    const checks = [hasLower, hasUpper, hasNumber, hasSpecial, length];
    const score = checks.filter(Boolean).length;

    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) {
      setErrors({
        form: 'Please fill in all required fields correctly',
      });
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.fullName);
      // Redirect to homepage on successful signup
      router.push('/');
    } catch (error) {
      setErrors({
        form: error.response?.data?.error || error.message || 'Signup failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const benefitItems = [
    {
      icon: '🔒',
      title: 'Secure Bookings',
      text: 'Your information is encrypted and protected',
    },
    {
      icon: '🎫',
      title: 'Easy Tickets',
      text: 'Manage all your bookings in one place',
    },
    {
      icon: '✈️',
      title: 'Exclusive Deals',
      text: 'Access special offers for members',
    },
    {
      icon: '⭐',
      title: 'Save Favorites',
      text: 'Bookmark hotels and flights instantly',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Form Column */}
        <div className={styles.formColumn}>
          <Card padding="lg">
            <div className={styles.header}>
              <p className={styles.kicker}>Get Started</p>
              <h1 className={styles.title}>Create Account</h1>
              <p className={styles.subtitle}>
                Join millions booking travel experiences every day
              </p>
            </div>

            {errors.form && (
              <div className={styles.error} role="alert">
                {errors.form}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.label}>
                  Full Name
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>👤</span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className={styles.inputWithIcon}
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.inputWithIcon}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🔐</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={styles.inputWithIcon}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Strength Meter */}
                {formData.password && (
                  <>
                    <div className={styles.strengthMeter}>
                      <div
                        className={`${styles.strengthBar} ${
                          passwordStrength === 'weak'
                            ? styles.strengthBarWeak
                            : passwordStrength === 'medium'
                            ? styles.strengthBarMedium
                            : styles.strengthBarStrong
                        }`}
                      />
                    </div>
                    <p
                      className={styles.helper}
                      style={{
                        color:
                          passwordStrength === 'weak'
                            ? '#ef4444'
                            : passwordStrength === 'medium'
                            ? '#f59e0b'
                            : '#10b981',
                      }}
                    >
                      Password strength: <strong>{passwordStrength}</strong>
                    </p>

                    {/* Checklist */}
                    <div className={styles.strengthChecklist}>
                      <div
                        className={`${styles.checklistItem} ${
                          /[a-z]/.test(formData.password) ? styles.active : ''
                        }`}
                      >
                        <span className={styles.checklistIcon}>✓</span>
                        Lowercase letter
                      </div>
                      <div
                        className={`${styles.checklistItem} ${
                          /[A-Z]/.test(formData.password) ? styles.active : ''
                        }`}
                      >
                        <span className={styles.checklistIcon}>✓</span>
                        Uppercase letter
                      </div>
                      <div
                        className={`${styles.checklistItem} ${
                          /[0-9]/.test(formData.password) ? styles.active : ''
                        }`}
                      >
                        <span className={styles.checklistIcon}>✓</span>
                        Number
                      </div>
                      <div
                        className={`${styles.checklistItem} ${
                          /[!@#$%^&*]/.test(formData.password) ? styles.active : ''
                        }`}
                      >
                        <span className={styles.checklistIcon}>✓</span>
                        Special character (!@#$%^&*)
                      </div>
                      <div
                        className={`${styles.checklistItem} ${
                          formData.password.length >= 8 ? styles.active : ''
                        }`}
                      >
                        <span className={styles.checklistIcon}>✓</span>
                        At least 8 characters
                      </div>
                    </div>
                  </>
                )}

                {errors.password && <p className={styles.error}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🔐</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={styles.inputWithIcon}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className={styles.error}>Passwords do not match</p>
                )}
                {formData.confirmPassword && passwordsMatch && (
                  <p className={styles.success}>✓ Passwords match</p>
                )}
              </div>

              {/* Terms & Privacy */}
              <div className={styles.formGroup}>
                <div className={styles.checkboxGroup}>
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="agreeToTerms" className={styles.checkboxLabel}>
                    I agree to{' '}
                    <Link href="/terms" className={styles.link}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className={styles.link}>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isFormValid || loading}
                className={loading ? styles.loadingButton : ''}
              >
                {loading ? (
                  <>
                    <span className={styles.loadingSpinner} />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" className={styles.link}>
                Log in
              </Link>
            </p>
          </Card>
        </div>

        {/* Benefits Column */}
        <div className={styles.benefitsColumn}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-secondary)',
              marginTop: 0,
              marginBottom: '1.5rem',
            }}
          >
            Why Join Us?
          </h2>

          <div className={styles.benefitsList}>
            {benefitItems.map((item, idx) => (
              <div key={idx} className={styles.benefitItem}>
                <div className={styles.benefitIcon}>{item.icon}</div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>{item.title}</h3>
                  <p className={styles.benefitText}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.trustCard}>
            <span className={styles.trustIcon}>🛡️</span>
            <div className={styles.trustContent}>
              <p className={styles.trustTitle}>Industry-Leading Security</p>
              <p className={styles.trustText}>
                We use bank-level encryption to protect your personal and payment information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
