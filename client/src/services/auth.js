// Simple auth helper storing admin password in localStorage (MVP only)
const KEY = 'quiz_admin_password';

export function saveAdminPassword(pw) {
  if (typeof window !== 'undefined' && pw) localStorage.setItem(KEY, pw);
}

export function getAdminPassword() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY);
}

export function clearAdminPassword() {
  if (typeof window !== 'undefined') localStorage.removeItem(KEY);
}
