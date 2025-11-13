import React, { useState } from 'react';
import { saveAdminPassword, getAdminPassword } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [password, setPassword] = useState(getAdminPassword() || '');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (!password) return setMsg('Password required');
    saveAdminPassword(password);
    setMsg('Saved admin password.');
    setTimeout(() => navigate('/admin'), 500);
  }

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <label>Admin Password
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
        </label>
        {msg && <div style={{ color: 'green' }}>{msg}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Save & continue</button>
        </div>
      </form>
    </div>
  );
}
