const http = require('http');

const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const fs = require('fs');

let score = 0;

const handler = (request, respond) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }
    // send back the client when the user first joins
    respond.writeHead(200);
    respond.end(data);
  });
};

const app = http.createServer(handler);

app.listen(port);

const io = socketio(app);

// allow a connection if the client asks
io.on('connection', (socket) => {
  socket.join('room1');

  // add a listener to a update score message score to total
  socket.on('updateScore', (data) => {
    score += data;


    // send back the score to users
    socket.emit('updateClient', score);
  });

  // listen to a disconnect message 
  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`Listening on localhost:${port}`);
