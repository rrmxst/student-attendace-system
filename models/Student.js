const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  rollNumber: {
    type: String,
    unique: true,
    required: true
  },
});

module.exports = mongoose.model('Student', StudentSchema);