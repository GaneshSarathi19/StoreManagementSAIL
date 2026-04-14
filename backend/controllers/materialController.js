const db = require('../config/db');

exports.getAllMaterials = async (req, res) => {
    try {
        const { category_id } = req.query;
        let query = 'SELECT m.*, c.name as category_name FROM materials m LEFT JOIN categories c ON m.category_id = c.id';
        let params = [];

        if (category_id) {
            query += ' WHERE m.category_id = ?';
            params.push(category_id);
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMaterialById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM materials WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Material not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMaterial = async (req, res) => {
    try {
        const { material_name, material_code, category_id, cost, remaining_qty, supplier_name, other_details } = req.body;
        const [result] = await db.execute(
            'INSERT INTO materials (material_name, material_code, category_id, cost, remaining_qty, supplier_name, other_details) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [material_name, material_code, category_id, cost, remaining_qty, supplier_name, other_details]
        );
        res.status(201).json({ id: result.insertId, message: 'Material created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMaterial = async (req, res) => {
    try {
        const { material_name, material_code, category_id, cost, remaining_qty, supplier_name, other_details } = req.body;
        await db.execute(
            'UPDATE materials SET material_name = ?, material_code = ?, category_id = ?, cost = ?, remaining_qty = ?, supplier_name = ?, other_details = ? WHERE id = ?',
            [material_name, material_code, category_id, cost, remaining_qty, supplier_name, other_details, req.params.id]
        );
        res.json({ message: 'Material updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        await db.execute('DELETE FROM materials WHERE id = ?', [req.params.id]);
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
