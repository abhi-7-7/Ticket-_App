'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.navbar}>
      {/* Left section: Logo and navigation links */}
      <div className={styles.navLeft}>
        <Link href="/" className={styles.logo}>
          🎫 Ticket Booking
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
          >
            About
          </Link>
          <Link 
            href="/hotels" 
            className={`${styles.navLink} ${isActive('/hotels') ? styles.active : ''}`}
          >
            Hotels
          </Link>
          <Link 
            href="/blogs" 
            className={`${styles.navLink} ${isActive('/blogs') ? styles.active : ''}`}
          >
            Blogs
          </Link>
          {user && (
            <Link 
              href="/bookings" 
              className={`${styles.navLink} ${isActive('/bookings') ? styles.active : ''}`}
            >
              My Bookings
            </Link>
          )}
          {user && (
            <Link 
              href="/manager" 
              className={`${styles.navLink} ${isActive('/manager') ? styles.active : ''}`}
            >
              Manager
            </Link>
          )}
        </div>
      </div>

      {/* Right section: User info and auth buttons */}
      <div className={styles.navRight}>
        {user ? (
          <>
            <span className={styles.userInfo}>
              👤 <strong>{user.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>
            <Link href="/signup" className={styles.signupBtn}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
