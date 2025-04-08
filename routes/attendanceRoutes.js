const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

router.post('/mark', async (req, res) => {
  const { rollNumber } = req.body;
  if (!rollNumber) return res.status(400).json({ message: "Invalid QR code" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alreadyMarked = await Attendance.findOne({
    rollNumber,
    date: { $gte: today }
  });

  if (alreadyMarked) {
    return res.status(400).json({ message: "Already marked today" });
  }

  const attendance = await Attendance.create({ rollNumber });
  res.json({ message: "Attendance marked successfully", attendance });
});

module.exports = router;