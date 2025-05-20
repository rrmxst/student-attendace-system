const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  name: String,
  roll: String,
  time: {
    type: Date,
    default: Date.now, // saves timestamp
  },
  scannerId: {
    type: String,
    default: "default", // tracks which device scanned it
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
