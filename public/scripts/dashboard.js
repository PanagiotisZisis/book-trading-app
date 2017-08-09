'use strict';

$(document).ready(function() {

  // burger button
  $(".button-collapse").sideNav();

  $('#addBookButton').click(function() {

    var searchTerm = $('#addBook').val();

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/search?title=' + searchTerm,
      success: function(data) {
        console.log(data);
      }
    });

  });

});