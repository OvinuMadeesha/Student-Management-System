const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  payment: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Course', courseSchema);
