import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { seedDefaultUsers } from './config/seedUsers.js';
import accountRoutes from './routes/accountRoutes.js';

// Connect to MySQL, then ensure the default users exist before accepting traffic.
try {
  await connectDB();
  await seedDefaultUsers();
} catch (err) {
  console.error('[Server Startup Warning]: Database initialization failed:', err.message);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Behind a reverse proxy (Render, nginx, etc.) so rate limiting and secure
// cookies see the real client IP/protocol instead of the proxy's.
app.set('trust proxy', 1);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://brandswamy.uxhub.in',
  'http://brandswamy.uxhub.in',
  'https://brandswamy-as-bd.uxhub.in',
  'http://brandswamy-as-bd.uxhub.in',
  'https://brandsway.uxhub.in',
  'http://brandsway.uxhub.in',
  'https://chisel.uxhub.in',
  'http://chisel.uxhub.in',
];

const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const hostname = new URL(origin).hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === 'uxhub.in' ||
      hostname.endsWith('.uxhub.in')
    ) {
      return true;
    }
  } catch {
    // Ignore URL parse error
  }
  return false;
};

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS Blocked Origin]: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(cookieParser());
// Increase payload limit for document uploads (e.g. data URLs)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// General API rate limit as defense-in-depth; login/register have a tighter limit.
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
}));

import authRoutes from './routes/authRoutes.js';
import programRoutes from './routes/programRoutes.js';
import { protect } from './middleware/authMiddleware.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', protect, accountRoutes);
app.use('/api/programs', protect, programRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Accounts Management API is running...');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Brandswamy API is running' });
});

// Keeps error responses (e.g. CORS rejections) JSON like the rest of the API,
// and avoids Express's default HTML error page.
app.use((err, _req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
