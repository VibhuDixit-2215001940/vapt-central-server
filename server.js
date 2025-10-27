const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const cors = require('cors'); 

// load env vars
dotenv.config();

// connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // allow CORS for all routes
app.use(express.json({ limit: '50mb' })); // to handle JSON payloads with increased limit

// API Routes
app.use('/api/v1', apiRoutes);

// Basic route to check server status
app.get('/', (req, res) => {
    res.send('VAPT Central Server API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));