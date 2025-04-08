const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Student = require('../models/Student');

router.post('/register', async (req, res) => {
  try {
    const { name, rollNumber } = req.body;
    const existing = await Student.findOne({ rollNumber });
    if (existing) return res.status(400).json({ error: "Student already registered" });

    const newStudent = await Student.create({ name, rollNumber });
    const qrCode = await QRCode.toDataURL(rollNumber);
    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;