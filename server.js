// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const allowedOrigins = [
  'https://kidstop.netlify.app', // Netlify Frontend
  'http://localhost:5173',
  'http://127.0.0.1:5173', // Local backend
  'https://kidstop-5ab2b8b813da.herokuapp.com' // Heroku backend
];

// Redirect to HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Simplified CORS configuration - apply this first
app.use(cors({
  origin: true, // Allow requests from any origin for debugging
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'Origin', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add a middleware to explicitly set CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token, Origin, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Log all requests for debugging
  console.log(`${req.method} request for ${req.url} from origin: ${req.headers.origin}`);
  next();
});

// Handle OPTIONS requests explicitly
app.options('*', (req, res) => {
  res.status(204).end();
});

app.use(express.json());
app.use(logger('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const playgroundsRouter = require('./controllers/playgrounds');

// Routes
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use('/playgrounds', playgroundsRouter);

// Define port - use environment variable for Heroku compatibility
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Commented out old CORS configurations that were creating complexity
// const corsOptions = {
//   origin: ['https://kidstop.netlify.app', 'http://localhost:5173', 'http://127.0.0.1:5173', 'https://kidstop-5ab2b8b813da.herokuapp.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204
// };
