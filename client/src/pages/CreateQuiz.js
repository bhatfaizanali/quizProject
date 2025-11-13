import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [qPrompt, setQPrompt] = useState('');
  const [qType, setQType] = useState('MCQ_SINGLE');
  const [qOptions, setQOptions] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function addQuestion() {
    const opts = qOptions.split('|').map(s => s.trim()).filter(Boolean).map((t, i) => ({ text: t, isCorrect: i === 0 }));
    const q = { prompt: qPrompt, type: qType, options: opts, order: questions.length + 1 };
    setQuestions([...questions, q]);
    setQPrompt('');
    setQOptions('');
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const payload = { title, description, published, questions };
      const res = await API.createQuiz(payload);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Create Quiz</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
        <label>Title
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label>Description
          <input value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label>Published
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
        </label>

        <fieldset style={{ border: '1px solid #ddd', padding: 8 }}>
          <legend>Add question</legend>
          <label>Prompt
            <input value={qPrompt} onChange={e => setQPrompt(e.target.value)} />
          </label>
          <label>Type
            <select value={qType} onChange={e => setQType(e.target.value)}>
              <option value="MCQ_SINGLE">MCQ (single)</option>
              <option value="MCQ_MULTIPLE">MCQ (multiple)</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="TEXT">Text</option>
            </select>
          </label>
          <label>Options (pipe-separated, first option marked correct)
            <input value={qOptions} onChange={e => setQOptions(e.target.value)} placeholder="e.g. 4|3|2" />
          </label>
          <button type="button" onClick={addQuestion}>Add Question</button>
        </fieldset>

        <div>
          <h4>Questions</h4>
          <ol>
            {questions.map((q, i) => (
              <li key={i}>{q.prompt} ({q.type})</li>
            ))}
          </ol>
        </div>

        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
}
