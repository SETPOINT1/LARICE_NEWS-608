// Middleware เพื่อตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือยัง
exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next(); // ถ้าล็อกอินแล้ว ให้ไปต่อ
};

// Middleware เพื่อตรวจสอบว่าเป็น Admin หรือไม่
exports.isAdmin = (req, res, next) => {
  // ตรวจสอบก่อนว่าล็อกอินหรือยัง
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  // ตรวจสอบว่าเป็น admin หรือไม่
  if (req.session.user.role !== 'admin') {
    // ถ้าไม่ใช่ admin ให้ redirect ไปหน้าแรก (หรือหน้า news)
    return res.redirect('/');
  }
  next(); // ถ้าเป็น admin ให้ไปต่อ
};