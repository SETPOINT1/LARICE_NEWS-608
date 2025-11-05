const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // TEXT เหมาะสำหรับเนื้อหาที่ยาว
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // อ้างอิงไปยังตาราง Users
      key: 'id',
    }
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = News;