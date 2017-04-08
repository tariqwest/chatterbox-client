
$('document').ready(function(){

  var app = {};

  app.init = () => {
    console.log('initialized');
    app.getRooms();
    app.handleSubmit();
    app.handleRoomSelect();
    app.handleUsernameClick();
    app.fetch();
  };

  app.messages = {};

  app.rooms = {};

  app.friends = {};

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

  app.fetch = (room, afterFetch, afterFetchArgs) => {

    //room = room || 'Lobby';

    var queryData = '';
    if(room !== undefined){
      queryData = 'where={"roomname":' + '"' + room + '"}';
    };

    //Get message
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server + '/chatterbox/classes/messages/?order=-createdAt&limit=500&',
      type: 'GET',
      data: queryData,
      contentType: 'application/json',
      success: function (data) {
        app.messages = data.results;
        //app.getRooms();
        app.renderRoom();
        //app.clearMessages();
        if(afterFetch !== undefined){
          console.log(afterFetchArgs)
          afterFetch(afterFetchArgs);
        }
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
    var friendClass = '';
    if (app.friends.hasOwnProperty(message.username)){
        friendClass = 'friend';
    }

    $node = $(
      `  
      <div class="message ${friendClass}" data-roomname="${filterXSS(message.roomname)}" >
          <span class='username'>${filterXSS(message.username)}</span>
          <span>${filterXSS(message.text)}</span>
          <span>${message.createdAt}</span>
          <span><b>${filterXSS(message.roomname)}</b></span>
      </div>

      `);

    $('#chats').append($node);
  };

  app.renderRoom = (room) => {
    app.clearMessages();
    if (room === undefined){
      room = $('#roomList').find('select option:first').text();
    }
    for (var i = 0; i < app.messages.length; i++) {
      if (app.messages[i].roomname === room){
        app.renderMessage(app.messages[i]);
      }
    }
  };

  app.handleRoomSelect = () => {
    $('#roomList').on('change', 'select', function(event) {
      //console.log($(this).val());
      var room = $(this).val();
      app.fetch(room, app.renderRoom, room);
      //app.renderRoom($(this).val());      
    });
  };

  app.handleUsernameClick = () => {
    $('#chats').on('click', '.username', function(event){
      var username = $(this).text();
      if (!app.friends.hasOwnProperty(username)){  
        app.friends[username] = username;
      } else {
        delete app.friends[username];
      }
      console.log(app.friends);
      //$(this).css('font-weight', 'bold');
      var room = $('#roomList').find('select option:selected').text();
      app.renderRoom(room);
    });
  };

  app.handleSubmit = () => {
    $('#submit').on('click', (event) => {
      var username = window.location.search.slice(10); // make less hacky
      var text = filterXSS($('#messageField').val());
      var room = $('#roomList').find('select option:selected').text();
      var message = new Message(username, text, room);
      app.send(message);
      //app.fetch();
      app.fetch(undefined, app.renderRoom, room);
      $('#messageField').val('');
    });
  };

  app.getRooms = () => {
    var roomObjects = undefined;
    var queryData = 'keys=roomname';
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server + '/chatterbox/classes/messages/?order=-createdAt&limit=500&',
      type: 'GET',
      data: queryData,
      contentType: 'application/json',
      success: function (data) {
        roomObjects = data.results;
        app.generateRoomList(roomObjects);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  };

  app.generateRoomList = (roomObjects) => {
    $('select').remove();
    
    var roomNames = [];
    for (var i=0; i<roomObjects.length; i++){
      roomNames.push(roomObjects[i].roomname);
    }

    roomNames = _.uniq(roomNames);

    roomNames.sort();

    app.rooms = roomNames;

    var $list = $('<select></select>');
    for (var i=0; i < app.rooms.length; i++){
      var $listItem = `<option>${filterXSS(app.rooms[i])}</option>`;
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