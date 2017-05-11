var Promise = require('bluebird');
var dayRouter = require('express').Router();

var db = require('../../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

dayRouter.post('/days/:id/hotels', function(req, res, next){
  var dayNum = req.params.id;
  // got hotel oject through req.body
  var hotel = req.body.hotel;

  Day.findById(dayNum)
    .then(function(day){
      console.log(day)
      day.setHotel(hotel);
    })
      .catch(next);
});


dayRouter.post('/addday/', function(req, res, next){
  Day.create()
  .then(function(day){
    res.send(day);
  })
    .catch(next);
});


dayRouter.get('/days', function(req, res, next){
  Day.findAll({
    include: [{all: true, nested: true}]
  })
    .then(function(days){
      res.send(days);
    })
    .catch(next);
})

// dayRouter.post('/days', function(req, res, next){
//   res.send('you post a days');
// })

//
//
// dayRouter.get('days/:id/hotel', function(req, res, next){
//   var dayNum = req.params.id;
//   Day.findById(dayNum)
//     .then(function(day){
//       var hotelId = day.hotelId;
//       return Hotel.findById(hotelId)
//     })
//     .then(function(hotel){
//       res.send(hotel); // hotel object
//     })
//     .catch(next);
// });
//
// dayRouter.get('/:id/restaurants', function(req, res, next){
//   var dayNum = req.params.id;
//   Day.find({
//       where: { id: dayNum },
//       include: [Restaurant]
//     }
//   )
//     .then(function(day){
//       res.send(day.restaurants); // restaurants IDs
//     })
// });
//
// dayRouter.get('/:id/activities', function(req, res, next){
//   var dayNum = req.params.id;
//   Day.find({
//       where: { id: dayNum },
//       include: [Activity]
//     }
//   )
//     .then(function(day){
//       res.send(day.activities); // activities ids
//     })
// });

module.exports = dayRouter;
