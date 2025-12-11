import React, { useEffect, useState } from 'react';

export default function EquipmentAdmin() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Add form
	const [name, setName] = useState('');
	const [type, setType] = useState('RACKET');
	const [stock, setStock] = useState('');
	const [pricePerUnit, setPricePerUnit] = useState('');

	// Edit state
	const [editId, setEditId] = useState(null);
	const [editName, setEditName] = useState('');
	const [editType, setEditType] = useState('RACKET');
	const [editStock, setEditStock] = useState('');
	const [editPricePerUnit, setEditPricePerUnit] = useState('');

	useEffect(() => { loadItems(); }, []);

	async function loadItems() {
		setLoading(true); setError(null);
		try {
			const res = await fetch('http://localhost:4000/api/admin/equipment');
			if (!res.ok) throw new Error('Failed to fetch equipment');
			const data = await res.json();
			setItems(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || 'Error loading equipment');
		} finally { setLoading(false); }
	}

	async function handleAdd(e) {
		e.preventDefault(); setError(null);
		try {
			const payload = { name, type, stock: Number(stock), pricePerUnit: Number(pricePerUnit) };
			const res = await fetch('http://localhost:4000/api/admin/equipment', {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) {
				const txt = await res.text(); throw new Error(txt || 'Add failed');
			}
			setName(''); setType('RACKET'); setStock(''); setPricePerUnit('');
			await loadItems();
		} catch (err) { setError(err.message || 'Add error'); }
	}

	function startEdit(item) {
		setEditId(item._id);
		setEditName(item.name || '');
		setEditType(item.type || 'RACKET');
		setEditStock(String(item.stock ?? ''));
		setEditPricePerUnit(String(item.pricePerUnit ?? ''));
	}

	function cancelEdit() {
		setEditId(null); setEditName(''); setEditType('RACKET'); setEditStock(''); setEditPricePerUnit('');
	}

	async function handleUpdate(e) {
		e.preventDefault(); if (!editId) return; setError(null);
		try {
			const payload = { name: editName, type: editType, stock: Number(editStock), pricePerUnit: Number(editPricePerUnit) };
			const res = await fetch(`http://localhost:4000/api/admin/equipment/${editId}`, {
				method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Update failed'); }
			cancelEdit(); await loadItems();
		} catch (err) { setError(err.message || 'Update error'); }
	}

	async function handleDelete(id) {
		if (!confirm('Delete/disable this equipment item?')) return;
		setError(null);
		try {
			const res = await fetch(`http://localhost:4000/api/admin/equipment/${id}`, { method: 'DELETE' });
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Delete failed'); }
			await loadItems();
		} catch (err) { setError(err.message || 'Delete error'); }
	}

	return (
		<div>
			<h2>Equipment Admin</h2>
			{error && <div style={{ color: 'red' }}>{error}</div>}

			<div style={{ marginTop: 12, marginBottom: 12 }}>
				<form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
					<select value={type} onChange={(e) => setType(e.target.value)}>
						<option value='RACKET'>RACKET</option>
						<option value='SHOES'>SHOES</option>
					</select>
					<input placeholder='Stock' value={stock} onChange={(e) => setStock(e.target.value)} type='number' required />
					<input placeholder='Price per unit' value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} type='number' step='0.01' required />
					<button type='submit'>Add Item</button>
				</form>
			</div>

			{loading ? <div>Loading equipment...</div> : (
				<div>
					{items.length === 0 && <div>No equipment yet.</div>}
					{items.map((it) => (
						<div key={it._id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8, width: 640 }}>
							{editId === it._id ? (
								<form onSubmit={handleUpdate} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
									<input value={editName} onChange={(e) => setEditName(e.target.value)} required />
									<select value={editType} onChange={(e) => setEditType(e.target.value)}>
										<option value='RACKET'>RACKET</option>
										<option value='SHOES'>SHOES</option>
									</select>
									<input value={editStock} onChange={(e) => setEditStock(e.target.value)} type='number' required />
									<input value={editPricePerUnit} onChange={(e) => setEditPricePerUnit(e.target.value)} type='number' step='0.01' required />
									<button type='submit'>Save</button>
									<button type='button' onClick={cancelEdit}>Cancel</button>
								</form>
							) : (
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div>
										<div><strong>{it.name}</strong> ({it.type})</div>
										<div>Stock: {it.stock}</div>
										<div>Price: {it.pricePerUnit}</div>
										<div>Active: {String(it.isActive)}</div>
									</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<button onClick={() => startEdit(it)}>Edit</button>
										<button onClick={() => handleDelete(it._id)}>Delete</button>
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
