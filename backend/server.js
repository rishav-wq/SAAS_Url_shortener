import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import { redirectLink } from './controllers/linkController.js'; // Import redirect handler

dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'https://micro-saas-1-frontend.onrender.com' // Optional if you're supporting multiple frontends
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // If using cookies or auth headers (optional)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow common headers
  }));
  
app.use(express.json()); // Parse JSON bodies
app.set('trust proxy', 1); // Trust first proxy for IP address if deploying behind one

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// --- Redirect Route (must be defined *after* API routes) ---
// This handles the root path with a short ID parameter
app.get('/:shortId', redirectLink);

// Basic Error Handling Middleware (example)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));