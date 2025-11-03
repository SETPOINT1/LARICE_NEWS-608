// index.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts'); // <--- เพิ่มตรงนี้ 1

// นำเข้าการตั้งค่า Sequelize
const sequelize = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// ตั้งค่า Session
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: 'your_secret_key_here', // เปลี่ยนเป็น key ลับของคุณ
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
}));
sessionStore.sync();

// Middleware สำหรับอ่านข้อมูลจากฟอร์ม
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ตั้งค่าให้ Express ใช้ไฟล์ static จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// ตั้งค่า View Engine
app.use(expressLayouts); // <--- เพิ่มตรงนี้ 2 (ต้องอยู่ก่อน app.set('view engine', ...))
app.set('layout', './layouts/main'); // (Optional) ตั้งค่า layout เริ่มต้น
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
const mainRoutes = require('./routes/index');
app.use('/', mainRoutes);


// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// เชื่อมต่อฐานข้อมูลและเริ่มเซิร์ฟเวอร์
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});