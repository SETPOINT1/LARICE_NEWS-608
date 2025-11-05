const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// ฟังก์ชันสำหรับแสดงหน้า Register (GET request)
exports.getRegister = (req, res) => {
  res.render('register', { 
    title: 'Register - Larice @608',
    message: null // เริ่มต้นยังไม่มีข้อความแจ้งเตือน
  });
};

// ฟังก์ชันสำหรับประมวลผลข้อมูลสมัครสมาชิก (POST request)
exports.postRegister = async (req, res) => {
  try {
    // ดึงข้อมูลจากฟอร์มที่ส่งมา
    const { firstName, lastName, studentId, phone, email, password, confirmPassword } = req.body;

    // 1. ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      return res.render('register', {
        title: 'Register - Larice @608',
        message: { type: 'error', text: 'Passwords do not match!' }
      });
    }

    // 2. ตรวจสอบว่ามีเลขนักศึกษาหรืออีเมลนี้ในระบบแล้วหรือยัง
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ studentId: studentId }, { email: email }]
      }
    });

    if (existingUser) {
      return res.render('register', {
        title: 'Register - Larice @608',
        message: { type: 'error', text: 'Student ID or Email already exists.' }
      });
    }

    // 3. เข้ารหัสรหัสผ่าน (Hashing)
    const hashedPassword = await bcrypt.hash(password, 12); // 12 คือความซับซ้อนในการเข้ารหัส

    // 4. สร้างผู้ใช้ใหม่ในฐานข้อมูล
    await User.create({
      firstName,
      lastName,
      studentId,
      phone,
      email,
      password: hashedPassword,
    });

    // 5. หากสำเร็จ, แสดงข้อความว่าสำเร็จ
    // ในอนาคตเราจะ redirect ไปหน้า login
    res.render('register', {
        title: 'Register - Larice @608',
        message: { type: 'success', text: 'Registration successful! You can now log in.' }
      });

  } catch (error) {
    console.error(error);
    res.render('register', {
        title: 'Register - Larice @608',
        message: { type: 'error', text: 'An error occurred. Please try again.' }
      });
  }
};

// ฟังก์ชันสำหรับแสดงหน้า Login (GET request)
exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Login - Larice @608',
    message: null
  });
};

// ฟังก์ชันสำหรับประมวลผลการล็อกอิน (POST request)
exports.postLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // 1. ค้นหาผู้ใช้จาก studentId ในฐานข้อมูล
    const user = await User.findOne({ where: { studentId: studentId } });

    // 2. ถ้าไม่พบผู้ใช้
    if (!user) {
      return res.render('login', {
        title: 'Login - Larice @608',
        message: { type: 'error', text: 'Invalid student ID or password.' }
      });
    }

    // 3. เปรียบเทียบรหัสผ่านที่ส่งมากับรหัสผ่านในฐานข้อมูล
    const isMatch = await bcrypt.compare(password, user.password);

    // 4. ถ้ารหัสผ่านไม่ตรงกัน
    if (!isMatch) {
      return res.render('login', {
        title: 'Login - Larice @608',
        message: { type: 'error', text: 'Invalid student ID or password.' }
      });
    }

    // 5. ถ้ารหัสผ่านถูกต้อง -> สร้าง Session
    req.session.isLoggedIn = true;
    req.session.user = {
      id: user.id,
      firstName: user.firstName,
      studentId: user.studentId,
      role: user.role
    };

    // 6. บันทึก session แล้ว redirect ไปหน้า Home
    req.session.save(err => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });

  } catch (error) {
    console.error(error);
    res.render('login', {
      title: 'Login - Larice @608',
      message: { type: 'error', text: 'An error occurred. Please try again.' }
    });
  }
};

// ฟังก์ชันสำหรับ Logout
exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};