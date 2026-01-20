import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topRow}>
          <div>
            <p className={styles.brand}>🎫 Ticket Booking</p>
            <p className={styles.text}>Making travel planning simpler, faster, and more delightful.</p>
          </div>
          <div className={styles.links}>
            <Link href="/hotels">Hotels</Link>
            <Link href="/blogs">Blogs</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div className={styles.bottomRow}>
          <p className={styles.meta}>© {new Date().getFullYear()} Ticket Booking. All rights reserved.</p>
          <div className={styles.links}>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
