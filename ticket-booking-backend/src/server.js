import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Initialize DB connection (if MONGO_URI is provided)
connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ticket-booking backend API running on http://localhost:${PORT}`);
});

export default server;
