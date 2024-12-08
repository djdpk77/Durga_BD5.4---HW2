let { DataTypes, sequelize } = require('./../lib/index');

let student = sequelize.define('student', {
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
});

module.exports = { student };
