const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Store Management API is running...');
});

// Import Routes
const categoryRoutes = require('./routes/categories');
const materialRoutes = require('./routes/materials');
const employeeRoutes = require('./routes/employees');
const issueRoutes = require('./routes/issues');
const stockRoutes = require('./routes/stock');
const reportRoutes = require('./routes/reports');

// Use Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
