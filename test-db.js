// Test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI exists (not showing for security)' : 'URI is missing!');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    console.log('Connection details:', {
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      readyState: mongoose.connection.readyState
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    if (err.name === 'MongoServerSelectionError') {
      console.error('This could be due to network issues, incorrect credentials, or IP restrictions.');
    }
    process.exit(1);
  }); 