const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { Parser } = require('json2csv');

// ✅ POST: Mark attendance
router.post('/mark', async (req, res) => {
  const { name, rollNumber, scannerId } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: "Invalid QR code" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alreadyMarked = await Attendance.findOne({
    rollNumber,
    date: { $gte: today }
  });

  if (alreadyMarked) {
    return res.status(400).json({ message: "Already marked today" });
  }

  const attendance = await Attendance.create({
    name,
    rollNumber,
    scannerId: scannerId || "default",
    timestamp: new Date()
  });

  res.json({ message: "Attendance marked successfully", attendance });
});

// ✅ GET: Fetch all attendance records
router.get('/all', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET: Export attendance data as CSV (by scannerId)
router.get('/export', async (req, res) => {
  const scannerId = req.query.scannerId || "default";

  try {
    const records = await Attendance.find({ scannerId }).lean();

    const formattedRecords = records.map(record => {
      const dateObj = new Date(record.timestamp);
      const time = dateObj.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
      const date = dateObj.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY

      return {
        name: record.name || "",
        rollNumber: record.rollNumber,
        time,
        date,
        scannerId: record.scannerId
      };
    });

    const fields = ['name', 'rollNumber', 'time', 'date', 'scannerId'];
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedRecords);

    const filename = `${scannerId}_attendance.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export CSV", error: err.message });
  }
});


module.exports = router;
