require('dotenv').config();

// Minimal admin auth middleware.
// Checks for header 'x-admin-password' equal to ADMIN_PASSWORD env var.
// This is intentionally simple for MVP. Do NOT use in production.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpass';

function requireAdmin(req, res, next) {
  const pass = req.get('x-admin-password');
  if (!pass || pass !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized - admin password required' });
  }
  return next();
}

module.exports = { requireAdmin };
