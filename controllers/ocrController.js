const vision = require('@google-cloud/vision');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');
const client = new vision.ImageAnnotatorClient();

const processImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('File not received');
    }

    console.log('Processing file:', req.file);

    const { path: filePath } = req.file;
    const image = await Jimp.read(filePath);

    // Define regions of interest (ROIs)
    const rois = [
      { x: 50, y: 50, width: 200, height: 100 }, // Example ROI 1
      { x: 300, y: 200, width: 200, height: 100 }, // Example ROI 2
      // Add more ROIs as needed
    ];

    const texts = [];

    for (const roi of rois) {
      const roiImage = image.clone().crop(roi.x, roi.y, roi.width, roi.height);
      const buffer = await roiImage.getBufferAsync(Jimp.MIME_PNG);
      const [result] = await client.textDetection(buffer);
      const detections = result.textAnnotations;
      const text = detections.length > 0 ? detections[0].description : '';
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