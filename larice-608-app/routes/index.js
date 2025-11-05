// routes/index.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route สำหรับหน้า Home
router.get('/', (req, res) => {
  // เราจะส่งตัวแปร title ไปให้ EJS template
  res.render('index', { title: 'Home - Larice @608' });
});

// --- เพิ่ม Routes สำหรับ Register ---
// แสดงหน้าฟอร์มสมัครสมาชิก
router.get('/register', authController.getRegister);

// รับข้อมูลจากฟอร์มเพื่อสมัครสมาชิก
router.post('/register', authController.postRegister);

// --- เพิ่ม Routes สำหรับ Login ---
// แสดงหน้าฟอร์มล็อกอิน
router.get('/login', authController.getLogin);

// รับข้อมูลจากฟอร์มเพื่อล็อกอิน
router.post('/login', authController.postLogin);

// --- เพิ่ม Route สำหรับ Logout ---
router.post('/logout', authController.postLogout);

module.exports = router;