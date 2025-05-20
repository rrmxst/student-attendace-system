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
router.get("/export", async (req, res) => {
  const scannerId = req.query.scannerId || "default";

  try {
    const data = await Attendance.find({ scannerId });

    const csv = parse(data, {
      fields: ["name", "roll", "time", "scannerId"],
    });

    const fileName = `${scannerId}_attendance.csv`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "text/csv");

    res.status(200).end(csv);
  } catch (err) {
    res.status(500).json({ message: "Error exporting attendance", err });
  }
});


module.exports = router;
