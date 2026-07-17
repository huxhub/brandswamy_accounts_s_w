import './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { seedDefaultUsers } from './config/seedUsers.js';
import accountRoutes from './routes/accountRoutes.js';

// Connect to MySQL, then ensure the default users exist before accepting traffic.
await connectDB();
await seedDefaultUsers();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// `origin: true` reflects the request's own Origin header, which is required
// for cookies to be sent cross-site (credentialed CORS can't use a wildcard '*').
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
// Increase payload limit for document uploads (e.g. data URLs)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

import authRoutes from './routes/authRoutes.js';
import { protect } from './middleware/authMiddleware.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', protect, accountRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Accounts Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
