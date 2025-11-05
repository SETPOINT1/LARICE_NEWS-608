// index.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

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
  secret: 'your_secret_key_here',
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
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware สำหรับส่งข้อมูล session ไปยังทุก view
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  next();
});

// Routes (เหลือแค่บล็อกนี้บล็อกเดียว)
const mainRoutes = require('./routes/index');
const newsRoutes = require('./routes/newsRoutes');

app.use('/', mainRoutes);
app.use('/news', newsRoutes);


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