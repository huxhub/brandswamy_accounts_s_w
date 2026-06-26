import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['company', 'overdraft'], required: true },
  openingBalance: { type: Number, required: true, default: 0 },
  color: { type: String, default: '#1e3a5f' },
  bgColor: { type: String, default: '#e8edf5' }
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);

export default Account;
