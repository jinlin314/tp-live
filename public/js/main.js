$(function initializeMap () {
  //
  // $.get('/api/hotels')
  //   .then(function (hotels) {
  //     hotels.forEach(function(hotel){
  //       console.log(hotel.name);
  //     });
  //   })
  //   .catch( console.error.bind(console) );
  //
  //   $.get('/api/restaurants')
  //     .then(function (restaurants) {
  //       restaurants.forEach(function(restaurant){
  //         console.log(restaurant.name);
  //       });
  //     })
  //     .catch( console.error.bind(console) );
  //
  //     $.get('/api/activities')
  //       .then(function (activities) {
  //         activities.forEach(function(activity){
  //           console.log(activity.name);
  //         });
  //       })
  //       .catch( console.error.bind(console) );





  const fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  const styleArr = [
    {
      featureType: 'landscape',
      stylers: [{ saturation: -100 }, { lightness: 60 }]
    },
    {
      featureType: 'road.local',
      stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
    },
    {
      featureType: 'transit',
      stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
    },
    {
      featureType: 'administrative.province',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      stylers: [{ visibility: 'on' }, { lightness: 30 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
    }
  ];

  const mapCanvas = document.getElementById('map-canvas');

  const currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  // const iconURLs = {
  //   hotel: '/images/lodging_0star.png',
  //   restaurant: '/images/restaurant.png',
  //   activity: '/images/star-3.png'
  // };

  function drawMarker (type, coords) {
    // TODO: Pan map / recalculate viewport here maybe?
    const latLng = new google.maps.LatLng(coords[0], coords[1]);
    const marker = new google.maps.Marker({
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }

  // 0. Fetch the database, parsed from json to a js object
  const db = fetch('/api').then(r => r.json())

  // TODO:
  // 1. Populate the <select>s with <option>s
  $('select').each(
    (_index, select) => {
      db.then(db =>
        $(select).append(
          db[select.dataset.type].map (
            item => Object.assign(
              $(`<option value="${item.id}">${item.name}</option>`)[0]
              , {
                item: item,
              })
          )
        )
      )
    })

    // ========= 1b populate the days
    $.get('/api/days/')
      .then(function(days){
        console.log(">>>>.day", days);
        days.forEach(function(day){
        //  var currentDay = day.dayNumber;
        $('.day.current').removeClass('current')
        $('button.addDay').before ($(`<ol class="current day"><h3><span class=day-head></span><button class=delDay>x</button></h3></ol>`));
        numberDays();
        $('li').each((_i, li) => li.marker && li.marker.setMap(null))

          var hotel = day.hotel;
          var restaurants = day.restaurants; //array
          var activities = day.activities; //array

          console.log("hotel ", hotel);
          console.log("restaurants ", restaurants);
          console.log("activities", activities);

          // Make a hotel li
          if (hotel){
            console.log('there is hotel')
            let li = $(`<li>${hotel.name} <button class='del'>x</button></li>`);
            li.marker = drawMarker('hotel', hotel.place.location)
            console.log(".........", li);
            console.log(" currentDay", $('.current.day'))
            $('.current.day').append(li)
          }

          restaurants.forEach(function(restaurant){
            let li = $(`<li>${restaurant.name} <button class='del'>x</button></li>`);
            li.marker = drawMarker('restaurant', restaurant.place.location)
            $('.current.day').append(li)
          })

          activities.forEach(function(restaurant){
            let li = $(`<li>${activity.name} <button class='del'>x</button></li>`);
            li.marker = drawMarker('restaurant', activity.place.location)
            $('.current.day').append(li)
          })
        }) // end of forEach
      })// end of .then()
      .catch(console.error);


  // 2. Wire up the add buttons
  // We could do this if we wanted to select by the add
  // dataset item instead:
  //
  //   $('button[data-action="add"]').click(
  $('button.add').click(
    evt =>
      $(evt.target.dataset.from)
        .find('option:selected')
        .each((_i, option) => {
          const item = option.item
              , type = $(option)
                  .closest('select')[0]
                  .dataset.type

    // ===============ajax ========

    var currentDay = +$('.current.day span').text().slice(-1);
    var url = `/api/days/${currentDay}/${type}`;
    console.log(url);
    console.log("item", item);

    $.ajax({
      type: "POST",
      url: url,
      data: item.id
    }).then(function(){
        // Make a li out of this item
        const li = $(`<li>${item.name} <button class='del'>x</button></li>`)[0]
        // Draw a marker on the map and attach the marker to the li
        li.marker = drawMarker(type, item.place.location)
        // Add this item to our itinerary for the current day
        $('.current.day').append(li)
    })// end of then
  })//.each
)// end of click

  // 3. Wire up delete buttons
  $(document).on('click', 'button.del',
    evt => $(evt.target).closest('li').each((_i, li) => {
      li.marker.setMap(null)
      $(li).remove()
    })
  )

  // 4. Deal with adding days
  $('button.addDay').click(
    evt => {
      // var $dayDiv = $(evt.target).prev();
      // var newDayNumber = +$dayDiv.find('span').text().slice(-1);
      // console.log("newDayNumber", newDayNumber);
      // create a new day object
      // Deselect all days

      $.post(`/api/addday`)
        .then(function(day){
          console.log(day);
          $('.day.current').removeClass('current')

          // Add a new day
          $(evt.target).before(
            $(`<ol class="current day"><h3><span class=day-head></span><button class=delDay>x</button></h3></ol>`)
          )
          numberDays();
          $('li').each((_i, li) => li.marker && li.marker.setMap(null))
        })
        .catch(console.error);

    } // end of evt function
  )// end of click

  function numberDays() {
    $('.day').each((index, day) =>
      $(day).find('.day-head').text(`day ${index + 1}`)
    )
  }

  // 5. Deal with switching days
  $(document).on('click', '.day-head',
    evt => {
      $('.day.current').removeClass('current')
      const $day = $(evt.target).closest('.day')

      $('li').each((_i, li) => li.marker && li.marker.setMap(null))
      $day.addClass('current')
      console.log('askjdhgskjdhg', $day.find('li'), Array.isArray($day.find('li')))
      let arrayified = [].slice.call($day.find('li'))
      $.each($('.current.day'), (index, item) => {
        console.log('li', item, item.marker)
      })
      //arrayified.forEach((_i, li) => console.log('li', li)) //li.marker.setMap(currentMap))
    }
  )

  // 6. Remove a day
  $(document).on('click', 'button.delDay',
    evt => {
      const $day = $(evt.target).closest('.day')
      if ($day.hasClass('current')) {
        const prev = $day.prev('.day')[0]
            , next = $day.next('.day')[0]
        $day.removeClass('current')
        $(prev || next).addClass('current')
      }

      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))
      $day.remove()
      numberDays()
    })

  // When we start, add a day
  // $('button.addDay').click()
});
