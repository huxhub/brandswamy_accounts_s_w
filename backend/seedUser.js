import './config/env.js';
import connectDB from './config/db.js';
import { seedDefaultUsers } from './config/seedUsers.js';

try {
  await connectDB();
  await seedDefaultUsers();
  process.exit();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
