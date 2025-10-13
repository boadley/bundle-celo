// backend/src/app.js

const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");
const app = express();



// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    'http://localhost:5173',
    'https://bug-free-cod-vg7gg5v67j6cp79g-5173.app.github.dev',
    'https://bug-free-cod-vg7gg5v67j6cp79g.app.github.dev'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};



app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000);
  next();
});

app.use("/api", apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Placeholder for server listen logic
// To be implemented after setting up environment and dependencies
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});


module.exports = app;
