// config/database.js

const { Sequelize } = require('sequelize');

// สร้าง instance ของ Sequelize เพื่อเชื่อมต่อกับ SQLite
// ฐานข้อมูลจะถูกเก็บไว้ในไฟล์ database.sqlite ในโฟลเดอร์รากของโปรเจกต์
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

module.exports = sequelize;