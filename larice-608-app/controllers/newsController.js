const { Op } = require('sequelize');
const News = require('../models/News');

// --- ส่วนของ Admin ---

// แสดงหน้าฟอร์มสำหรับสร้างข่าวใหม่
exports.getCreateNews = (req, res) => {
  // ในอนาคตเราจะเพิ่ม middleware ตรวจสอบว่าเป็น admin หรือไม่
  res.render('admin/create-news', {
    title: 'Create News Post',
    path: '/admin/create-news' // สำหรับ active menu ในอนาคต
  });
};

// รับข้อมูลจากฟอร์มเพื่อสร้างข่าว
exports.postCreateNews = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const user = req.session.user; // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่จาก session

    // สร้างข่าวใหม่ในฐานข้อมูล
    await News.create({
      title,
      content,
      category,
      authorId: user.id,
      authorName: user.firstName // สมมติว่าใช้ชื่อจริงเป็นชื่อผู้เขียน
    });

    // หลังจากสร้างเสร็จ ให้ redirect ไปที่หน้า news list (ที่เรากำลังจะสร้าง)
    res.redirect('/news');

  } catch (error) {
    console.error(error);
    // ควรมีหน้าแสดงผล error ที่ดีกว่านี้ในอนาคต
    res.redirect('/');
  }
  
};

// แสดงหน้าฟอร์มสำหรับแก้ไขข่าว
exports.getEditNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await News.findByPk(newsId);

    if (!news) {
      return res.redirect('/news');
    }

    // **Security Check:** ตรวจสอบว่าผู้ใช้ที่ล็อกอินอยู่เป็นเจ้าของโพสต์หรือไม่
    // ในอนาคตจะเปลี่ยนเป็นเช็คว่าเป็น Admin หรือไม่
    if (news.authorId !== req.session.user.id) {
      return res.redirect('/news'); // ถ้าไม่ใช่เจ้าของ ให้กลับไปหน้า news
    }

    res.render('admin/edit-news', {
      title: 'Edit News',
      path: '/admin/edit-news',
      newsItem: news
    });
  } catch (error) {
    console.error(error);
    res.redirect('/news');
  }
};

// รับข้อมูลจากฟอร์มเพื่ออัปเดตข่าว
exports.postEditNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const { title, category, content } = req.body;

    const news = await News.findByPk(newsId);

    if (!news) {
      return res.redirect('/news');
    }

    // **Security Check:**
    if (news.authorId !== req.session.user.id) {
      return res.redirect('/news');
    }

    // อัปเดตข้อมูล
    news.title = title;
    news.category = category;
    news.content = content;

    await news.save(); // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล

    res.redirect(`/news/${newsId}`); // กลับไปที่หน้ารายละเอียดข่าวที่เพิ่งแก้ไข
  } catch (error) {
    console.error(error);
    res.redirect('/news');
  }
};

// จัดการการลบข่าว
exports.postDeleteNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await News.findByPk(newsId);

    if (!news) {
      return res.redirect('/news');
    }

    // **Security Check:**
    if (news.authorId !== req.session.user.id) {
      return res.redirect('/news');
    }

    await news.destroy(); // ลบข้อมูลออกจากฐานข้อมูล

    res.redirect('/news'); // กลับไปที่หน้ารายการข่าวทั้งหมด
  } catch (error) {
    console.error(error);
    res.redirect('/news');
  }
};

// --- ส่วนของผู้ใช้ทั่วไป ---

// แสดงรายการข่าวทั้งหมด (เวอร์ชันอัปเดต)
exports.getAllNews = async (req, res) => {
  try {
    // ดึงค่า search และ category จาก query string ของ URL
    // เช่น /news?search=test&category=Research
    const { search, category } = req.query;

    // สร้าง object สำหรับเงื่อนไขการค้นหา (where clause)
    const whereClause = {};

    // ถ้ามีการส่งค่า search มา
    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%` // ค้นหา title ที่มีคำว่า search อยู่
      };
    }

    // ถ้ามีการส่งค่า category มาและไม่ใช่ 'All'
    if (category && category !== 'All') {
      whereClause.category = category;
    }

    // ดึงข่าวทั้งหมดจากฐานข้อมูลตามเงื่อนไข
    const allNews = await News.findAll({
      where: whereClause, // ใส่เงื่อนไขที่สร้างไว้
      order: [['createdAt', 'DESC']]
    });

    // ดึง Categories ทั้งหมดที่มีในฐานข้อมูลเพื่อสร้าง dropdown
    const categories = await News.findAll({
      attributes: ['category'],
      group: ['category']
    });

    res.render('news', {
      title: 'News - Larice @608',
      newsList: allNews,
      path: '/news',
      // ส่งค่าที่ค้นหาและ filter กลับไปที่ view เพื่อให้แสดงผลในฟอร์ม
      currentSearch: search || '',
      currentCategory: category || 'All',
      categories: categories.map(c => c.category) // แปลง object เป็น array ของ string
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};

// แสดงข่าวตาม ID ที่ระบุ
exports.getNewsById = async (req, res) => {
  try {
    const newsId = req.params.id; // ดึงค่า id จาก URL parameter
    const news = await News.findByPk(newsId); // findByPk คือการค้นหาด้วย Primary Key (id)

    // ถ้าหาข่าวไม่เจอ ให้ redirect กลับไปหน้า news
    if (!news) {
      return res.redirect('/news');
    }

    res.render('single-news', {
      title: news.title, // ตั้งชื่อ tab ของ browser เป็นชื่อข่าวเลย
      newsItem: news,
      path: '/news'
    });

  } catch (error) {
    console.error(error);
    res.redirect('/news');
  }
};