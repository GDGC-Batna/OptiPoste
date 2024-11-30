const express = require('express');
const { processImage } = require('../controllers/ocrController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/upload', upload.single('image'), processImage);

module.exports = router;