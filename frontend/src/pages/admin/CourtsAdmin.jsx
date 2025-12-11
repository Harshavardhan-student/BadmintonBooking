import React, { useEffect, useState } from 'react';

export default function CourtsAdmin() {
	const [courts, setCourts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Add form state
	const [name, setName] = useState('');
	const [type, setType] = useState('INDOOR');
	const [baseRate, setBaseRate] = useState('');

	// Edit state
	const [editId, setEditId] = useState(null);
	const [editName, setEditName] = useState('');
	const [editType, setEditType] = useState('INDOOR');
	const [editBaseRate, setEditBaseRate] = useState('');

	useEffect(() => {
		loadCourts();
	}, []);

	async function loadCourts() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('http://localhost:4000/api/admin/courts');
			if (!res.ok) throw new Error('Failed to fetch courts');
			const data = await res.json();
			setCourts(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || 'Error loading courts');
		} finally {
			setLoading(false);
		}
	}

	async function handleAdd(e) {
		e.preventDefault();
		setError(null);
		try {
			const payload = { name, type, baseRatePerHour: Number(baseRate) };
			const res = await fetch('http://localhost:4000/api/admin/courts', {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) {
				const txt = await res.text();
				throw new Error(txt || 'Add failed');
			}
			setName(''); setType('INDOOR'); setBaseRate('');
			await loadCourts();
		} catch (err) {
			setError(err.message || 'Add error');
		}
	}

	function startEdit(court) {
		setEditId(court._id);
		setEditName(court.name || '');
		setEditType(court.type || 'INDOOR');
		setEditBaseRate(String(court.baseRatePerHour ?? ''));
	}

	function cancelEdit() {
		setEditId(null);
		setEditName(''); setEditType('INDOOR'); setEditBaseRate('');
	}

	async function handleUpdate(e) {
		e.preventDefault();
		if (!editId) return;
		setError(null);
		try {
			const payload = { name: editName, type: editType, baseRatePerHour: Number(editBaseRate) };
			const res = await fetch(`http://localhost:4000/api/admin/courts/${editId}`, {
				method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) {
				const txt = await res.text();
				throw new Error(txt || 'Update failed');
			}
			cancelEdit();
			await loadCourts();
		} catch (err) {
			setError(err.message || 'Update error');
		}
	}

	async function handleDelete(id) {
		if (!confirm('Delete/disable this court?')) return;
		setError(null);
		try {
			const res = await fetch(`http://localhost:4000/api/admin/courts/${id}`, { method: 'DELETE' });
			if (!res.ok) {
				const txt = await res.text();
				throw new Error(txt || 'Delete failed');
			}
			await loadCourts();
		} catch (err) {
			setError(err.message || 'Delete error');
		}
	}

	return (
		<div>
			<h2>Courts Admin</h2>

			{error && <div style={{ color: 'red' }}>{error}</div>}

			<div style={{ marginTop: 12, marginBottom: 12 }}>
				<form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
					<select value={type} onChange={(e) => setType(e.target.value)}>
						<option value='INDOOR'>INDOOR</option>
						<option value='OUTDOOR'>OUTDOOR</option>
					</select>
					<input placeholder='Base rate / hr' value={baseRate} onChange={(e) => setBaseRate(e.target.value)} type='number' step='0.01' required />
					<button type='submit'>Add Court</button>
				</form>
			</div>

			{loading ? <div>Loading courts...</div> : (
				<div>
					{courts.length === 0 && <div>No courts yet.</div>}
					{courts.map((c) => (
						<div key={c._id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8, width: 640 }}>
							{editId === c._id ? (
								<form onSubmit={handleUpdate} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
									<input value={editName} onChange={(e) => setEditName(e.target.value)} required />
									<select value={editType} onChange={(e) => setEditType(e.target.value)}>
										<option value='INDOOR'>INDOOR</option>
										<option value='OUTDOOR'>OUTDOOR</option>
									</select>
									<input value={editBaseRate} onChange={(e) => setEditBaseRate(e.target.value)} type='number' step='0.01' required />
									<button type='submit'>Save</button>
									<button type='button' onClick={cancelEdit}>Cancel</button>
								</form>
							) : (
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div>
										<div><strong>{c.name}</strong> ({c.type})</div>
										<div>Active: {String(c.isActive)}</div>
										<div>Base rate / hr: {c.baseRatePerHour}</div>
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
