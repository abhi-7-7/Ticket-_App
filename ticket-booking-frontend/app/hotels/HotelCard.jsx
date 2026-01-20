'use client';

import Link from 'next/link';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { getFirstHotelImage } from '@/lib/fallbackImages';
import animStyles from '@/styles/animations.module.css';
import styles from './hotels.module.css';

export default function HotelCard({ hotel }) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`${styles.hotelCard} ${isVisible ? animStyles.fadeUp : ''}`}
    >
      {/* Hotel Image */}
      <div className={styles.imageContainer}>
        <img
          src={getFirstHotelImage(hotel)}
          alt={`${hotel.name} in ${hotel.city}`}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            if (!e.target.src.includes('unsplash')) {
              e.target.src = getFirstHotelImage(hotel);
            }
          }}
        />
      </div>

      {/* Hotel Info */}
      <div className={styles.hotelInfo}>
        <div className={styles.hotelHeader}>
          <h2 className={styles.hotelName}>{hotel.name}</h2>
          {hotel.rating > 0 && (
            <div className={styles.ratingBadge} aria-label={`Rating: ${hotel.rating.toFixed(1)} out of 5 stars`}>
              <span aria-hidden="true">⭐</span> {hotel.rating.toFixed(1)}
            </div>
          )}
        </div>

        <p className={styles.location} aria-label={`Location: ${hotel.city}`}>
          <span aria-hidden="true">📍</span> {hotel.city}
          {hotel.address && ` • ${hotel.address.substring(0, 30)}...`}
        </p>

        {hotel.description && (
          <p className={styles.description}>
            {hotel.description.substring(0, 120)}...
          </p>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className={styles.amenitiesContainer}>
            <div className={styles.amenitiesList} role="list" aria-label="Hotel amenities">
              {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                <span
                  key={idx}
                  className={styles.amenity}
                  role="listitem"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className={styles.amenityMore} aria-label={`${hotel.amenities.length - 4} more amenities`}>
                  +{hotel.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <p className={styles.priceLabel}>Starting from</p>
            <p className={styles.price} aria-label={`Price: $${hotel.basePrice} per night`}>
              ${hotel.basePrice}
              <span className={styles.priceUnit}>/night</span>
            </p>
            <p className={styles.roomsAvailable} aria-label={`${hotel.rooms?.length || 0} rooms available`}>
              {hotel.rooms?.length || 0} rooms available
            </p>
          </div>
          <Link
            href={`/hotels/${hotel.id}`}
            className={styles.ctaButton}
            aria-label={`View details for ${hotel.name}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
