import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isProduction = process.env.NODE_ENV === 'production';

// Generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Cross-site (e.g. Vercel frontend -> Render backend) requires SameSite=None + Secure;
// localhost dev is not HTTPS, so it needs Lax + non-Secure instead.
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { username } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      password
    });

    if (user) {
      setTokenCookie(res, generateToken(user.id));
      res.status(201).json({
        _id: user.id,
        username: user.username,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user email
    const user = await User.findOne({ where: { username } });

    if (user && (await user.matchPassword(password))) {
      setTokenCookie(res, generateToken(user.id));
      res.json({
        _id: user.id,
        username: user.username,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log out the current user
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
  res.json({ message: 'Logged out' });
};

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
export const getMe = (req, res) => {
  res.json({
    _id: req.user.id,
    username: req.user.username,
  });
};
