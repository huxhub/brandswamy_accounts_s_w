import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all accounts with their corresponding transactions
// @route   GET /api/accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({});
    const transactions = await Transaction.find({});

    // Map _id to id for frontend compatibility and embed transactions
    const formattedAccounts = accounts.map(acc => {
      const accTxList = transactions.filter(tx => tx.accountId.toString() === acc._id.toString());
      const formattedTxs = accTxList.map(tx => ({
        id: tx._id,
        companyName: tx.companyName,
        date: tx.date,
        description: tx.description,
        type: tx.type,
        amount: tx.amount,
        reference: tx.reference,
        document: tx.document,
        dueDate: tx.dueDate,
        exchangeType: tx.exchangeType,
        createdAt: tx.createdAt
      }));
      return {
        id: acc._id,
        name: acc.name,
        type: acc.type,
        openingBalance: acc.openingBalance,
        color: acc.color,
        bgColor: acc.bgColor,
        transactions: formattedTxs,
        createdAt: acc.createdAt
      };
    });
    res.json(formattedAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new account
// @route   POST /api/accounts
export const createAccount = async (req, res) => {
  try {
    const { name, type, color, bgColor, openingBalance } = req.body;
    
    const account = new Account({
      name: name || 'New Company',
      type: type || 'company',
      color: color || '#1e3a5f',
      bgColor: bgColor || '#e8edf5',
      openingBalance: openingBalance || 0
    });

    const createdAccount = await account.save();
    res.status(201).json({
      id: createdAccount._id,
      name: createdAccount.name,
      type: createdAccount.type,
      openingBalance: createdAccount.openingBalance,
      color: createdAccount.color,
      bgColor: createdAccount.bgColor,
      transactions: [],
      createdAt: createdAccount.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update account details (e.g. name)
// @route   PUT /api/accounts/:id
export const updateAccount = async (req, res) => {
  try {
    const { name } = req.body;
    const account = await Account.findById(req.params.id);

    if (account) {
      if (name) account.name = name;
      
      const updatedAccount = await account.save();
      res.json(updatedAccount);
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update account opening balance
// @route   PUT /api/accounts/:id/balance
export const updateOpeningBalance = async (req, res) => {
  try {
    const { openingBalance } = req.body;
    const account = await Account.findById(req.params.id);

    if (account) {
      account.openingBalance = openingBalance;
      const updatedAccount = await account.save();
      res.json(updatedAccount);
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add transaction
// @route   POST /api/accounts/:id/transactions
export const addTransaction = async (req, res) => {
  try {
    const { date, description, type, amount, reference, document, dueDate, exchangeType } = req.body;
    const account = await Account.findById(req.params.id);

    if (account) {
      const transaction = new Transaction({
        accountId: req.params.id,
        companyName: account.name,
        date,
        description,
        type,
        amount: Number(amount),
        reference,
        document,
        dueDate,
        exchangeType
      });

      await transaction.save();
      
      res.status(201).json({
        id: transaction._id,
        companyName: transaction.companyName,
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount,
        reference: transaction.reference,
        document: transaction.document,
        dueDate: transaction.dueDate,
        exchangeType: transaction.exchangeType,
        createdAt: transaction.createdAt
      });
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/accounts/:id/transactions/:txId
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.txId);

    if (transaction) {
      res.json({ message: 'Transaction removed' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create initial accounts if empty
// @route   POST /api/accounts/seed
export const seedAccounts = async (req, res) => {
  try {
    const count = await Account.countDocuments({});
    if (count === 0) {
      const initialAccounts = [
        { name: "Company 1", type: "company", color: "#1e3a5f", bgColor: "#e8edf5", openingBalance: 125000 },
        { name: "Company 2", type: "company", color: "#065f46", bgColor: "#d1fae5", openingBalance: 89500 },
        { name: "Company 3", type: "company", color: "#7c2d12", bgColor: "#fef3c7", openingBalance: 210000 },
        { name: "Company 4", type: "company", color: "#4c1d95", bgColor: "#ede9fe", openingBalance: 55000 },
        { name: "Overdraft Account", type: "overdraft", color: "#9f1239", bgColor: "#ffe4e6", openingBalance: -45000 }
      ];
      await Account.insertMany(initialAccounts);
      res.json({ message: 'Database seeded successfully' });
    } else {
      res.json({ message: 'Database already has data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all accounts and transactions from DB
// @route   DELETE /api/accounts/clear
export const clearAccounts = async (req, res) => {
  try {
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    res.json({ message: 'All database records cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
