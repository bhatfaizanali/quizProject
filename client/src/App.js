import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CreateQuiz from './pages/CreateQuiz';
import QuizPlayer from './pages/QuizPlayer';
import Result from './pages/Result';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16, fontFamily: 'Arial, sans-serif' }}>
        <header style={{ marginBottom: 16 }}>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/create" element={<CreateQuiz />} />
          <Route path="/quiz/:id" element={<QuizPlayer />} />
          <Route path="/result/:id" element={<Result />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
