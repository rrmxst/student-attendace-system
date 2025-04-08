const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { Parser } = require('json2csv');

// POST: Admin Login (Simple password check)
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// GET: Export Attendance as CSV
router.get('/export', async (req, res) => {
  try {
    const records = await Attendance.find().lean();
    const parser = new Parser({ fields: ['rollNumber', 'timestamp'] });
    const csv = parser.parse(records);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating CSV" });
  }
});

module.exports = router;
