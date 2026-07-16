import './config/env.js';
import connectDB from './config/db.js';
import Account from './models/Account.js';
import Transaction from './models/Transaction.js';

const clearDB = async () => {
  try {
    await connectDB();
    await Transaction.destroy({ where: {}, truncate: true });
    await Account.destroy({ where: {}, truncate: true });
    console.log('All accounts and transactions have been successfully removed from the database!');

    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error.message);
    process.exit(1);
  }
};

clearDB();
