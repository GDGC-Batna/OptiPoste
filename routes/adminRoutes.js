
const express = require('express');
const { getDocuments } = require('../controllers/adminController');

const router = express.Router();

router.get('/checks', getDocuments);

module.exports = router;