const db = require('../config/db');

exports.getEmployeeById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM employees WHERE emp_id = ?', [req.params.emp_id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Employee not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM employees');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
