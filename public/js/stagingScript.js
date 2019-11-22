var socket = io();

socket.on('numPlayers', function (playerCount) {
    console.log(playerCount);
    var waitMessage = document.getElementById('waitMessage');

    if (playerCount == 3)
        waitMessage.innerHTML = "<h2>Waiting for <b>"+(4-playerCount)+"</b> more player to join...</h2>";
    else
        waitMessage.innerHTML = "<h2>Waiting for <b>"+(4-playerCount)+"</b> more players to join...</h2>";

    if (playerCount == 4){
        document.getElementById('gamePage').submit();
    }
});

var username = document.getElementById("nameGame").value;
  
//chat 
// When we receive a message
// it will be like { user: 'username', message: 'text' }
$("#messageText").keyup(function(event){
    if(event.keyCode == 90){
        $("#messageText").val($("#messageText").val()+ 'z');
    }
});

$("#messageText").keyup(function(event){
    if(event.keyCode == 32){
        $("#messageText").val($("#messageText").val()+' ');
    }
});

$('.chatForm').submit(function (e) {
    console.log("sent")
    // Avoid submitting it through HTTP
    e.preventDefault();
    // Retrieve the message from the user
    var message = $(e.target).find('#messageText').val();

    console.log(message);
    console.log(username);
    // Send the message to the server
    self.socket.emit('message', {
        //user: cookie.get('user') || 'Anonymous',
        user: username,
        message: message
    });
    // Clear the input and focus it for a new message
    e.target.reset();
    $(e.target).find('input').focus();
});

socket.on('message', function (data) {
    console.log("client catched");
    console.log("data user is" + data.user);
    $('#messages').append($('<li>').text(data.user + ': ' + data.message));

});

// socket.emit('username',username);