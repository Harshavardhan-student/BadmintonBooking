import React, { useEffect, useState } from 'react';

const TYPES = ['peak_hours', 'weekend', 'indoor_premium', 'custom'];

export default function PricingRulesAdmin() {
	const [rules, setRules] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// form state
	const [type, setType] = useState('peak_hours');
	const [isActive, setIsActive] = useState(true);
	const [configText, setConfigText] = useState('{}');

	// edit state
	const [editId, setEditId] = useState(null);
	const [editType, setEditType] = useState('peak_hours');
	const [editIsActive, setEditIsActive] = useState(true);
	const [editConfigText, setEditConfigText] = useState('{}');

	useEffect(() => { loadRules(); }, []);

	async function loadRules() {
		setLoading(true); setError(null);
		try {
			const res = await fetch('http://localhost:4000/api/admin/pricing-rules');
			if (!res.ok) throw new Error('Failed to load pricing rules');
			const data = await res.json();
			setRules(Array.isArray(data) ? data : []);
		} catch (err) { setError(err.message || 'Load error'); }
		finally { setLoading(false); }
	}

	function safeParse(jsonText) {
		try { return { ok: true, value: JSON.parse(jsonText) }; }
		catch (err) { return { ok: false, error: err.message }; }
	}

	async function handleAdd(e) {
		e.preventDefault(); setError(null);
		const parsed = safeParse(configText);
		if (!parsed.ok) { setError('Config JSON parse error: ' + parsed.error); return; }
		try {
			const payload = { ruleType: type, config: parsed.value, isActive };
			const res = await fetch('http://localhost:4000/api/admin/pricing-rules', {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Add failed'); }
			setType('peak_hours'); setIsActive(true); setConfigText('{}');
			await loadRules();
		} catch (err) { setError(err.message || 'Add error'); }
	}

	function startEdit(rule) {
		setEditId(rule._id);
		setEditType(rule.ruleType || 'peak_hours');
		setEditIsActive(Boolean(rule.isActive));
		setEditConfigText(rule.config ? JSON.stringify(rule.config, null, 2) : '{}');
	}

	function cancelEdit() {
		setEditId(null); setEditType('peak_hours'); setEditIsActive(true); setEditConfigText('{}');
	}

	async function handleUpdate(e) {
		e.preventDefault(); if (!editId) return; setError(null);
		const parsed = safeParse(editConfigText);
		if (!parsed.ok) { setError('Config JSON parse error: ' + parsed.error); return; }
		try {
			const payload = { ruleType: editType, config: parsed.value, isActive: editIsActive };
			const res = await fetch(`http://localhost:4000/api/admin/pricing-rules/${editId}`, {
				method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
			});
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Update failed'); }
			cancelEdit(); await loadRules();
		} catch (err) { setError(err.message || 'Update error'); }
	}

	async function handleDelete(id) {
		if (!confirm('Delete this pricing rule?')) return;
		setError(null);
		try {
			const res = await fetch(`http://localhost:4000/api/admin/pricing-rules/${id}`, { method: 'DELETE' });
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Delete failed'); }
			await loadRules();
		} catch (err) { setError(err.message || 'Delete error'); }
	}

	async function toggleActive(rule) {
		setError(null);
		try {
			const res = await fetch(`http://localhost:4000/api/admin/pricing-rules/${rule._id}`, {
				method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !rule.isActive })
			});
			if (!res.ok) { const txt = await res.text(); throw new Error(txt || 'Toggle failed'); }
			await loadRules();
		} catch (err) { setError(err.message || 'Toggle error'); }
	}

	return (
		<div>
			<h2>Pricing Rules Admin</h2>
			{error && <div style={{ color: 'red' }}>{error}</div>}

			<div style={{ marginTop: 12, marginBottom: 12 }}>
				<form onSubmit={handleAdd} style={{ display: 'block', gap: 8 }}>
					<div>
						<label>Type: </label>
						<select value={type} onChange={(e) => setType(e.target.value)}>
							{TYPES.map(t => <option key={t} value={t}>{t}</option>)}
						</select>
					</div>
					<div>
						<label>Active: <input type='checkbox' checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /></label>
					</div>
					<div>
						<label>Config (JSON):</label>
						<br />
						<textarea value={configText} onChange={(e) => setConfigText(e.target.value)} rows={6} cols={60} />
					</div>
					<div style={{ marginTop: 8 }}>
						<button type='submit'>Add Rule</button>
					</div>
				</form>
			</div>

			{loading ? <div>Loading rules...</div> : (
				<div>
					{rules.length === 0 && <div>No pricing rules yet.</div>}
					{rules.map((r) => (
						<div key={r._id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8, width: 800 }}>
							{editId === r._id ? (
								<form onSubmit={handleUpdate}>
									<div>
										<label>Type: </label>
										<select value={editType} onChange={(e) => setEditType(e.target.value)}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
									</div>
									<div>
										<label>Active: <input type='checkbox' checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} /></label>
									</div>
									<div>
										<label>Config (JSON):</label>
										<br />
										<textarea value={editConfigText} onChange={(e) => setEditConfigText(e.target.value)} rows={6} cols={60} />
									</div>
									<div style={{ marginTop: 8 }}>
										<button type='submit'>Save</button>
										<button type='button' onClick={cancelEdit}>Cancel</button>
									</div>
								</form>
							) : (
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div>
										<div><strong>{r.ruleType}</strong> — Active: {String(r.isActive)}</div>
										<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(r.config, null, 2)}</pre>
									</div>
									<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
										<button onClick={() => startEdit(r)}>Edit</button>
										<button onClick={() => handleDelete(r._id)}>Delete</button>
										<button onClick={() => toggleActive(r)}>{r.isActive ? 'Disable' : 'Enable'}</button>
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
