const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

// POST /addSchool - Add new school
router.post('/addSchool', schoolController.addSchool);

// GET /listSchools - Get schools sorted by proximity
router.get('/listSchools', schoolController.listSchools);

module.exports = router;