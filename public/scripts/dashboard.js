'use strict';

$(document).ready(function() {

  // burger button
  $(".button-collapse").sideNav();

  var data = 'siddhartha';

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/search?title=' + data,
    success: function(data) {
      console.log(data);
    }
  });

});