import React, { useEffect, useState } from 'react';
import API from '../services/api';
import QuizCard from '../components/QuizCard';

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.listQuizzes()
      .then(setQuizzes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Published Quizzes</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {quizzes.map(q => (
          <QuizCard key={q._id} quiz={q} />
        ))}
      </div>
    </div>
  );
}
