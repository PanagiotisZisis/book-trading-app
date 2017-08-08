'use strict';

$(document).ready(function() {

  // burger button
  $(".button-collapse").sideNav();
  
  // setting default values
  var name = $('#fullName').data('name');
  var city = $('#city').data('city');
  var state = $('#state').data('state');
  $('#fullName').val(name);
  $('#city').val(city);
  $('#state').val(state);
});