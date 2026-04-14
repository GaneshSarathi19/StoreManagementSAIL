const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/inward', stockController.addStock);
router.get('/logs', stockController.getStockLogs);

module.exports = router;
