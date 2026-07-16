import './config/env.js';
import connectDB from './config/db.js';
import User from './models/User.js';

const seedUser = async () => {
  try {
    await connectDB();

    // Seed admin user
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const adminUser = await User.create({
        username: 'admin',
        password: 'password123'
      });
      console.log(`Successfully created admin user: ${adminUser.username} with password: password123`);
    } else {
      console.log('Admin user already exists!');
    }

    // Seed owner@demo.test user
    const ownerExists = await User.findOne({ where: { username: 'owner@demo.test' } });
    if (!ownerExists) {
      const ownerUser = await User.create({
        username: 'owner@demo.test',
        password: 'password123'
      });
      console.log(`Successfully created owner user: ${ownerUser.username} with password: password123`);
    } else {
      console.log('Owner user already exists!');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUser();
