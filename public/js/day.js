

$.ajax({
  method: 'GET',
  url: '/api/days'
})
  .then(function (data) { console.log('GET response data: ', data) })
  .catch(console.error.bind(console));
  // should log "GET response data: You GOT all the days"


  $.ajax({
    method: 'GET',
    url: '/api/days'
  })
    .then(function (data) { console.log('GET response data: ', data) })
    .catch(console.error.bind(console));
    // should log "GET response data: You GOT all the days"



$.ajax({
  method: 'POST',
  url: '/api/days'
})
  .then(function (data) { console.log('POST response data: ', data) })
  .catch(console.error.bind(console));
  // should log "POST response data: You created a day!!"
