import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dotenv.config();

console.log('--- DIAGNOSTIC SCRIPT ---');
console.log('1. Checking Environment Variables...');
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in your environment variables.');
  console.log('Ensure you have uploaded your .env file to the Hostinger server.');
  process.exit(1);
} else {
  console.log('SUCCESS: MONGO_URI is loaded.');
}

const uri = process.env.MONGO_URI;
// Extract hostname from connection string
let host = '';
try {
  if (uri.startsWith('mongodb+srv://')) {
    host = uri.split('@')[1].split('/')[0].split('?')[0];
  } else {
    host = uri.split('@')[1].split('/')[0];
  }
  console.log(`2. Extracted host to test: ${host}`);
} catch (e) {
  console.error('ERROR: Could not parse host from MONGO_URI.');
  process.exit(1);
}

console.log('3. Resolving host DNS...');
dns.lookup(host, (err, address, family) => {
  if (err) {
    console.error(`ERROR: DNS lookup failed for ${host}:`, err.message);
    console.log('This could mean the database URI is incorrect or the server lacks external DNS access.');
  } else {
    console.log(`SUCCESS: Resolved host to IP ${address}`);
  }

  console.log('4. Attempting to connect to MongoDB with a short timeout...');
  mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then((conn) => {
      console.log(`SUCCESS: Connected successfully to MongoDB Atlas! Host: ${conn.connection.host}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('ERROR: Connection failed with error:', err.message);
      console.log('\n--- RECOMMENDATION ---');
      if (err.message.includes('IP') || err.message.includes('whitelist')) {
        console.log('👉 Solution: Add 0.0.0.0/0 to the IP Access List in your MongoDB Atlas Dashboard.');
      } else {
        console.log('👉 Solution: This timeout usually means Hostinger is blocking outgoing traffic on Port 27017.');
        console.log('   You will need to either ask Hostinger support to open Port 27017 outbound, or deploy the backend to a provider that does not block this port (e.g. Render, Vercel Serverless, Heroku, or Hostinger VPS).');
      }
      process.exit(1);
    });
});
