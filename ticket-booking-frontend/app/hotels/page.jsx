'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { getFirstHotelImage } from '@/lib/fallbackImages';
import useScrollReveal from '@/app/hooks/useScrollReveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './hotels.module.css';

// ============================================================================
// SKELETON CARD
// ============================================================================
function SkeletonCard() {
  return (
    <div className={`${styles.hotelCard} ${styles.skeletonCard}`}>
      <div className={styles.skeletonImage} />
      <div className={styles.hotelInfo}>
        <div className={styles.hotelHeader}>
          <div className={`${styles.skeletonText} ${styles.wide}`} />
          <div className={styles.skeletonBadge} />
        </div>
        <div className={`${styles.skeletonText} ${styles.medium}`} style={{ marginBottom: '0.5rem' }} />
        <div className={`${styles.skeletonText} ${styles.wide}`} style={{ marginBottom: '0.35rem' }} />
        <div className={`${styles.skeletonText} ${styles.medium}`} style={{ marginBottom: '1rem' }} />
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <div className={`${styles.skeletonText} ${styles.short}`} />
          <div className={`${styles.skeletonText} ${styles.short}`} />
        </div>
        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <div className={`${styles.skeletonText} ${styles.short}`} style={{ marginBottom: '0.35rem' }} />
            <div className={`${styles.skeletonText} ${styles.short}`} style={{ marginBottom: '0.35rem' }} />
            <div className={`${styles.skeletonText} ${styles.medium}`} />
          </div>
          <div className={`${styles.skeletonText} ${styles.short}`} style={{ height: '38px' }} />
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// HOTEL CARD WITH ENHANCED UX
// ============================================================================
function HotelCard({ hotel, isPageLoading }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  // Get amenity icons
  const amenityIcons = {
    WiFi: '📶',
    Pool: '🏊',
    Parking: '🅿️',
    'Air Conditioning': '❄️',
    Gym: '💪',
    Restaurant: '🍽️',
    'Room Service': '🔔',
    'Pet Friendly': '🐾',
    'Spa': '💆',
    'Conference Room': '📊',
  };

  const getAmenityIcon = (amenity) => amenityIcons[amenity] || '✓';

  return (
    <div
      ref={ref}
      className={`${styles.hotelCard} ${styles.reveal} ${isVisible ? styles.revealVisible : ''}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={getFirstHotelImage(hotel)}
          alt={hotel.name}
          className={styles.image}
          onError={(e) => {
            if (!e.target.src.includes('unsplash')) {
              e.target.src = getFirstHotelImage(hotel);
            }
          }}
        />
      </div>

      <div className={styles.hotelInfo}>
        <div className={styles.hotelHeader}>
          <h2 className={styles.hotelName}>{hotel.name}</h2>
          {hotel.rating > 0 && (
            <Badge variant="success">
              ⭐ {hotel.rating.toFixed(1)}
            </Badge>
          )}
        </div>

        <p className={styles.location}>
          📍 {hotel.city}
          {hotel.address && ` • ${hotel.address.substring(0, 30)}...`}
        </p>

        {hotel.description && (
          <p className={styles.description}>
            {hotel.description.substring(0, 120)}...
          </p>
        )}

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className={styles.amenitiesContainer}>
            <div className={styles.amenitiesList}>
              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                <Badge key={idx} variant="neutral" className={styles.amenityBadge}>
                  {getAmenityIcon(amenity)} {amenity}
                </Badge>
              ))}
              {hotel.amenities.length > 3 && (
                <Badge variant="neutral" className={styles.amenityBadge}>
                  +{hotel.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <p className={styles.priceLabel}>Starting from</p>
            <p className={styles.price}>
              ${hotel.basePrice}
              <span className={styles.priceUnit}>/night</span>
            </p>
            <p className={styles.roomsAvailable}>
              {hotel.rooms?.length || 0} rooms available
            </p>
          </div>
          <Link
            href={`/hotels/${hotel.id}`}
            className={`${styles.ctaButton} ${isPageLoading ? styles.ctaDisabled : ''}`}
            aria-disabled={isPageLoading}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================
function FilterBar({
  cities,
  selectedCity,
  minPrice,
  maxPrice,
  minPriceRange,
  maxPriceRange,
  selectedRating,
  selectedAmenities,
  sortBy,
  onCityChange,
  onMinPriceChange,
  onMaxPriceChange,
  onRatingChange,
  onAmenityToggle,
  onSortChange,
  onClearFilters,
  loading,
  totalResults,
}) {
  const amenitiesOptions = ['WiFi', 'Pool', 'Parking'];

  const isFiltersActive = selectedCity || minPrice !== minPriceRange || maxPrice !== maxPriceRange || selectedRating || selectedAmenities.length > 0 || sortBy !== 'name';

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterBarTop}>
        <h3 className={styles.filterTitle}>Filters</h3>
        {isFiltersActive && (
          <button className={styles.clearButton} onClick={onClearFilters} disabled={loading}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filterGrid}>
        {/* City Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>City</label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={loading}
            className={styles.filterInput}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Min Price</label>
          <input
            type="number"
            min={minPriceRange}
            max={maxPriceRange}
            value={minPrice}
            onChange={(e) => onMinPriceChange(parseInt(e.target.value))}
            disabled={loading}
            className={styles.filterInput}
            placeholder="$0"
          />
        </div>

        {/* Max Price */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Max Price</label>
          <input
            type="number"
            min={minPriceRange}
            max={maxPriceRange}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(parseInt(e.target.value))}
            disabled={loading}
            className={styles.filterInput}
            placeholder="$9999"
          />
        </div>

        {/* Rating Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Rating</label>
          <select
            value={selectedRating}
            onChange={(e) => onRatingChange(parseFloat(e.target.value))}
            disabled={loading}
            className={styles.filterInput}
          >
            <option value="0">All Ratings</option>
            <option value="3">⭐ 3+ Stars</option>
            <option value="4">⭐ 4+ Stars</option>
            <option value="4.5">⭐ 4.5+ Stars</option>
          </select>
        </div>

        {/* Sort */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={loading}
            className={styles.filterInput}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low → High)</option>
            <option value="price-high">Price (High → Low)</option>
            <option value="rating">Rating (High)</option>
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div className={styles.amenitiesFilter}>
        <label className={styles.filterLabel}>Amenities</label>
        <div className={styles.amenitiesChips}>
          {amenitiesOptions.map((amenity) => (
            <button
              key={amenity}
              className={`${styles.amenityChip} ${selectedAmenities.includes(amenity) ? styles.amenityChipActive : ''}`}
              onClick={() => onAmenityToggle(amenity)}
              disabled={loading}
            >
              {amenity === 'WiFi' && '📶'}
              {amenity === 'Pool' && '🏊'}
              {amenity === 'Parking' && '🅿️'}
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterResults}>
        {totalResults > 0 && <p>{totalResults} hotels found</p>}
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================
function EmptyState({ onClear, error }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{error ? '⚠️' : '🔍'}</div>
      <h3 className={styles.emptyTitle}>
        {error ? 'Oops! Something went wrong' : 'No hotels found'}
      </h3>
      <p className={styles.emptyDescription}>
        {error
          ? 'We had trouble loading hotels. Please try again.'
          : "We couldn't find any hotels matching your filters."}
      </p>
      {onClear && (
        <button className={styles.emptyButton} onClick={onClear}>
          {error ? 'Retry' : 'Clear Filters'}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// MAIN HOTELS PAGE
// ============================================================================
export default function HotelsPage() {
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [selectedCity, setSelectedCity] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  // Fetch hotels with pagination
  const fetchHotels = useCallback(async () => {
    setError('');
    try {
      const limit = 9;
      const skip = (page - 1) * limit;
      const res = await api.get(`/hotels?limit=${limit}&skip=${skip}`);
      
      const hotelsData = Array.isArray(res.data.hotels)
        ? res.data.hotels
        : Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      
      // Get pagination info
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setTotalPages(1);
      }
      
      setAllHotels(hotelsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Get unique cities and price range
  const cities = useMemo(() => [...new Set(allHotels.map((h) => h.city))].sort(), [allHotels]);
  const priceRange = useMemo(() => {
    if (allHotels.length === 0) return { min: 0, max: 9999 };
    const prices = allHotels.map((h) => h.basePrice).filter(Boolean);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [allHotels]);

  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    let results = allHotels;

    // City filter
    if (selectedCity) {
      results = results.filter((h) => h.city === selectedCity);
    }

    // Price filter
    results = results.filter(
      (h) => h.basePrice >= minPrice && h.basePrice <= maxPrice
    );

    // Rating filter
    if (selectedRating > 0) {
      results = results.filter((h) => h.rating >= selectedRating);
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      results = results.filter((h) =>
        selectedAmenities.every((amenity) =>
          h.amenities?.includes(amenity)
        )
      );
    }

    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.basePrice - b.basePrice;
        case 'price-high':
          return b.basePrice - a.basePrice;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return results;
  }, [allHotels, selectedCity, minPrice, maxPrice, selectedRating, selectedAmenities, sortBy]);

  // Handlers
  const handleCityChange = (city) => setSelectedCity(city);
  const handleMinPriceChange = (price) => setMinPrice(price);
  const handleMaxPriceChange = (price) => setMaxPrice(price);
  const handleRatingChange = (rating) => setSelectedRating(rating);
  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };
  const handleSortChange = (sort) => setSortBy(sort);

  const handleClearFilters = () => {
    setSelectedCity('');
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSelectedRating(0);
    setSelectedAmenities([]);
    setSortBy('name');
  };

  // UI state
  const skeletonCards = Array.from({ length: 6 }, (_, idx) => (
    <SkeletonCard key={`skeleton-${idx}`} />
  ));
  const isInitialLoad = loading && allHotels.length === 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <SectionHeader
        title="Explore Hotels"
        subtitle="Find the perfect accommodation for your journey"
      />

      {/* Main content */}
      <div className={styles.contentWrapper}>
        {/* Filter Bar (Sidebar on desktop, stacked on mobile) */}
        {!isInitialLoad && (
          <FilterBar
            cities={cities}
            selectedCity={selectedCity}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minPriceRange={priceRange.min}
            maxPriceRange={priceRange.max}
            selectedRating={selectedRating}
            selectedAmenities={selectedAmenities}
            sortBy={sortBy}
            onCityChange={handleCityChange}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            onRatingChange={handleRatingChange}
            onAmenityToggle={handleAmenityToggle}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            loading={loading}
            totalResults={filteredHotels.length}
          />
        )}

        {/* Hotels Grid */}
        <div className={styles.gridArea}>
          {isInitialLoad ? (
            <div className={styles.grid}>{skeletonCards}</div>
          ) : error ? (
            <EmptyState
              error={true}
              onClear={() => {
                setError('');
                fetchHotels();
              }}
            />
          ) : allHotels.length === 0 ? (
            <EmptyState error={false} onClear={handleClearFilters} />
          ) : (
            <>
              <div className={styles.grid}>
                {allHotels.map((hotel, idx) => (
                  <HotelCard
                    key={hotel._id ?? hotel.id ?? idx}
                    hotel={hotel}
                    isPageLoading={loading}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className={styles.paginationContainer}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className={styles.paginationButton}
                >
                  ← Previous
                </button>

                <div className={styles.pageIndicator}>
                  Page <span className={styles.currentPage}>{page}</span> of{' '}
                  <span className={styles.totalPages}>{totalPages}</span>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className={styles.paginationButton}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
