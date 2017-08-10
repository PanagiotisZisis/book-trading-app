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

  $('#addBookButton').click(function() {

    $('.errorContainer').html('');
    var searchTerm = $('#addBook').val();

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/search?title=' + searchTerm,
    }).done(function(books) {
      console.log(books);
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
             authors = '';
          }
          if (book.volumeInfo.hasOwnProperty('imageLinks')) {
            var thumbnail = book.volumeInfo.imageLinks.thumbnail;
            var imgAttr = 'src="' + thumbnail + '"';
          } else {
            var thumbnail = 'https://dummyimage.com/128x183/000000/ffffff&text=No+image+found';
            var imgAttr = 'src="' + thumbnail + '"';
          }
          $('.modal-content').append(
            '<div class="cardContainer">' +
              '<div class="card horizontal">' +
                '<div class="card-image">' +
                  '<img ' + imgAttr + '>' +
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
                    'class="addToCollection">Add</a>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          );

          // modal book covers
          $('.materialboxed').materialbox();


        });
        /*$('.modal-content').html(
          '<h4>Select your Book</h4>' +
          '<div class="divider"></div>' +
          '<div class="cardContainer">' +
            '<div class="card horizontal">' +
              '<div class="card-image">' +
                '<img src="https://lorempixel.com/100/190/nature/6">' +
              '</div>' +
              '<div class="card-stacked">' +
                '<div class="card-content">' +
                  '<h4>Book Title</h4>' +
                '</div>' +
                '<div class="card-action">' +
                  '<a href="#">Add</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="cardContainer">' +
            '<div class="card horizontal">' +
              '<div class="card-image">' +
                '<img src="https://lorempixel.com/100/190/nature/6">' +
              '</div>' +
              '<div class="card-stacked">' +
                '<div class="card-content">' +
                  '<h4>Book Title</h4>' +
                '</div>' +
                '<div class="card-action">' +
                  '<a href="#">Add</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="cardContainer">' +
            '<div class="card horizontal">' +
              '<div class="card-image">' +
                '<img src="https://lorempixel.com/100/190/nature/6">' +
              '</div>' +
              '<div class="card-stacked">' +
                '<div class="card-content">' +
                  '<h4>Book Title</h4>' +
                '</div>' +
                '<div class="card-action">' +
                  '<a href="#">Add</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="cardContainer">' +
            '<div class="card horizontal">' +
              '<div class="card-image">' +
                '<img src="https://lorempixel.com/100/190/nature/6">' +
              '</div>' +
              '<div class="card-stacked">' +
                '<div class="card-content">' +
                  '<h4>Book Title</h4>' +
                '</div>' +
                '<div class="card-action">' +
                  '<a href="#">Add</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="cardContainer">' +
            '<div class="card horizontal">' +
              '<div class="card-image">' +
                '<img src="https://lorempixel.com/100/190/nature/6">' +
              '</div>' +
              '<div class="card-stacked">' +
                '<div class="card-content">' +
                  '<h4>Book Title</h4>' +
                '</div>' +
                '<div class="card-action">' +
                  '<a href="#">Add</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="cardContainer">' +
            '<div class="card horizontal">' +
              '<div class="card-image">' +
                '<img src="https://lorempixel.com/100/190/nature/6">' +
              '</div>' +
              '<div class="card-stacked">' +
                '<div class="card-content">' +
                  '<h4>Book Title</h4>' +
                '</div>' +
                '<div class="card-action">' +
                  '<a href="#">Add</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>'
        );*/
        $('#modal1').modal('open');
      }
    });

  });

});