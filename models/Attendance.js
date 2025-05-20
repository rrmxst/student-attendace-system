const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  scannerId: { type: String, default: 'default' }, // ✅ Add this
  timestamp: { type: Date, default: Date.now },    // ✅ Add this
  date: { type: Date, default: () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }}
});

module.exports = mongoose.model('Attendance', attendanceSchema);
