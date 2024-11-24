import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { startTimer, stopTimer } from './controllers/timer.js';
import timerSingleton from './lib/timerSingleton.js';
import mqtt, { MqttClient } from 'mqtt';

dotenv.config();

// Create Express app
const app = express();

// Define the HTTP server
const httpServer = http.createServer(app);

// define the mqtt client
const client = mqtt.connect('mqtt://10.3.141.1');

// Enable CORS
app.use(cors());

// Socket IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"]
  }
});

// For testing purposes
io.on('connection', (socket) => {
  console.log('New user connected!');
  socket.on('disconnect', function () {
    console.log('User disconnected...');
  });
})

  timerSingleton.getInstance().onTick = (elapsedTime) => {
  io.emit('timerTick', elapsedTime);
  client.publish('timer', elapsedTime.toString());
}
// Define routes
app.get('/', (req, res) => { res.send('The LED API is working!'); });
app.get('/startTimer', startTimer);
app.get('/stopTimer', stopTimer);

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export app for testing purposes
export default app;
