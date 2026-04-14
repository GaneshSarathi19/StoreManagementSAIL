const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
