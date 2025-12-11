import React, { useState } from 'react';
import CourtsAdmin from './admin/CourtsAdmin.jsx';
import EquipmentAdmin from './admin/EquipmentAdmin.jsx';
import CoachesAdmin from './admin/CoachesAdmin.jsx';
import PricingRulesAdmin from './admin/PricingRulesAdmin.jsx';

export default function AdminPage() {
  const [tab, setTab] = useState('courts');

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab('courts')}>Courts</button>
        <button onClick={() => setTab('equipment')}>Equipment</button>
        <button onClick={() => setTab('coaches')}>Coaches</button>
        <button onClick={() => setTab('pricing')}>Pricing Rules</button>
      </div>

      {tab === 'courts' && <CourtsAdmin />}
      {tab === 'equipment' && <EquipmentAdmin />}
      {tab === 'coaches' && <CoachesAdmin />}
      {tab === 'pricing' && <PricingRulesAdmin />}
    </div>
  );
}

