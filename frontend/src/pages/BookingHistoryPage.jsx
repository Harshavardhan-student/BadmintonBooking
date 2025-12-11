import React, { useEffect, useState } from 'react';

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/bookings/me', {
      headers: { 'x-user-id': '000000000000000000000001' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load bookings');
        return res.json();
      })
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((b) => (
        <div key={b._id} style={{ border: '1px solid black', margin: 10, padding: 10, width: 350 }}>
          <strong>{b.court?.name}</strong> ({b.court?.type})
          <br />
          <strong>Status:</strong> {b.status}
          <br />
          <strong>Start:</strong> {b.startTime ? new Date(b.startTime).toLocaleString() : '--'}
          <br />
          <strong>End:</strong> {b.endTime ? new Date(b.endTime).toLocaleString() : '--'}
          <br />
          <strong>Total Price:</strong> {b.pricingBreakdown?.total ?? '--'}
        </div>
      ))}
    </div>
  );
}
