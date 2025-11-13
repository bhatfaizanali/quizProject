import React from 'react';
import { Link } from 'react-router-dom';

export default function QuizCard({ quiz }) {
  return (
    <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff' }}>
      <h3 style={{ margin: '0 0 6px 0' }}>{quiz.title}</h3>
      <div style={{ color: '#6b7280', fontSize: 13 }}>{quiz.description}</div>
      <div style={{ marginTop: 8 }}>
        <Link to={`/quiz/${quiz._id}`}>Take Quiz</Link>
      </div>
    </div>
  );
}
