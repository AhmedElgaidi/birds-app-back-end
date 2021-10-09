require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

//=========================================

// Create our server
const server = app.listen(process.env.PORT || 8000, () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log(`Server is running on port: ${process.env.PORT} (${process.env.NODE_ENV} environment)`);
    });
});

// (1) Handle our global promise rejections
process.on('unhandledRejection', err => {
  console.error(err.name, err.message);
  console.log('Unhandled rejections, shutting down....');
  server.close(() => process.exit(1));
});

// (2) Handle our uncaught exception
process.on('uncaughtException', err => {
  console.error(err.name, err.message);
  console.log('Uncaught exceptions, shutting down....');
  server.close(() => process.exit(1));
});

// (3) on production (heroku) the dyno restarts every 24 hours to keep our server healty and active
// so what if we have some requests during this time? they will be hanging
// By this, we are handeling those requests (not accepting more) before restarting
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});