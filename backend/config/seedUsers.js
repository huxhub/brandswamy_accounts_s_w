import User from '../models/User.js';

const DEFAULT_USERS = [
  { username: 'admin', password: 'password123' },
  { username: 'owner@demo.test', password: 'password123' },
];

// Creates the default users if they don't already exist. Safe to call on
// every boot — existing users are left untouched.
export const seedDefaultUsers = async () => {
  for (const { username, password } of DEFAULT_USERS) {
    const exists = await User.findOne({ where: { username } });
    if (!exists) {
      await User.create({ username, password });
      console.log(`Seeded default user: ${username}`);
    }
  }
};
