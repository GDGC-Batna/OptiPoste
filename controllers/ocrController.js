const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { upload, deleteFile } = require('../middlewares/upload');

const processImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('File not received');
    }

    console.log('Processing file:', req.file);

    const { path: filePath } = req.file;
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Define regions of interest (ROIs)
    const rois = [
      { name: 'amount', x: 488, y: 8, width: 169, height: 36},
      { name: 'recepient', x: 157, y: 84, width: 415, height: 49},
      { name: 'date', x: 547, y: 121, width: 96, height: 39},
      { name: 'ncheck', x: 18, y: 263, width: 75, height: 26},
      { name: 'naccount', x: 176, y: 252, width: 244, height: 44},
    ];

    const extractedData = {};

    for (const roi of rois) {
      // Validate ROI boundaries
      if (roi.x + roi.width > metadata.width || roi.y + roi.height > metadata.height) {
        throw new Error(`ROI ${roi.name} is out of image boundaries`);
      }

      const buffer = await image.extract({ left: roi.x, top: roi.y, width: roi.width, height: roi.height }).toBuffer();
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng+ara', {
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' 
      });
      extractedData[roi.name] = text.trim();
    }

    // Assign a unique ID to the check
    extractedData.id = uuidv4();

    deleteFile(filePath);

    res.status(200).json(extractedData);
  } catch (error) {
    console.error('Error processing image:', error);
    deleteFile(req.file.path); // Ensure file is deleted in case of error
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
};

module.exports = { processImage };