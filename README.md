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

## CI/CD

This project includes GitHub Actions workflow that:

- ✅ Uses Node.js 24 to avoid the Node.js 20 deprecation warning
- ✅ Forces JavaScript actions to run on Node.js 24 with `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`
- ✅ Runs automated tests, linting, and builds on every push/PR
- ✅ Includes deployment placeholder for production hosting

The workflow addresses the GitHub Actions Node.js 20 deprecation by:
- Using `actions/checkout@v4` and `actions/setup-node@v4` with Node.js 24
- Setting the `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` environment variable
- Ensuring all JavaScript-based actions run on the supported Node.js version

## Deployment

To deploy to multiple computers, you can:

1. Host the server on a cloud service (Heroku, DigitalOcean, etc.)
2. Update the Socket.IO client connection URL to point to your hosted server
3. Share the URL with other players

The game will work across different networks when properly hosted.