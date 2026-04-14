const db = require('../config/db');

exports.getReports = async (req, res) => {
    try {
        const { type, from_date, to_date, category_id, material_code, emp_id, department, quick_filter } = req.query;

        let query = '';
        let params = [];
        let whereClauses = [];

        if (type === 'issued') {
            query = `SELECT ii.*, m.id as mat_id, c.name as category_name 
                     FROM issued_items ii 
                     LEFT JOIN materials m ON ii.material_id = m.id 
                     LEFT JOIN categories c ON m.category_id = c.id`;
        } else {
            query = `SELECT si.*, m.material_name, m.material_code, c.name as category_name 
                     FROM stock_inward si 
                     JOIN materials m ON si.material_id = m.id 
                     LEFT JOIN categories c ON m.category_id = c.id`;
        }

        // Apply filters
        if (category_id) {
            whereClauses.push('c.id = ?');
            params.push(category_id);
        }
        if (material_code) {
            whereClauses.push('m.material_code = ?');
            params.push(material_code);
        }
        if (type === 'issued' && emp_id) {
            whereClauses.push('ii.emp_id = ?');
            params.push(emp_id);
        }
        if (type === 'issued' && department) {
            whereClauses.push('ii.department = ?');
            params.push(department);
        }

        // Date Filters
        if (quick_filter) {
            const now = new Date();
            let dateLimit;
            if (quick_filter === 'today') {
                dateLimit = new Date(now.setHours(0, 0, 0, 0));
            } else if (quick_filter === '6months') {
                dateLimit = new Date();
                dateLimit.setMonth(dateLimit.getMonth() - 6);
            } else if (quick_filter === '1year') {
                dateLimit = new Date();
                dateLimit.setFullYear(dateLimit.getFullYear() - 1);
            } else if (quick_filter === '3years') {
                dateLimit = new Date();
                dateLimit.setFullYear(dateLimit.getFullYear() - 3);
            }
            if (dateLimit) {
                whereClauses.push(`${type === 'issued' ? 'ii.issued_date' : 'si.date_added'} >= ?`);
                params.push(dateLimit);
            }
        } else if (from_date && to_date) {
            whereClauses.push(`${type === 'issued' ? 'ii.issued_date' : 'si.date_added'} BETWEEN ? AND ?`);
            params.push(new Date(from_date), new Date(to_date));
        }

        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
