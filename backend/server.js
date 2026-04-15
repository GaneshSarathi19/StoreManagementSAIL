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

// Seed Categories function
const seedCategories = async () => {
    try {
        const db = require('./config/db');
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM categories');
        if (rows[0].count === 0) {
            console.log('Seeding initial categories...');
            await db.execute('INSERT INTO categories (name) VALUES ("Cartridges"), ("Toners"), ("Stationaries")');
            console.log('Categories seeded successfully.');
        }
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
};

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await seedCategories();
});
