import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reference: {
    type: String
  },
  dueDate: {
    type: String
  },
  exchangeType: {
    type: String
  },
  document: {
    name: String,
    dataUrl: String,
    mimeType: String,
    size: Number
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
