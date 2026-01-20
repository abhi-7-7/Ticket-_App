'use client';

import { useEffect, useState } from 'react';
import { managerAPI } from '@/lib/api';

export default function ManagerPage() {
  const [groupedBookings, setGroupedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [filters, setFilters] = useState({ status: '', hotelId: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await managerAPI.getAllBookings(filters);
      setGroupedBookings(res.data.grouped || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (bookingId) => {
    if (!confirm('Confirm check-in for this booking?')) return;
    try {
      setActionLoading(bookingId);
      await managerAPI.checkIn(bookingId);
      alert('Check-in successful');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Check-in failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOut = async (bookingId) => {
    if (!confirm('Confirm check-out for this booking?')) return;
    try {
      setActionLoading(bookingId);
      await managerAPI.checkOut(bookingId);
      alert('Check-out successful');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Check-out failed');
    } finally {
      setActionLoading(null);
    }
  };

  const applyFilters = () => {
    fetchBookings();
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading bookings...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={fetchBookings}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Manager Dashboard</h1>
      
      {/* Filters */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-end'
      }}>
        <div>
          <label htmlFor="statusFilter" style={{ display: 'block', marginBottom: '5px' }}>
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button 
          onClick={applyFilters}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Apply Filters
        </button>
        <button 
          onClick={fetchBookings}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {groupedBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        groupedBookings.map((group) => (
          <div
            key={group.hotel.id}
            style={{
              marginBottom: '30px',
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
            }}
          >
            <h2>{group.hotel.name} - {group.hotel.city}</h2>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              {group.bookings.length} booking(s)
            </p>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>
                      Guest
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>
                      Room
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>
                      Check-in
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>
                      Check-out
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>
                      Status
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>
                      Total
                    </th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        <div>
                          <strong>{booking.user?.username || 'N/A'}</strong>
                          <br />
                          <small style={{ color: '#666' }}>{booking.user?.email || ''}</small>
                        </div>
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {booking.roomNumber}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor:
                              booking.status === 'confirmed'
                                ? '#fff3cd'
                                : booking.status === 'checked_in'
                                ? '#d4edda'
                                : booking.status === 'completed'
                                ? '#d1ecf1'
                                : '#f8d7da',
                            color:
                              booking.status === 'confirmed'
                                ? '#856404'
                                : booking.status === 'checked_in'
                                ? '#155724'
                                : booking.status === 'completed'
                                ? '#0c5460'
                                : '#721c24',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        ${booking.totalPrice}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCheckIn(booking.id)}
                            disabled={actionLoading === booking.id}
                            style={{
                              padding: '6px 12px',
                              marginRight: '5px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: actionLoading === booking.id ? 'not-allowed' : 'pointer',
                              opacity: actionLoading === booking.id ? 0.6 : 1,
                            }}
                          >
                            {actionLoading === booking.id ? 'Processing...' : 'Check-in'}
                          </button>
                        )}
                        {booking.status === 'checked_in' && (
                          <button
                            onClick={() => handleCheckOut(booking.id)}
                            disabled={actionLoading === booking.id}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: actionLoading === booking.id ? 'not-allowed' : 'pointer',
                              opacity: actionLoading === booking.id ? 0.6 : 1,
                            }}
                          >
                            {actionLoading === booking.id ? 'Processing...' : 'Check-out'}
                          </button>
                        )}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                          <span style={{ color: '#999', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
