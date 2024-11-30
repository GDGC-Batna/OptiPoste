const express = require('express');
const { saveDocument, deleteDocument } = require('../controllers/documentController');

const router = express.Router();

router.post('/save', saveDocument);
router.delete('/delete/:id', deleteDocument);

module.exports = router;