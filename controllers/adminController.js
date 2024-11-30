
const fs = require('fs');
const path = require('path');

const getDocuments = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/checks.json');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'No documents found' });
    }

    const data = fs.readFileSync(filePath);
    const documents = JSON.parse(data);

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ message: 'Error retrieving documents', error: error.message });
  }
};

module.exports = { getDocuments };