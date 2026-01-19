import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import methodOverride from 'method-override';

const app = express();

// Basic middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// CORS: allow frontend to communicate (adjust origin in env for production)
app.use(cors({ origin: true, credentials: true }));

// Health check route - returns JSON only
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
