const db = require('../config/db');

exports.addStock = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { material_id, supplier_name, quantity_added, remarks } = req.body;

        // 1. Update materials qty
        await connection.execute(
            'UPDATE materials SET remaining_qty = remaining_qty + ? WHERE id = ?',
            [quantity_added, material_id]
        );

        // 2. Log in stock_inward
        await connection.execute(
            'INSERT INTO stock_inward (material_id, supplier_name, quantity_added, remarks) VALUES (?, ?, ?, ?)',
            [material_id, supplier_name, parseInt(quantity_added), remarks]
        );

        await connection.commit();
        res.status(201).json({ message: 'Stock added successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

exports.getStockLogs = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT si.*, m.material_name, m.material_code 
            FROM stock_inward si 
            JOIN materials m ON si.material_id = m.id 
            ORDER BY si.date_added DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
