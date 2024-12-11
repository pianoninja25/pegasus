const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(bodyParser.json());

// API endpoint to post data and send notification
app.post('/massoutage', (req, res) => {
  const { message } = req.body; // Get the message from the body of the request
  if (message) {
    // Send notification to all connected clients
    io.emit('notification', message);
    res.status(200).send({ status: 'success', message: 'Notification sent' });
  } else {
    res.status(400).send({ status: 'error', message: 'Message is required' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});
