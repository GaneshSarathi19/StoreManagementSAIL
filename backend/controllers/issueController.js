const db = require('../config/db');

exports.issueItem = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { material_id, quantity, emp_id, employee_name, department, remarks } = req.body;

        // 1. Get material details and check stock
        const [materials] = await connection.execute('SELECT * FROM materials WHERE id = ?', [material_id]);
        if (materials.length === 0) {
            throw new Error('Material not found');
        }

        const material = materials[0];
        if (material.remaining_qty < quantity) {
            throw new Error('Insufficient stock');
        }

        // 2. Deduct from inventory
        await connection.execute(
            'UPDATE materials SET remaining_qty = remaining_qty - ? WHERE id = ?',
            [quantity, material_id]
        );

        // 3. Store in issued_items (snapshot)
        await connection.execute(
            'INSERT INTO issued_items (material_id, material_name, material_code, emp_id, employee_name, department, quantity, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [material_id, material.material_name, material.material_code, emp_id, employee_name, department, quantity, remarks]
        );

        // 4. Update or Insert employee record for auto-fill later
        const [empExists] = await connection.execute('SELECT * FROM employees WHERE emp_id = ?', [emp_id]);
        if (empExists.length === 0) {
            await connection.execute(
                'INSERT INTO employees (emp_id, name, department) VALUES (?, ?, ?)',
                [emp_id, employee_name, department]
            );
        } else {
            await connection.execute(
                'UPDATE employees SET name = ?, department = ? WHERE emp_id = ?',
                [employee_name, department, emp_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Item issued successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
};

exports.getAllIssues = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM issued_items ORDER BY issued_date DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
