import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BookingPage from './pages/BookingPage.jsx';
import BookingHistoryPage from './pages/BookingHistoryPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10, display: 'flex', gap: 10 }}>
        <Link to='/'>Book</Link>
        <Link to='/history'>My Bookings</Link>
        <Link to='/admin'>Admin</Link>
      </nav>
      <Routes>
        <Route path='/' element={<BookingPage />} />
        <Route path='/history' element={<BookingHistoryPage />} />
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
