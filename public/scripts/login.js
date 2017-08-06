'use strict';

$(document).ready(function() {

  // burger button
  $(".button-collapse").sideNav();

  var data = $('.errorContainer').data('error');
  if (data) {
    $('.errorContainer').html(
      '<div class="row">' + 
          '<div class="col m10 offset-m1 s12">' + 
            '<div class="card-panel red lighten-4 red-text text-darken-4 center-align">' + 
              data +
            '</div>' +
          '</div>' +
        '</div>'
    );
  }

});