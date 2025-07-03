const express = require('express');
const cors = require('cors'); // Add this line
const app = express();
const routes = require('./routes');

// Enable CORS for frontend (React running on port 3000)
app.use(cors({
  origin: 'http://localhost:3000', // allow frontend origin
  credentials: true // enable if you use cookies or HTTP auth
}));

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static image files

app.use('/api', routes);

module.exports = app;
