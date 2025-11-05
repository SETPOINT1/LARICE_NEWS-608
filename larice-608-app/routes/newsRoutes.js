// routes/newsRoutes.js

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { isAdmin, isAuth } = require('../middleware/auth'); // <--- นำเข้า Middleware

// --- Routes สำหรับผู้ใช้ทั่วไป ---
// GET /news -> แสดงข่าวทั้งหมด
router.get('/', newsController.getAllNews);

// --- Routes สำหรับ Admin ---
// GET /news/create -> แสดงฟอร์มสร้างข่าว (ป้องกันด้วย isAdmin)
router.get('/create', isAdmin, newsController.getCreateNews);

// POST /news/create -> รับข้อมูลเพื่อสร้างข่าว (ป้องกันด้วย isAdmin)
router.post('/create', isAdmin, newsController.postCreateNews);

// GET /news/edit/:id -> แสดงฟอร์มแก้ไขข่าว (ป้องกันด้วย isAuth เพราะทั้ง user และ admin แก้ได้)
router.get('/edit/:id', isAuth, newsController.getEditNews);

// POST /news/edit/:id -> รับข้อมูลเพื่ออัปเดตข่าว (ป้องกันด้วย isAuth)
router.post('/edit/:id', isAuth, newsController.postEditNews);

// POST /news/delete/:id -> ลบข่าว (ป้องกันด้วย isAuth)
router.post('/delete/:id', isAuth, newsController.postDeleteNews);

// --- Route สำหรับหน้ารายละเอียดข่าว ---
// GET /news/:id -> แสดงข่าวตาม id ที่ระบุ
router.get('/:id', newsController.getNewsById);

module.exports = router;