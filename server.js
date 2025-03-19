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
  'https://kidstop-5ab2b8b813da.herokuapp.com'
];

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Incoming request from origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true,
  })
);

app.options('*', cors());
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



// CORS configuration - simplifying to the most reliable approach
// Apply CORS before other middleware
// const corsOptions = {
//   origin: ['https://kidstop.netlify.app', 'http://localhost:5173', 'http://127.0.0.1:5173', 'https://kidstop-5ab2b8b813da.herokuapp.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204
// };

// Handle preflight requests
// app.options('*', cors(corsOptions));

// Apply CORS to all routes
// app.use(cors(corsOptions));

// Redirect to HTTPS in production
// app.use((req, res, next) => {
//   if (
//     process.env.NODE_ENV === 'production' &&
//     req.headers['x-forwarded-proto'] !== 'https'
//   ) {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });
