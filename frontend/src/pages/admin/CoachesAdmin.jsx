import React, { useEffect, useState } from 'react';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function CoachesAdmin() {
	const [coaches, setCoaches] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Add form
	const [name, setName] = useState('');
	const [specialization, setSpecialization] = useState('');
	const [isActive, setIsActive] = useState(true);
	const [slotDay, setSlotDay] = useState('MON');
	const [slotStart, setSlotStart] = useState('09:00');
	const [slotEnd, setSlotEnd] = useState('10:00');
	const [slots, setSlots] = useState([]); // [{ day, start, end }]

	// Edit state
	const [editId, setEditId] = useState(null);
	const [editName, setEditName] = useState('');
	const [editSpecialization, setEditSpecialization] = useState('');
	const [editIsActive, setEditIsActive] = useState(true);
	const [editSlots, setEditSlots] = useState([]);

	useEffect(() => { loadCoaches(); }, []);

	async function loadCoaches() {
		setLoading(true); setError(null);
		try {
			const res = await fetch('http://localhost:4000/api/admin/coaches');
			if (!res.ok) throw new Error('Failed to load coaches');
			const data = await res.json();
			setCoaches(Array.isArray(data) ? data : []);
		} catch (err) { setError(err.message || 'Load error'); }
		finally { setLoading(false); }
	}

	function addSlot() {
		if (!slotDay || !slotStart || !slotEnd) return;
		setSlots([...slots, { day: slotDay, start: slotStart, end: slotEnd }]);
	}

	function removeSlot(index) {
		const copy = slots.slice(); copy.splice(index, 1); setSlots(copy);
	}

	function removeEditSlot(index) {
		const copy = editSlots.slice(); copy.splice(index, 1); setEditSlots(copy);
	}

	async function handleAdd(e) {
		e.preventDefault(); setError(null);
		try {
			const payload = { name, specialization, isActive, availability: slots };
			const res = await fetch('http://localhost:4000/api/admin/coaches', {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Add failed'); }
			// reset
			setName(''); setSpecialization(''); setIsActive(true); setSlots([]);
			await loadCoaches();
		} catch (err) { setError(err.message || 'Add error'); }
	}

	function startEdit(coach) {
		setEditId(coach._id);
		setEditName(coach.name || '');
		setEditSpecialization(coach.specialization || '');
		setEditIsActive(Boolean(coach.isActive));
		setEditSlots(Array.isArray(coach.availability) ? coach.availability.map(s => ({ day: s.day, start: s.start, end: s.end })) : []);
	}

	function cancelEdit() {
		setEditId(null); setEditName(''); setEditSpecialization(''); setEditIsActive(true); setEditSlots([]);
	}

	async function handleUpdate(e) {
		e.preventDefault(); if (!editId) return; setError(null);
		try {
			const payload = { name: editName, specialization: editSpecialization, isActive: editIsActive, availability: editSlots };
			const res = await fetch(`http://localhost:4000/api/admin/coaches/${editId}`, {
				method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Update failed'); }
			cancelEdit(); await loadCoaches();
		} catch (err) { setError(err.message || 'Update error'); }
	}

	async function handleDelete(id) {
		if (!confirm('Delete this coach?')) return;
		setError(null);
		try {
			const res = await fetch(`http://localhost:4000/api/admin/coaches/${id}`, { method: 'DELETE' });
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Delete failed'); }
			await loadCoaches();
		} catch (err) { setError(err.message || 'Delete error'); }
	}

	return (
		<div>
			<h2>Coaches Admin</h2>
			{error && <div style={{ color: 'red' }}>{error}</div>}

			<div style={{ marginTop: 12, marginBottom: 12 }}>
				<form onSubmit={handleAdd} style={{ display: 'block', gap: 8 }}>
					<div>
						<input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
					</div>
					<div>
						<input placeholder='Specialization' value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
					</div>
					<div>
						<label><input type='checkbox' checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active</label>
					</div>

					<div style={{ marginTop: 8 }}>
						<strong>Availability slots</strong>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
							<select value={slotDay} onChange={(e) => setSlotDay(e.target.value)}>
								{DAYS.map(d => <option key={d} value={d}>{d}</option>)}
							</select>
							<input type='time' value={slotStart} onChange={(e) => setSlotStart(e.target.value)} />
							<input type='time' value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} />
							<button type='button' onClick={addSlot}>Add Slot</button>
						</div>
						<div>
							{slots.map((s, i) => (
								<div key={i}>{s.day} {s.start}-{s.end} <button type='button' onClick={() => removeSlot(i)}>Remove</button></div>
							))}
						</div>
					</div>

					<div style={{ marginTop: 8 }}>
						<button type='submit'>Add Coach</button>
					</div>
				</form>
			</div>

			{loading ? <div>Loading coaches...</div> : (
				<div>
					{coaches.length === 0 && <div>No coaches yet.</div>}
					{coaches.map((c) => (
						<div key={c._id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8, width: 640 }}>
							{editId === c._id ? (
								<form onSubmit={handleUpdate} style={{ display: 'block', gap: 8 }}>
									<div>
										<input value={editName} onChange={(e) => setEditName(e.target.value)} required />
									</div>
									<div>
										<input value={editSpecialization} onChange={(e) => setEditSpecialization(e.target.value)} />
									</div>
									<div>
										<label><input type='checkbox' checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} /> Active</label>
									</div>
									<div style={{ marginTop: 6 }}>
										<strong>Availability</strong>
										<div>
											{editSlots.map((s, idx) => (
												<div key={idx}>{s.day} {s.start}-{s.end} <button type='button' onClick={() => removeEditSlot(idx)}>Remove</button></div>
											))}
										</div>
										<div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
											<select onChange={(e) => setSlotDay(e.target.value)} value={slotDay}>{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select>
											<input type='time' value={slotStart} onChange={(e) => setSlotStart(e.target.value)} />
											<input type='time' value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} />
											<button type='button' onClick={() => setEditSlots([...editSlots, { day: slotDay, start: slotStart, end: slotEnd }])}>Add Slot</button>
										</div>
									</div>
									<div style={{ marginTop: 8 }}>
										<button type='submit'>Save</button>
										<button type='button' onClick={cancelEdit}>Cancel</button>
									</div>
								</form>
							) : (
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
									<div>
										<div><strong>{c.name}</strong> ({c.specialization})</div>
										<div>Active: {String(c.isActive)}</div>
										<div>
											<strong>Availability:</strong>
											<div>{Array.isArray(c.availability) && c.availability.length === 0 && <div>No availability</div>}</div>
											<div>
												{Array.isArray(c.availability) && c.availability.map((s, i) => (
													<div key={i}>{s.day} {s.start}-{s.end}</div>
												))}
											</div>
										</div>
									</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<button onClick={() => startEdit(c)}>Edit</button>
										<button onClick={() => handleDelete(c._id)}>Delete</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
