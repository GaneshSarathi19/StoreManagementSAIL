const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

router.post('/', issueController.issueItem);
router.get('/', issueController.getAllIssues);

module.exports = router;
