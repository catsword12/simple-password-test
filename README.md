# Simple Multiplayer Click Race Game

A real-time multiplayer click race game where players from multiple computers can compete against each other.

## Features

- User registration and authentication
- Real-time multiplayer gameplay
- Live leaderboard
- Online player status tracking
- Cross-computer multiplayer support

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

4. To play with multiple computers:
   - Open the game on different computers/devices on the same network
   - Register or log in with different accounts
   - Start competing in real-time!

## Game Rules

- Click the "Click!" button as fast as you can for 10 seconds
- Submit your score to the leaderboard
- Compete with players from other computers in real-time
- See who's online and check the live leaderboard

## Technology

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: WebSockets via Socket.IO

## Development

For development with auto-restart:
```bash
npm run dev
```

## Deployment

To deploy to multiple computers, you can:

1. Host the server on a cloud service (Heroku, DigitalOcean, etc.)
2. Update the Socket.IO client connection URL to point to your hosted server
3. Share the URL with other players

The game will work across different networks when properly hosted.