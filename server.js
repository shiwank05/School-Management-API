const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const schoolRoutes = require('./routes/schoolRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', schoolRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Management API is running',
    version: '1.0.0',
    endpoints: {
      addSchool: 'POST /api/addSchool',
      listSchools: 'GET /api/listSchools?latitude={lat}&longitude={lon}'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}`);
      console.log(`Add School: POST http://localhost:${PORT}/api/addSchool`);
      console.log(`List Schools: GET http://localhost:${PORT}/api/listSchools?latitude={lat}&longitude={lon}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Export for testing
module.exports = app;