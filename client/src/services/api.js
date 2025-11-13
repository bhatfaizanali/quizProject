import { getAdminPassword } from './auth';

const API = {
  async listQuizzes() {
    const res = await fetch('/api/quizzes');
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
  },

  async getQuiz(id) {
    const res = await fetch(`/api/quizzes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch quiz');
    return res.json();
  },

  async createQuiz(payload) {
    const headers = { 'Content-Type': 'application/json' };
    const adminPw = getAdminPassword();
    if (adminPw) headers['x-admin-password'] = adminPw;
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Create quiz failed: ${res.status} ${text}`);
    }
    return res.json();
  },

  async listAllQuizzesAdmin() {
    const headers = {};
    const adminPw = getAdminPassword();
    if (adminPw) headers['x-admin-password'] = adminPw;
    const res = await fetch('/api/quizzes/admin', { headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Admin list failed: ${res.status} ${text}`);
    }
    return res.json();
  },

  async submitAttempt(id, answers) {
    const res = await fetch(`/api/quizzes/${id}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Submit attempt failed: ${res.status} ${text}`);
    }
    return res.json();
  }
};

export default API;
