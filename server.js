// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const playgroundsRouter = require('./controllers/playgrounds');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// const corsOptions = {
//   origin: ["http://localhost:5173", "https://kidstop-5ab2b8b813da.herokuapp.com", "https://kidstop.netlify.app"],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// };
// kidstop-5ab2b8b813da.herokuapp.com/

// Middleware
// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

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
