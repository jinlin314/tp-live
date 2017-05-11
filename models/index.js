const db = require('./_db');
const Hotel = require('./hotel');
const Restaurant = require('./restaurant');
const Activity = require('./activity');
const Place = require('./place');
const Day = require('./day');

Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);

Day.belongsTo(Hotel);
Day.belongsToMany(Restaurant, {through: 'day_restaurants'});
Day.belongsToMany(Activity, {through: 'day_activities'});

module.exports = db;
