const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['Cash', 'Card', 'Online'],
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Paid'
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
