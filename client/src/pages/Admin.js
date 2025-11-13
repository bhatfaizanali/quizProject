import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminPassword, clearAdminPassword } from '../services/auth';
import API from '../services/api';

export default function Admin() {
  const [adminQuizzes, setAdminQuizzes] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = !!getAdminPassword();

  async function loadAdminQuizzes() {
    setError(null);
    try {
      const data = await API.listAllQuizzesAdmin();
      setAdminQuizzes(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    clearAdminPassword();
    navigate('/admin');
    setAdminQuizzes(null);
  }

  return (
    <div>
      <h2>Admin</h2>
      {!isLoggedIn && (
        <div>
          <p>You are not logged in as admin.</p>
          <Link to="/admin/login">Login as Admin</Link>
        </div>
      )}

      {isLoggedIn && (
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/admin/create">Create Quiz</Link>
            <button onClick={loadAdminQuizzes}>Load all quizzes</button>
            <button onClick={logout}>Logout</button>
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          {adminQuizzes && (
            <div style={{ marginTop: 12 }}>
              <h3>All Quizzes</h3>
              <ul>
                {adminQuizzes.map(q => (
                  <li key={q._id}><strong>{q.title}</strong> — published: {String(q.published)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p>Admin is minimal for MVP. Creating a quiz will POST to the server API with the admin header.</p>
    </div>
  );
}
