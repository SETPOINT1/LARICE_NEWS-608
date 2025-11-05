const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  // กำหนดฟิลด์ต่างๆ ในตาราง Users
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // เลขนักศึกษาต้องไม่ซ้ำกัน
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // อีเมลต้องไม่ซ้ำกัน
    validate: {
      isEmail: true, // ตรวจสอบว่าเป็นรูปแบบอีเมลที่ถูกต้อง
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user', // ค่าเริ่มต้นสำหรับผู้ใช้ใหม่คือ 'user'
  }
});

module.exports = User;