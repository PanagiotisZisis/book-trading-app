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

  // initializing socket.io
  var socket = io();

  // populating All Books Tab
  function getAllBooks() {

    $.ajax({
      type: 'GET',
      url: 'http://booktradingapp.herokuapp.com/api/allBooks'
    }).done(function(data) {
      $('#allBooks').html('');
      var allBooks = data.allBooks;
      if (!allBooks) {
        $('#allBooks').html(
          '<h4>There are no books from other users yet.</h4>'
        );
      } else {
        allBooks.forEach(function(book) {
          if (!book.tradeExists) {
            $('#allBooks').append(
              '<div class="card horizontal">' +
                '<div class="card-image">' +
                  '<img src="' + book.img + '">' +
                '</div>' +
                '<div class="card-stacked">' +
                  '<div class="card-content">' +
                    '<p class="flow-text">' + book.title + '</p>' +
                    '<div class="divider"></div>' +
                    '<p class="flow-text">' + book.authors.join(', ') + '</p>' +
                  '</div>' +
                  '<div class="card-action">' +
                    '<a href="javascript:void(0)"' +
                    'data-img="' + book.img + '"' +
                    'data-title="' + book.title + '"' +
                    'data-authors="' + book.authors + '"' +
                    'data-id="' + book._id + '"' +
                    'data-username="' + book.username + '"' +
                    ' class="requestTrade">Request Trade</a>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          } else {
            $('#allBooks').append(
              '<div class="card horizontal">' +
                '<div class="card-image">' +
                  '<img src="' + book.img + '">' +
                '</div>' +
                '<div class="card-stacked">' +
                  '<div class="card-content">' +
                    '<p class="flow-text">' + book.title + '</p>' +
                    '<div class="divider"></div>' +
                    '<p class="flow-text">' + book.authors.join(', ') + '</p>' +
                  '</div>' +
                  '<div class="card-action">' +
                    '<a href="javascript:void(0)"' +
                    'data-img="' + book.img + '"' +
                    'data-title="' + book.title + '"' +
                    'data-authors="' + book.authors + '"' +
                    'data-id="' + book._id + '"' +
                    'data-username="' + book.username + '"' +
                    '>Trade Requested</a>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          }
          
        });
      }

    });

  }

  getAllBooks();

  // populating My Books Tab
  function populateMyBooks() {
    socket.emit('getMyBooks', $('body').data('username'));
  }

  populateMyBooks();

  // Clicking the Search Button
  $('#addBookButton').click(function() {

    $('.errorContainer').html('');
    var searchTerm = $('#addBook').val();

    $.ajax({
      type: 'GET',
      url: 'http://booktradingapp.herokuapp.com/api?title=' + searchTerm,
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
            '<div class="card horizontal">' +
              '<div class="card-image">' +
                '<img src="' + thumbnail + '">' +
              '</div>' +
              '<div class="card-stacked">' +
                '<div class="card-content">' +
                  '<p class="flow-text">' + book.volumeInfo.title + '</p>' +
                  '<div class="divider"></div>' +
                  '<p class="flow-text">' + authors.join(', ') + '</p>' +
                '</div>' +
                '<div class="card-action">' +
                  '<a href="javascript:void(0)"' +
                  'data-img="' + thumbnail + '"' +
                  'data-title="' + book.volumeInfo.title + '"' +
                  'data-authors="' + authors + '"' +
                  ' class="addToCollection">Add</a>' +
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

          // updating My Books then refreshing All Books tab
          $.ajax({
            type: 'POST',
            url: 'http://booktradingapp.herokuapp.com/api',
            data: JSON.stringify(newBook),
            contentType: 'application/json'
          }).done(function(newBook) {
            $('#myCollection').append(
              '<div class="card horizontal">' +
                '<div class="card-image">' +
                  '<img src="' + newBook.img + '">' +
                '</div>' +
                '<div class="card-stacked">' +
                  '<div class="card-content">' +
                    '<p class="flow-text">' + newBook.title + '</p>' +
                    '<div class="divider"></div>' +
                    '<p class="flow-text">' + newBook.authors + '</p>' +
                  '</div>' +
                  '<div class="card-action">' +
                    '<a href="javascript:void(0)"' +
                    'data-img="' + newBook.img + '"' +
                    'data-title="' + newBook.title + '"' +
                    'data-authors="' + newBook.authors + '"' +
                    'data-id="' + newBook._id + '"' +
                    ' class="deleteFromCollection">Delete</a>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
            socket.emit('refresh');
            $('#modal1').modal('close');
          });

        });

      }

    });

  });

  // delete from My Books then refreshing All Books tab
  $('#myCollection').on('click', '.deleteFromCollection', function() {
    
    var bookId = $(this).data('id');
    var data = { bookId: bookId };
    var temp = $(this).parents()[2];

    $.ajax({
      type: 'DELETE',
      url: 'http://booktradingapp.herokuapp.com/api',
      contentType: 'application/json',
      data: JSON.stringify(data)
    }).done(function(data) {
      if (data.hasOwnProperty('success')) {
        temp.remove();
        socket.emit('refresh');
      }
    });

  });

  socket.on('refreshReply', function() {
    getAllBooks();
    populatePendingTab();
  });

  // requesting a trade
  $('#allBooks').on('click', '.requestTrade', function() {

    var bookId = $(this).data('id');
    var username = $(this).data('username');
    var text = $(this).text();
    var title = $(this).data('title');
    var img = $(this).data('img');
    var authors = $(this).data('authors');

    if (text === 'Request Trade') {
      $(this).text('Trade Requested');
      $(this).removeClass('requestTrade');
    }

    var newTrade = {
      bookId: bookId,
      username: username,
      title: title,
      img: img,
      authors: authors
    };

    $.ajax({
      type: 'POST',
      url: 'http://booktradingapp.herokuapp.com/api/trade',
      contentType: 'application/json',
      data: JSON.stringify(newTrade)
    }).done(function() {
      socket.emit('refreshPending');
    });

  });

  // populating Pending Tab
  function populatePendingTab() {

    $.ajax({
      type: 'GET',
      url: 'http://booktradingapp.herokuapp.com/api/trade'
    }).done(function(data) {
      if (data) {
        var username = $('body').data('username');
        var books = data.books;
        if (books.length > 0) {
          $('#pendingTab').text(books.length + '  pending');
          $('#pending').html(
            '<div class="section" id="incoming">' +
              '<h4>Incoming Requests</h4>' +
            '</div>' +
            '<div class="section" id="outgoing">' +
              '<h4>Outgoing Requests</h4>' +
            '</div>'
          );
          var incoming = 0;
          var outgoing = 0;
          books.forEach(function(book) {
            if (book.recipient === username) {
              incoming++;
              $('#incoming').append(
                '<p class="flow-text">User <strong>' + book.sender + '</strong> requested:</p>' +
                '<div class="card horizontal">' +
                  '<div class="card-image">' +
                    '<img src="' + book.img + '">' +
                  '</div>' +
                  '<div class="card-stacked">' +
                    '<div class="card-content">' +
                      '<p class="flow-text">' + book.title + '</p>' +
                      '<div class="divider"></div>' +
                      '<p class="flow-text">' + book.authors + '</p>' +
                    '</div>' +
                    '<div class="card-action">' +
                      '<a href="javascript:void(0)"' +
                      'data-id="' + book._id + '"' +
                      ' class="acceptRequest green-text text-lighten-2">Accept Trade</a>' +
                      '<a href="javascript:void(0)"' +
                      'data-id="' + book._id + '"' +
                      ' class="rejectRequest red-text text-lighten-2">Reject Trade</a>' +
                    '</div>' +
                  '</div>' +
                '</div>'
              );
            } else if (book.sender === username) {
              outgoing++;
              $('#outgoing').append(
                '<p class="flow-text">You requested this book from user <strong>' + book.recipient + '</strong>:</p>' +
                '<div class="card horizontal">' +
                  '<div class="card-image">' +
                    '<img src="' + book.img + '">' +
                  '</div>' +
                  '<div class="card-stacked">' +
                    '<div class="card-content">' +
                      '<p class="flow-text">' + book.title + '</p>' +
                      '<div class="divider"></div>' +
                      '<p class="flow-text">' + book.authors + '</p>' +
                    '</div>' +
                    '<div class="card-action">' +
                      '<a href="javascript:void(0)"' +
                      'data-id="' + book._id + '"' +
                      ' class="cancelTrade red-text text-lighten-1">Cancel Request</a>' +
                    '</div>' +
                  '</div>' +
                '</div>'
              );
            }
          });
          if (outgoing === 0) {
            $('#outgoing').remove();
          }
          if (incoming === 0) {
            $('#incoming').remove();
          }
        } else {
          $('#pending').html(
            '<h4>No Pending Requests</h4>'
          );
          $('#pendingTab').text('Pending');
        }
      }
    });

  }

  populatePendingTab();

  // accepting a trade
  $('#pending').on('click', '.acceptRequest', function() {
    var tradeId = $(this).data('id');
    socket.emit('tradeAccepted', tradeId);
  });

  // rejecting a trade
  $('#pending').on('click', '.rejectRequest', function() {
    var tradeId = $(this).data('id');
    socket.emit('tradeRejected', tradeId);
  });

  // cancelling a trade request
  $('#pending').on('click', '.cancelTrade', function() {
    var tradeId = $(this).data('id');
    socket.emit('tradeRejected', tradeId);
  });

  socket.on('refreshPendingReply', function() {
    populatePendingTab();
  });

  socket.on('tradeAcceptedReply', function() {
    getAllBooks();
    populatePendingTab();
    populateMyBooks();
  });

  socket.on('tradeRejectedReply', function() {
    getAllBooks();
    populatePendingTab();
    populateMyBooks();
  });

  socket.on('getMyBooksReply', function(books) {
    if (!books) {
      $('#myCollection').html('<h5>You have no Books added yet.</h5>');
    } else {
      $('#myCollection').html('');
      books.forEach(function(book) {
        $('#myCollection').append(
          '<div class="card horizontal">' +
            '<div class="card-image">' +
              '<img src="' + book.img + '">' +
            '</div>' +
            '<div class="card-stacked">' +
              '<div class="card-content">' +
                '<p class="flow-text">' + book.title + '</p>' +
                '<div class="divider"></div>' +
                '<p class="flow-text">' + book.authors.join(', ') + '</p>' +
              '</div>' +
              '<div class="card-action">' +
                '<a href="javascript:void(0)"' +
                'data-img="' + book.img + '"' +
                'data-title="' + book.title + '"' +
                'data-authors="' + book.authors + '"' +
                'data-id="' + book._id + '"' +
                ' class="deleteFromCollection">Delete</a>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      });
    }
  });
});