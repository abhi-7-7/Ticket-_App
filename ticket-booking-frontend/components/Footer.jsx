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
            <a href="/hotels">Hotels</a>
            <a href="/blogs">Blogs</a>
            <a href="/about">About</a>
          </div>
        </div>
        <div className={styles.bottomRow}>
          <p className={styles.meta}>© {new Date().getFullYear()} Ticket Booking. All rights reserved.</p>
          <div className={styles.links}>
            <a href="/login">Login</a>
            <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
