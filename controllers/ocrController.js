const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

const processImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('File not received');
    }

    console.log('Processing file:', req.file);

    const { path: filePath } = req.file;
    const image = sharp(filePath);

    // Define regions of interest (ROIs)
    const rois = [
      { x: 50, y: 50, width: 200, height: 100 }, // Example ROI 1
      { x: 300, y: 200, width: 200, height: 100 }, // Example ROI 2
      // Add more ROIs as needed
    ];

    const texts = [];

    for (const roi of rois) {
      const buffer = await image.extract({ left: roi.x, top: roi.y, width: roi.width, height: roi.height }).toBuffer();
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
      texts.push({ roi, text });
    }

    // Save the results to a CSV file in the Testing folder
    const csv = parse(texts);
    const resultFilePath = path.join(__dirname, '../Testing', `${Date.now()}-result.csv`);
    fs.writeFileSync(resultFilePath, csv);

    res.status(200).json({ message: 'Image processed successfully', texts });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
};

module.exports = { processImage };