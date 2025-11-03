// routes/index.js

const express = require('express');
const router = express.Router();

// Route สำหรับหน้า Home
router.get('/', (req, res) => {
  // เราจะส่งตัวแปร title ไปให้ EJS template
  res.render('index', { title: 'Home - Larice @608' });
});

module.exports = router;