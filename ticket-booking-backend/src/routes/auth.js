import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { hashPassword } from '../utils/hash.js';

const router = express.Router();

// POST /api/auth/signup
// Body: { username, password, email? }
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    // Check existing username
    const existing = await User.findOne({ username }).exec();
    if (existing) return res.status(409).json({ error: 'username already exists' });

    if (email) {
      const existingEmail = await User.findOne({ email }).exec();
      if (existingEmail) return res.status(409).json({ error: 'email already in use' });
    }

    const hashed = await hashPassword(password);
    const user = new User({ username, email, password: hashed });
    await user.save();

    // Log the user in (establish session)
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'signup succeeded but failed to log in' });
      }

      const userSafe = { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };
      return res.status(201).json({ user: userSafe });
    });
  } catch (err) {
    // Duplicate key errors could be caught here as well
    return res.status(500).json({ error: 'failed to create user', details: err.message });
  }
});

// POST /api/auth/login
// Body: { username, password }
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'authentication failed' });

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      const userSafe = { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt };
      return res.json({ user: userSafe });
    });
  })(req, res, next);
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Passport exposes logout; ensure callback-style to capture errors
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'failed to logout' });

    // destroy session cookie server-side
    req.session?.destroy(() => {
      res.clearCookie('ticket.sid');
      return res.json({ ok: true });
    });
  });
});

// GET /api/auth/me
// Check current session
router.get('/me', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    const userSafe = { 
      id: req.user._id, 
      username: req.user.username, 
      email: req.user.email, 
      createdAt: req.user.createdAt 
    };
    return res.json({ user: userSafe });
  }
  return res.status(401).json({ error: 'not authenticated' });
});

export default router;
