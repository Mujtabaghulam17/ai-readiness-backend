const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

router.post('/', async (req, res) => {
  try {
    const { email, answers, average } = req.body;
    const result = new Result({ email, answers, average });
    await result.save();
    res.status(201).json({ message: 'Result saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving result', error });
  }
});

module.exports = router;
