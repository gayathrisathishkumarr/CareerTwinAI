import crypto from 'crypto';
import UserModel from '../models/userModel.js';

const AUTH_SECRET = process.env.AUTH_SECRET || 'careertwin-dev-secret-change-me';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const b64url = (str) => Buffer.from(str).toString('base64url');

const signToken = (user) => {
  const payload = b64url(JSON.stringify({
    email: user.email,
    name: user.name,
    exp: Date.now() + TOKEN_TTL_MS
  }));
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
};

export const verifyToken = (token) => {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, consent } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Name, email, and password are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ status: 'fail', message: 'Please enter a valid email address.' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ status: 'fail', message: 'Password must be at least 8 characters.' });
    }
    // DPDP/GDPR: processing resume data requires explicit consent, recorded with a timestamp
    if (consent !== true) {
      return res.status(400).json({ status: 'fail', message: 'You must consent to the Privacy Policy to create an account.' });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ status: 'fail', message: 'An account with this email already exists.' });
    }

    const user = await UserModel.create({ name: String(name).trim(), email, password });
    res.status(201).json({
      status: 'success',
      data: { token: signToken(user), user: { name: user.name, email: user.email } }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Email and password are required.' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user || !UserModel.verifyPassword(user, password)) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password.' });
    }

    res.status(200).json({
      status: 'success',
      data: { token: signToken(user), user: { name: user.name, email: user.email } }
    });
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const data = verifyToken(token);
  if (!data) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired session.' });
  }
  res.status(200).json({ status: 'success', data: { user: { name: data.name, email: data.email } } });
};
