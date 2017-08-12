'use strict';

$(document).ready(function() {

  // modal initialization
  $('.modal').modal();

  // burger button initialization
  $('.button-collapse').sideNav();

  // removing ajax request error alert when switching tabs
  $('.tabs').click(function() {
    $('.errorContainer').html('');
  });

  var userBooks = $('#myBooks').data('userbooks');
  console.log(userBooks);
  if (!userBooks) {
    $('#myCollection').html('<h5>You have no Books yet.</h5>');
  } else {
    $('#myCollection').html('');
    userBooks.forEach(function(book) {
      $('#myCollection').append('<h2>' + book.title + '</h2>');
    });
  }

  $('#addBookButton').click(function() {

    $('.errorContainer').html('');
    var searchTerm = $('#addBook').val();

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/api?title=' + searchTerm,
    }).done(function(books) {
      if (books.hasOwnProperty('error')) {
        $('.errorContainer').html(
          '<div class="col m8 offset-m2 s12">' + 
            '<div class="card-panel red lighten-4 red-text text-darken-4 center-align">' + 
              'There was an <strong>Error</strong> with your search - please try another <strong>Book Title</strong> or try again later.' +
            '</div>' +
          '</div>'
        );
      } else {
        // populate modal's body and then open it
        $('.modal-content').html(
          '<h4>Select your Book</h4>' +
          '<div class="divider"></div>'
        );
        books.items.forEach(function(book) {
          var authors = book.volumeInfo.authors;
          if (!authors) {
             authors = ['Author was not found'];
          }
          var thumbnail = '';
          if (book.volumeInfo.hasOwnProperty('imageLinks')) {
            thumbnail = book.volumeInfo.imageLinks.thumbnail;
          } else {
            thumbnail = 'https://dummyimage.com/128x183/000000/ffffff&text=No+image+found';
          }
          $('.modal-content').append(
            '<div class="cardContainer">' +
              '<div class="card horizontal">' +
                '<div class="card-image">' +
                  '<img src="' + thumbnail + '">' +
                '</div>' +
                '<div class="card-stacked">' +
                  '<div class="card-content">' +
                    '<p class="flow-text">' + book.volumeInfo.title + '</p>' +
                    '<div class="divider"></div>' +
                    '<p class="flow-text">' + authors + '</p>' +
                  '</div>' +
                  '<div class="card-action">' +
                    '<a href="#"' +
                    'data-img="' + thumbnail + '"' +
                    'data-title="' + book.volumeInfo.title + '"' +
                    'data-authors="' + authors + '"' +
                    ' class="addToCollection">Add</a>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          );

        });
        
        $('#modal1').modal('open');

        // adding a book
        $('.addToCollection').click(function() {
          
          var title = $(this).data('title');
          var img = $(this).data('img');
          var bookAuthors = $(this).data('authors').split(',');

          var newBook = {
            title: title,
            authors: bookAuthors,
            img: img
          };

          // socket.io initialization
          var socket = io();

          socket.emit('addBook', newBook);
          socket.on('addBookSuccess', function(msg) {
            console.log(msg);
            $('#modal1').modal('close');
            $('#myCollection').append('<h4>new book added</h4>');
          });
          /*$.ajax({
            type: 'POST',
            url: 'http://localhost:3000/api',
            data: JSON.stringify(newBook),
            contentType: 'application/json'
          }).done(function(data) {
            console.log(data);
            $('#modal1').modal('close');
          });*/

        });

      }

    });

  });

});