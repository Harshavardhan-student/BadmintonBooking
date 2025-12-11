import React, { useEffect, useState, useRef } from 'react';

export default function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [price, setPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  const activeFetch = useRef(null);

  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:4000/api/admin/courts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load courts');
        return res.json();
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) setCourts(data);
      })
      .catch(() => {
        if (mounted) setCourts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const buildDateTime = (d, t) => {
    if (!d || !t) return null;
    // Expecting d = 'YYYY-MM-DD', t = 'HH:MM'. Create a local ISO string.
    try {
      // Combine into local time (no 'Z') so that server receives local-equivalent timestamp.
      const iso = `${d}T${t}:00`;
      const dt = new Date(iso);
      if (Number.isNaN(dt.getTime())) return null;
      return dt.toISOString();
    } catch (err) {
      return null;
    }
  };

  const startDateTime = buildDateTime(date, startTime);
  const endDateTime = startDateTime
    ? new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString()
    : null;

  // Fetch pricing whenever selections update
  useEffect(() => {
    // Cancel previous
    if (activeFetch.current && typeof activeFetch.current.abort === 'function') {
      try { activeFetch.current.abort(); } catch (e) {}
    }

    if (!courtId || !startDateTime || !endDateTime) {
      setPrice(null);
      setPriceError(null);
      setLoadingPrice(false);
      return;
    }

    setLoadingPrice(true);
    setPriceError(null);
    setPrice(null);

    const controller = new AbortController();
    activeFetch.current = controller;

    fetch('http://localhost:4000/api/pricing/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courtId, startTime: startDateTime, endTime: endDateTime }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Pricing fetch failed');
        return res.json();
      })
      .then((data) => {
        // Accept either { pricingBreakdown: {...} } or a flat breakdown
        if (data && data.pricingBreakdown) setPrice(data.pricingBreakdown);
        else setPrice(data || null);
        setPriceError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setPrice(null);
        setPriceError(err.message || 'Failed to fetch price');
      })
      .finally(() => {
        setLoadingPrice(false);
        activeFetch.current = null;
      });
  }, [courtId, startDateTime, endDateTime]);

  const canConfirm = courtId && date && startTime && price && !loadingPrice && !priceError;

  const handleConfirm = async () => {
    setBookingStatus('submitting');
    setBookingStatus(null);
    try {
      const payload = { courtId, startTime: startDateTime, endTime: endDateTime };
      const res = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Booking failed');
      }
      const data = await res.json();
      setBookingStatus({ success: true, booking: data });
    } catch (err) {
      setBookingStatus({ success: false, message: err.message || 'Booking error' });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Booking Page</h1>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Select Court:</label>
        <select value={courtId} onChange={(e) => setCourtId(e.target.value)}>
          <option value=''>--Choose Court--</option>
          {Array.isArray(courts) && courts.map((court) => (
            <option key={court._id || court.id || court.name} value={court._id || court.id}>
              {court.name} ({court.type})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Select Date:</label>
        <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Select Time:</label>
        <input type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>Start:</strong> {startDateTime || '--'} <br />
        <strong>End:</strong> {endDateTime || '--'}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ border: '1px solid black', padding: 10, width: 360 }}>
          <h3>Price Summary</h3>
          {loadingPrice && <div>Loading price...</div>}
          {priceError && <div style={{ color: 'red' }}>{priceError}</div>}

          {!loadingPrice && !price && !priceError && (
            <div style={{ color: '#666' }}>Select court, date and time to get a quote.</div>
          )}

          {price && (
            <div>
              {typeof price === 'object' && !Array.isArray(price) ? (
                Object.entries(price).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                    <strong>{typeof v === 'number' ? v.toFixed(2) : String(v)}</strong>
                  </div>
                ))
              ) : (
                <div>{String(price)}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        {canConfirm ? (
          <button onClick={handleConfirm}>Confirm Booking</button>
        ) : (
          <button disabled>Confirm Booking</button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        {bookingStatus && bookingStatus.success === true && (
          <div style={{ color: 'green' }}>Booking created — id: {bookingStatus.booking._id}</div>
        )}
        {bookingStatus && bookingStatus.success === false && (
          <div style={{ color: 'red' }}>Booking failed: {bookingStatus.message}</div>
        )}
      </div>
    </div>
  );
}
