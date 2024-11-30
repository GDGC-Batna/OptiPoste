const Tesseract = require('tesseract.js');
const { PDFDocument } = require('pdf-lib');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const processImage = async (req, res) => {
  try {
    const { path: filePath } = req.file;

    // Read the PDF file
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    const texts = [];

    for (const page of pages) {
      const { width, height } = page.getSize();
      const pageImage = await page.renderToImage({ width, height });
      const image = await Jimp.read(pageImage);

      // Define regions of interest (ROIs)
      const rois = [
        { x: 50, y: 50, width: 200, height: 100 }, // Example ROI 1
        { x: 300, y: 200, width: 200, height: 100 }, // Example ROI 2
        // Add more ROIs as needed
      ];

      for (const roi of rois) {
        const roiImage = image.clone().crop(roi.x, roi.y, roi.width, roi.height);
        const buffer = await roiImage.getBufferAsync(Jimp.MIME_PNG);
        const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        });
        texts.push(text);
      }
    }

    // Save the results to a file in the testing folder
    const resultFilePath = path.join(__dirname, '../testing', `${Date.now()}-result.txt`);
    fs.writeFileSync(resultFilePath, texts.join('\n'));

    res.status(200).json({ message: 'Document processed successfully', texts });
  } catch (error) {
    res.status(500).json({ message: 'Error processing document', error });
  }
};

module.exports = { processImage };