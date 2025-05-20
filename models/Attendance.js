const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  name: String, // ✅ Add this
  rollNumber: String,
  timestamp: { type: Date, default: Date.now },
  date: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }
  },
  scannerId: String
});

module.exports = mongoose.model('Attendance', attendanceSchema);
