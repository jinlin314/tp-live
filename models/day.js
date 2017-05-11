const Sequelize = require('sequelize');
const db = require('./_db');
const Hotel = require('./hotel');
const Restaurant = require('./restaurant');
const Activity = require('./activity');
const Place = require('./place');

const Day = db.define('day',{
  dayNumber: {
    type: Sequelize.INTEGER
  }
});




module.exports = Day;
