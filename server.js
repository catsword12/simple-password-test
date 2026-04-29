const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = new Map();
const activePlayers = new Map();
const leaderboard = [];

const getPlayerList = () => {
  return Array.from(activePlayers.entries()).map(([socketId, username]) => ({
    username,
    status: 'online',
  }));
};

const getLeaderboard = () => {
  return [...leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
  socket.on('register', ({ username, password }) => {
    if (!username || !password) {
      socket.emit('registerError', { message: 'Username and password are required.' });
      return;
    }

    if (users.has(username)) {
      socket.emit('registerError', { message: 'Username already exists. Choose a different name.' });
      return;
    }

    users.set(username, password);
    socket.emit('registerSuccess', { message: 'Registration successful. You can now log in.' });
  });

  socket.on('login', ({ username, password }) => {
    if (!username || !password) {
      socket.emit('loginError', { message: 'Username and password are required.' });
      return;
    }

    const storedPassword = users.get(username);
    if (!storedPassword || storedPassword !== password) {
      socket.emit('loginError', { message: 'Invalid username or password.' });
      return;
    }

    activePlayers.set(socket.id, username);
    socket.data.username = username;

    socket.emit('loginSuccess', { username });
    io.emit('playersUpdate', getPlayerList());
    socket.emit('leaderboardUpdate', getLeaderboard());
  });

  socket.on('heartbeat', () => {
    if (socket.data.username) {
      // Keep connection alive; no action needed.
    }
  });

  socket.on('startGame', () => {
    if (!socket.data.username) return;
    socket.emit('gameStarted');
  });

  socket.on('submitScore', ({ score }) => {
    if (!socket.data.username) return;
    const username = socket.data.username;
    leaderboard.push({ username, score: Number(score) || 0 });
    socket.emit('scoreSubmitted');
    io.emit('leaderboardUpdate', getLeaderboard());
  });

  socket.on('disconnect', () => {
    if (activePlayers.has(socket.id)) {
      activePlayers.delete(socket.id);
      io.emit('playersUpdate', getPlayerList());
    }
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, server, io };
