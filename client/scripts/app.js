
$('document').ready(function(){

  var app = {};

  app.init = () => {
    console.log('initialized');
    app.handleSubmit();
    app.handleRoomSelect();
    app.fetch();
  };

  app.messages = {"test" : "yo"};

  app.server = 'http://parse.sfm6.hackreactor.com';

  app.send = (message) => {
    //Create new message
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server + '/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        //console.log(data);
        //console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = (afterFetch, args) => {
    //Get message
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server + '/chatterbox/classes/messages/?order=-createdAt&limit=500',
      type: 'GET',
      //data: JSON.stringify("/chatterbox/classes/messages/BEF3V4Qzev"),
      contentType: 'application/json',
      success: function (data) {
        app.messages = data.results;
        app.getRooms();
        if(afterFetch !== undefined){
          afterFetch(args);
        }
        app.clearMessages();
        //console.log(app.messages);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  };

  app.clearMessages = () => {
    $('.message').remove();
  };

  app.renderMessage = (message) => {
    $node = $(
      `  
      <div class="message" data-roomname="${message.roomname}" >
          <span>${filterXSS(message.username)}</span>
          <span>${filterXSS(message.text)}</span>
          <span>${message.createdAt}</span>
          <span><b>${message.roomname}</b></span>
      </div>

      `);
    $('#chats').append($node);
  };

  app.renderRoom = (room) => {
    app.clearMessages();
    for (var i = 0; i < app.messages.length; i++) {
      if (app.messages[i].roomname === room){
        app.renderMessage(app.messages[i]);
      }
    }
  };

  app.handleRoomSelect = () => {
    $('#roomList').on('change', 'select', function(event) {
      //console.log($(this).val());
      app.renderRoom($(this).val());      
    });
  };

  app.handleUsernameClick = () => {};

  app.handleSubmit = () => {
    $('#submit').on('click', (event) => {
      var username = window.location.search.slice(10); // make less hacky
      var text = filterXSS($('#messageField').val());
      var room = $('#roomList').find('select option:selected').text();
      var message = new Message(username, text, room);
      app.send(message);
      app.fetch();
      //app.fetch(app.renderRoom, room);
    });
  };

  app.getRooms = () => {
    $('select').remove();
    var rooms = {};
    for (let i=0; i<app.messages.length; i++) {
      if(!rooms.hasOwnProperty(app.messages[i].roomname)){
        rooms[app.messages[i].roomname] = app.messages[i].roomname;
      }
    }
    var $list = $('<select></select>');
    for (var room in rooms){
      var $listItem = `<option>${room}</option>`;
      $($list).append($listItem);
    }
    $('#roomList').append($list);
  };

  class Message{
    constructor(username, text, roomname){
      this.username = username;
      this.text = text;
      this.roomname = roomname;
      this.createdAt;
    }
  }

  app.init();
  window.app = app;

});


// // Update message
// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/BEF3V4Qzev',
//   type: 'PUT',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//   	console.log(data);
//     //console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to retrieve message', data);
//   }
// });

// //Get message
// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/BEF3V4Qzev',
//   type: 'DELETE',
//   //data: JSON.stringify("BEF3V4Qzev"),
//   contentType: 'application/json',
//   success: function (data) {
//   	console.log(data);
//     //console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to retrieve message', data);
//   }
// });