
$('document').ready(function(){

  var message = {
    username: 'shawndrost',
    text: 'trololo ++',
    roomname: '4chan'
  };

  var app = {};

  app.init = () => {
    console.log('initialized');
    app.handleSubmit();
  };

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
        console.log(data);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = () => {
    //Get message
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server + '/chatterbox/classes/messages/',
      type: 'GET',
      //data: JSON.stringify("/chatterbox/classes/messages/BEF3V4Qzev"),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        app.renderMessage(data);
        //console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  };

  app.clearMessages = () => {

  };

  app.renderMessage = () => {

  };

  app.renderRoom = () => {

  };

  app.handleUsernameClick = () => {};

  app.handleSubmit = () => {
    $('#submit').on('click', (event) => {
      var username = window.location.search.slice(10); // make less hacky
      var text = filterXSS($('#messageField').val());
      var message = new Message(username, text, 'roomname');
      //console.log(JSON.stringify(message));
      app.send(message);
    });
  };

  class Message{
    constructor(username, text, roomname){
      this.username = username;
      this.text = text;
      this.roomname = roomname;
      this.createdAt;
      this.$node = $(
      `  
      <div>
          <span>${this.username}</span>
          <span>${this.messsage}</span>
          <span>${this.createdAt}</span>
      </div>

      `);
    }
  }

  // Prevent XSS
  for(var key in message){
    message[key] = filterXSS(message[key]);
  }

  app.init();

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