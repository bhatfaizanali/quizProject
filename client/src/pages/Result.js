import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Result() {
  const { state } = useLocation();
  const result = state && state.result;
  if (!result) return <p>No result to show.</p>;

  return (
    <div>
      <h2>Result</h2>
      <p>Score: {result.score} / {result.total}</p>
      <ol>
        {result.answers.map((a, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <div>Question: {String(a.questionId)}</div>
            <div>Your answer: {JSON.stringify(a.value)}</div>
            <div style={{ color: a.isCorrect ? 'green' : 'red' }}>{a.isCorrect ? 'Correct' : 'Incorrect'}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
