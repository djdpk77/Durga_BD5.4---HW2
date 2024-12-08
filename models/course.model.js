let { DataTypes, sequelize } = require('./../lib/index');

let course = sequelize.define('course', {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

module.exports = { course };
