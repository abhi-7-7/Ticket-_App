'use client';
import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import api from '@/lib/api';
import { getHotelImages, getFallbackImageGallery } from '@/lib/fallbackImages';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import styles from './hotelDetail.module.css';

// ============================================================================
// BOOKING CONFIRMATION COMPONENT
// ============================================================================
function BookingConfirmation({ hotel, booking, onClose, onExplore }) {
  return (
    <div className={styles.confirmationOverlay} onClick={onClose}>
      <div className={styles.confirmationCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.confirmationIcon}>✓</div>
        <h2 className={styles.confirmationTitle}>Booking Confirmed!</h2>
        
        <div className={styles.confirmationDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Hotel</span>
            <span className={styles.detailValue}>{hotel.name}</span>
          </div>
          
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Check-in</span>
            <span className={styles.detailValue}>
              {new Date(booking.checkIn).toLocaleDateString()}
            </span>
          </div>
          
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Check-out</span>
            <span className={styles.detailValue}>
              {new Date(booking.checkOut).toLocaleDateString()}
            </span>
          </div>
          
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Room</span>
            <span className={styles.detailValue}>#{booking.roomNumber}</span>
          </div>
          
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Status</span>
            <Badge variant="success">
              {booking.status}
            </Badge>
          </div>
          
          <div className={`${styles.detailRow} ${styles.totalRow}`}>
            <span className={styles.detailLabel}>Total Price</span>
            <span className={styles.totalPrice}>${booking.totalPrice}</span>
          </div>
        </div>
        
        <div className={styles.confirmationActions}>
          <Button onClick={() => {
            window.location.href = '/bookings';
          }} style={{ flex: 1 }}>
            View My Bookings
          </Button>
          <Button onClick={onExplore} variant="secondary" style={{ flex: 1 }}>
            Continue Exploring
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STICKY BOOKING CARD COMPONENT
// ============================================================================
function StickyBookingCard({
  hotel,
  selectedRoom,
  dates,
  onDatesChange,
  onGuestsChange,
  guests,
  nights,
  totalPrice,
  onBook,
  isBooking,
  error,
  user,
}) {
  const isValid = selectedRoom && dates.checkIn && dates.checkOut && dates.checkIn < dates.checkOut;

  return (
    <div className={styles.stickyBookingCard}>
      <div className={styles.bookingCardContent}>
        <div className={styles.priceHeader}>
          <span className={styles.priceLabel}>Price per night</span>
          <p className={styles.priceValue}>
            ${selectedRoom?.price || hotel.basePrice}
          </p>
        </div>

        <div className={styles.divider} />

        {/* Check-in Date */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Check-in</label>
          <input
            type="date"
            value={dates.checkIn}
            onChange={(e) => onDatesChange({ ...dates, checkIn: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className={styles.formInput}
          />
        </div>

        {/* Check-out Date */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Check-out</label>
          <input
            type="date"
            value={dates.checkOut}
            onChange={(e) => onDatesChange({ ...dates, checkOut: e.target.value })}
            min={dates.checkIn || new Date().toISOString().split('T')[0]}
            className={styles.formInput}
          />
        </div>

        {/* Guests */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Guests</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => onGuestsChange(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="8"
            className={styles.formInput}
          />
        </div>

        {/* Nights Display */}
        {nights > 0 && (
          <div className={styles.nightsInfo}>
            <span>{nights} night{nights !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Total Price */}
        {nights > 0 && selectedRoom && (
          <div className={styles.priceBreakdown}>
            <div className={styles.breakdownRow}>
              <span>${selectedRoom.price} × {nights} nights</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {/* CTA Button */}
        {user ? (
          <Button
            onClick={onBook}
            disabled={isBooking || !isValid}
            className={styles.bookButton}
            style={{ width: '100%' }}
          >
            {isBooking ? 'Processing...' : isValid ? 'Reserve Now' : 'Select Dates & Room'}
          </Button>
        ) : (
          <div className={styles.loginPrompt}>
            <p>Please <a href="/login">log in</a> to book</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN HOTEL DETAIL PAGE
// ============================================================================
export default function HotelDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Fetch hotel data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hotels/${id}`);
        setHotel(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load hotel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Calculate nights
  const calculateNights = () => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = useMemo(() => calculateNights(), [dates]);
  const totalPrice = useMemo(() => {
    if (!selectedRoom || nights === 0) return 0;
    return selectedRoom.price * nights;
  }, [selectedRoom, nights]);

  // Validate booking
  const isValidBooking = useMemo(() => {
    if (!selectedRoom || !dates.checkIn || !dates.checkOut) return false;
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    return checkIn < checkOut;
  }, [selectedRoom, dates]);

  // Handle booking
  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isValidBooking) {
      setError('Please select a room and valid dates');
      // Scroll to error
      setTimeout(() => {
        const errorElement = document.querySelector(`.${styles.errorAlert}`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus({ preventScroll: true });
        }
      }, 100);
      return;
    }

    setIsBooking(true);
    setError('');

    try {
      const response = await api.post('/bookings', {
        hotelId: hotel._id,
        roomNumber: selectedRoom.number,
        checkIn: new Date(dates.checkIn).toISOString(),
        checkOut: new Date(dates.checkOut).toISOString(),
        guests: guests,
      });

      setBookingData(response.data);
      setShowConfirmation(true);
      
      // Scroll confirmation into view after state updates
      setTimeout(() => {
        const confirmationElement = document.querySelector(`.${styles.confirmationCard}`);
        if (confirmationElement) {
          confirmationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.details || 'Booking failed. Please try again.';
      setError(errorMsg);
      setIsBooking(false);
      
      // Scroll error into view
      setTimeout(() => {
        const errorElement = document.querySelector(`.${styles.errorAlert}`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const hotelImages = hotel ? getHotelImages(hotel) : [];

  if (isLoading) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.skeletonGallery} />
        <div className={styles.skeletonText} style={{ height: '2rem', marginTop: '2rem' }} />
        <div className={styles.skeletonText} style={{ height: '1rem', marginTop: '1rem' }} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.errorContainer}>
          <h2>Hotel Not Found</h2>
          <p>The hotel you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/hotels')}>
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.detailContainer}>
        {/* Gallery Section */}
        <div className={styles.gallerySection}>
          <div className={styles.gallery}>
            <img
              src={hotelImages[currentImageIndex]}
              alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
              className={styles.galleryImage}
              onError={(e) => {
                if (!e.target.src.includes('unsplash')) {
                  e.target.src = getFallbackImageGallery(hotel?.id || hotel?._id, 4)[0];
                }
              }}
            />

            {hotelImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + hotelImages.length) % hotelImages.length)}
                  className={`${styles.navigationButton} ${styles.prevButton}`}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length)}
                  className={`${styles.navigationButton} ${styles.nextButton}`}
                  aria-label="Next image"
                >
                  ›
                </button>

                <div className={styles.dotsContainer}>
                  {hotelImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`${styles.dot} ${idx === currentImageIndex ? styles.active : ''}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className={styles.contentLayout}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Header */}
            <div className={styles.hotelHeader}>
              <div>
                <h1 className={styles.hotelTitle}>{hotel.name}</h1>
                <p className={styles.hotelLocation}>
                  📍 {hotel.city}
                  {hotel.address && ` • ${hotel.address}`}
                </p>
              </div>
              {hotel.rating > 0 && (
                <Badge variant="success" className={styles.ratingBadge}>
                  ⭐ {hotel.rating.toFixed(1)}
                </Badge>
              )}
            </div>

            {/* Description */}
            {hotel.description && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>About this hotel</h2>
                <p className={styles.description}>{hotel.description}</p>
              </div>
            )}

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Hotel Amenities</h2>
                <div className={styles.amenitiesGrid}>
                  {hotel.amenities.map((amenity, idx) => (
                    <div key={idx} className={styles.amenityItem}>
                      <span className={styles.amenityIcon}>✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Rooms */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Select Your Room</h2>
              {hotel.rooms?.length === 0 ? (
                <div className={styles.noRooms}>
                  <p>No rooms available at the moment.</p>
                </div>
              ) : (
                <div className={styles.roomsGrid}>
                  {hotel.rooms?.map((room) => (
                    <div
                      key={room.number}
                      onClick={() => {
                        if (room.isAvailable) {
                          setSelectedRoom(room);
                          setError('');
                        }
                      }}
                      className={`${styles.roomCard} ${selectedRoom?.number === room.number ? styles.roomSelected : ''} ${!room.isAvailable ? styles.roomUnavailable : ''}`}
                    >
                      <div className={styles.roomHeader}>
                        <div>
                          <h3 className={styles.roomNumber}>Room {room.number}</h3>
                          <p className={styles.roomType}>{room.type}</p>
                        </div>
                        <Badge variant={room.isAvailable ? 'success' : 'neutral'}>
                          {room.isAvailable ? '✓ Available' : '✗ Occupied'}
                        </Badge>
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div className={styles.roomAmenities}>
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className={styles.roomAmenityTag}>
                              {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className={styles.roomAmenityTag}>
                              +{room.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className={styles.roomFooter}>
                        <span className={styles.roomPrice}>${room.price}/night</span>
                      </div>

                      {selectedRoom?.number === room.number && (
                        <div className={styles.selectedIndicator}>
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* House Rules */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>House Rules</h2>
              <ul className={styles.houseRules}>
                <li>Check-in from 2:00 PM</li>
                <li>Check-out before 11:00 AM</li>
                <li>No pets allowed</li>
                <li>Quiet hours: 10:00 PM - 8:00 AM</li>
              </ul>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <StickyBookingCard
            hotel={hotel}
            selectedRoom={selectedRoom}
            dates={dates}
            onDatesChange={setDates}
            onGuestsChange={setGuests}
            guests={guests}
            nights={nights}
            totalPrice={totalPrice}
            onBook={handleBooking}
            isBooking={isBooking}
            error={error}
            user={user}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && bookingData && (
        <BookingConfirmation
          hotel={hotel}
          booking={bookingData}
          onClose={() => router.push('/bookings')}
          onExplore={() => router.push('/hotels')}
        />
      )}
    </>
  );
}
