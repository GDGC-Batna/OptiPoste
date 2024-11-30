const Tesseract = require('tesseract.js');
const Document = require('../models/Document');

const processImage = async (req, res) => {
  try {
    const { path } = req.file;
    const { data: { text } } = await Tesseract.recognize(path, 'eng');
    
    const document = new Document({ text });
    await document.save();

    res.status(200).json({ message: 'Document processed successfully', text });
  } catch (error) {
    res.status(500).json({ message: 'Error processing document', error });
  }
};

module.exports = { processImage };