const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/ai.controller');
const protect = require('../middleware/protect');

router.post('/generate-image', protect, generateImage);

module.exports = router;