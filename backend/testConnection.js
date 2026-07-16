import './config/env.js';
import { sequelize } from './config/db.js';

console.log('--- DIAGNOSTIC SCRIPT ---');
console.log('1. Checking Environment Variables...');
const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.log(`WARNING: ${missing.join(', ')} not set, falling back to defaults.`);
} else {
  console.log('SUCCESS: DB connection variables are loaded.');
}

console.log(`2. Target: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'accounts_management'}`);

console.log('3. Attempting to connect to MySQL...');
sequelize
  .authenticate()
  .then(() => {
    console.log('SUCCESS: Connected successfully to MySQL!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR: Connection failed with error:', err.message);
    console.log('\n--- RECOMMENDATION ---');
    console.log('👉 Check that MySQL is running and DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME are correct.');
    process.exit(1);
  });
