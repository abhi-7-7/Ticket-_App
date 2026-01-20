'use client';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import styles from './bookings.module.css';

// ============================================================================
// SKELETON LOADER
// ============================================================================
function BookingSkeleton() {
  return (
    <div className={styles.bookingSkeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonContent}>
        <div className={`${styles.skeletonText} ${styles.wide}`} />
        <div className={`${styles.skeletonText} ${styles.medium}`} style={{ marginTop: '1rem' }} />
        <div className={`${styles.skeletonText} ${styles.medium}`} />
      </div>
    </div>
  );
}

// ============================================================================
// BOOKING CARD
// ============================================================================
function BookingCard({ booking, onCancel, onCancelLoading, onShowConfirm }) {
  const handleCancel = () => {
    onShowConfirm(booking.id);
  };

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const isUpcoming = checkInDate > new Date();
  const isCancellable = booking.status === 'confirmed' && isUpcoming;

  return (
    <div className={styles.bookingCard}>
      <div className={styles.bookingImage}>
        <img
          src={`https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop`}
          alt={booking.hotel?.name}
          className={styles.image}
        />
        <div className={styles.statusBadgeContainer}>
          <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'neutral' : 'warning'}>
            {booking.status}
          </Badge>
        </div>
      </div>

      <div className={styles.bookingContent}>
        <h3 className={styles.hotelName}>{booking.hotel?.name}</h3>
        <p className={styles.hotelCity}>📍 {booking.hotel?.city}</p>

        <div className={styles.bookingDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Check-in</span>
            <span className={styles.detailValue}>{checkInDate.toLocaleDateString()}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Check-out</span>
            <span className={styles.detailValue}>{checkOutDate.toLocaleDateString()}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Room</span>
            <span className={styles.detailValue}>#{booking.roomNumber}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Nights</span>
            <span className={styles.detailValue}>{nights}</span>
          </div>
        </div>

        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>Total</span>
          <span className={styles.price}>${booking.totalPrice}</span>
        </div>

        <div className={styles.bookingActions}>
          <Link href={`/hotels/${booking.hotel?._id || booking.hotelId}`} className={styles.actionLink}>
            View Hotel
          </Link>
          {isCancellable && (
            <button
              onClick={handleCancel}
              disabled={onCancelLoading}
              className={styles.cancelButton}
            >
              {onCancelLoading ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
          {!isCancellable && booking.status === 'confirmed' && !isUpcoming && (
            <span className={styles.pastLabel}>Past booking</span>
          )}
        </div>

        <div className={styles.bookingMeta}>
          <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================
function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>🏨</div>
      <h3 className={styles.emptyTitle}>No bookings yet</h3>
      <p className={styles.emptyDescription}>
        You haven't made any bookings. Start exploring hotels and make your first reservation!
      </p>
      <Link href="/hotels">
        <Button>Browse Hotels</Button>
      </Link>
    </div>
  );
}

// ============================================================================
// MAIN BOOKINGS PAGE
// ============================================================================
export default function BookingsPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, bookingId: null });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        const bookingsData = Array.isArray(res.data) ? res.data : (res.data.bookings || []);
        setBookings(bookingsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, router]);

  const handleCancelBooking = async (bookingId) => {
    setCancelLoading(bookingId);
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter((b) => b.id !== bookingId));
      setSuccessMessage('Booking cancelled successfully');
      setConfirmDialog({ isOpen: false, bookingId: null });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancelLoading(null);
    }
  };

  const handleShowConfirmDialog = (bookingId) => {
    setConfirmDialog({ isOpen: true, bookingId });
  };

  const handleConfirmCancel = () => {
    handleCancelBooking(confirmDialog.bookingId);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <SectionHeader
        title="My Bookings"
        subtitle="Manage your hotel reservations"
      />

      {/* Success Message */}
      {successMessage && (
        <div className={styles.successAlert}>
          ✓ {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorAlert}>
          ⚠️ {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className={styles.bookingsGrid}>
          {[1, 2, 3].map((i) => (
            <BookingSkeleton key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className={styles.bookingStats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{bookings.filter(b => b.status === 'confirmed').length}</span>
              <span className={styles.statLabel}>Confirmed</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{bookings.filter(b => new Date(b.checkIn) > new Date()).length}</span>
              <span className={styles.statLabel}>Upcoming</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{bookings.filter(b => new Date(b.checkOut) < new Date()).length}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>

          <div className={styles.bookingsGrid}>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                onCancelLoading={cancelLoading === booking.id}
                onShowConfirm={handleShowConfirmDialog}
              />
            ))}
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep It"
        isDangerous={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmDialog({ isOpen: false, bookingId: null })}
      />
    </div>
  );
}
