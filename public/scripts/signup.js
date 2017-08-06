'use strict';

$(document).ready(function() {

  // burger button
  $(".button-collapse").sideNav();

  var data = $('.errorContainer').data('errors');

  if (data) {
    data.forEach(function(error) {
      $('.errorContainer').append(
        '<div class="row">' + 
          '<div class="col m10 offset-m1 s12">' + 
            '<div class="card-panel red lighten-4 red-text text-darken-4">' + 
              error +
            '</div>' +
          '</div>' +
        '</div>'
      );
    });
  }
  
});