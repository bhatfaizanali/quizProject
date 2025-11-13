import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function QuizPlayer() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.getQuiz(id)
      .then(setQuiz)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function setAnswer(qId, value) {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }

  async function submit() {
    // convert answers object to array of { questionId, value }
    const payload = Object.keys(answers).map(k => ({ questionId: k, value: answers[k] }));
    try {
      const res = await API.submitAttempt(id, payload);
      // Save attempt id or response to show results — here we'll navigate to result and pass the response via state
      navigate(`/result/${id}`, { state: { result: res } });
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <div style={{ display: 'grid', gap: 12 }}>
        {quiz.questions.map(q => (
          <div key={q._id} style={{ padding: 12, border: '1px solid #eee', background: '#fff' }}>
            <div><strong>{q.prompt}</strong></div>
            <div style={{ marginTop: 8 }}>
              {q.type === 'TEXT' && (
                <input value={answers[q._id] || ''} onChange={e => setAnswer(q._id, e.target.value)} />
              )}
              {(q.type === 'MCQ_SINGLE' || q.type === 'TRUE_FALSE') && q.options && q.options.map(opt => (
                <label key={opt.text} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={String(q._id)}
                    onChange={() => setAnswer(q._id, opt._id || opt.text)}
                    checked={String(answers[q._id]) === String(opt._id || opt.text)}
                  /> {opt.text}
                </label>
              ))}
              {q.type === 'MCQ_MULTIPLE' && q.options && q.options.map(opt => (
                <label key={opt.text} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    onChange={e => {
                      const prev = answers[q._id] || [];
                      if (e.target.checked) setAnswer(q._id, [...prev, String(opt._id || opt.text)]);
                      else setAnswer(q._id, prev.filter(x => String(x) !== String(opt._id || opt.text)));
                    }}
                    checked={(answers[q._id] || []).some(x => String(x) === String(opt._id || opt.text))}
                  /> {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
}
