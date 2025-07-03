const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String // e.g., "A", "B+", etc. (optional)
  },
  remarks: {
    type: String // optional remarks (optional)
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);
