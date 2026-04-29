const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// In-memory storage (in production, use a database)
let accounts = [];
let leaderboard = [];
let activePlayers = new Map(); // socket.id -> { username, lastSeen }

// Helper functions
const findAccount = (username) => accounts.find(acc => acc.username === username);
const addAccount = (username, password) => {
  if (findAccount(username)) return false;
  accounts.push({ username, password });
  return true;
};

const authenticate = (username, password) => {
  const account = findAccount(username);
  return account && account.password === password;
};

const updateLeaderboard = (username, score) => {
  leaderboard.unshift({ username, score, time: Date.now() });
  leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
  leaderboard = leaderboard.slice(0, 20); // Keep top 20
};

const getActivePlayersList = () => {
  const now = Date.now();
  const active = [];
  for (const [socketId, player] of activePlayers) {
    if (now - player.lastSeen < 30000) { // 30 seconds timeout
      active.push({ username: player.username, status: 'Online' });
    }
  }
  return active;
};

const broadcastUpdates = () => {
  const activePlayersList = getActivePlayersList();
  io.emit('playersUpdate', activePlayersList);
  io.emit('leaderboardUpdate', leaderboard);
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send initial data
  socket.emit('playersUpdate', getActivePlayersList());
  socket.emit('leaderboardUpdate', leaderboard);

  // Handle registration
  socket.on('register', (data) => {
    const { username, password } = data;
    if (addAccount(username, password)) {
      socket.emit('registerSuccess', { message: 'Registration successful! You can now log in.' });
    } else {
      socket.emit('registerError', { message: 'Username already exists.' });
    }
  });

  // Handle login
  socket.on('login', (data) => {
    const { username, password } = data;
    if (authenticate(username, password)) {
      activePlayers.set(socket.id, { username, lastSeen: Date.now() });
      socket.emit('loginSuccess', { username });
      broadcastUpdates();
    } else {
      socket.emit('loginError', { message: 'Invalid username or password.' });
    }
  });

  // Handle game start
  socket.on('startGame', () => {
    const player = activePlayers.get(socket.id);
    if (player) {
      socket.emit('gameStarted');
    }
  });

  // Handle score submission
  socket.on('submitScore', (data) => {
    const player = activePlayers.get(socket.id);
    if (player) {
      const { score } = data;
      updateLeaderboard(player.username, score);
      socket.emit('scoreSubmitted');
      broadcastUpdates();
    }
  });

  // Handle heartbeat to keep player active
  socket.on('heartbeat', () => {
    const player = activePlayers.get(socket.id);
    if (player) {
      player.lastSeen = Date.now();
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    activePlayers.delete(socket.id);
    broadcastUpdates();
  });
});

// Periodic cleanup of inactive players
setInterval(() => {
  const now = Date.now();
  for (const [socketId, player] of activePlayers) {
    if (now - player.lastSeen > 30000) {
      activePlayers.delete(socketId);
    }
  }
  broadcastUpdates();
}, 10000); // Every 10 seconds

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});