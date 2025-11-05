const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// --- Routes สำหรับผู้ใช้ทั่วไป ---
// GET /news -> แสดงข่าวทั้งหมด
router.get('/', newsController.getAllNews);

// --- Routes สำหรับ Admin ---
// GET /news/create -> แสดงฟอร์มสร้างข่าว
router.get('/create', newsController.getCreateNews);

// POST /news/create -> รับข้อมูลเพื่อสร้างข่าว
router.post('/create', newsController.postCreateNews);

// GET /news/:id -> แสดงข่าวตาม id ที่ระบุ
// :id คือการบอกว่าตรงนี้จะเป็น dynamic parameter
router.get('/:id', newsController.getNewsById);

// --- Routes สำหรับ Admin ---
// GET /news/create -> แสดงฟอร์มสร้างข่าว
router.get('/create', newsController.getCreateNews);

// POST /news/create -> รับข้อมูลเพื่อสร้างข่าว
router.post('/create', newsController.postCreateNews);

// --- เพิ่ม Routes สำหรับ Edit และ Delete ---
// GET /news/edit/:id -> แสดงฟอร์มแก้ไขข่าว
router.get('/edit/:id', newsController.getEditNews);

// POST /news/edit/:id -> รับข้อมูลเพื่ออัปเดตข่าว
router.post('/edit/:id', newsController.postEditNews);

// POST /news/delete/:id -> ลบข่าว
router.post('/delete/:id', newsController.postDeleteNews);

module.exports = router;