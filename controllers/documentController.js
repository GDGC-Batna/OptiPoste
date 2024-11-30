const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const saveDocument = async (req, res) => {
  try {
    const document = { ...req.body, id: uuidv4() };
    const filePath = path.join(__dirname, '../data/checks.json');

    // Read existing documents
    let documents = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      documents = JSON.parse(data);
    }

    // Add new document
    documents.push(document);

    // Save documents back to file
    fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

    res.status(201).json({ message: 'Document saved successfully', document });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ message: 'Error saving document', error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(__dirname, '../data/checks.json');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'No documents found' });
    }

    const data = fs.readFileSync(filePath);
    let documents = JSON.parse(data);

    // Filter out the document with the given ID
    documents = documents.filter(doc => doc.id !== id);

    // Save the updated documents back to file
    fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
};

module.exports = { saveDocument, deleteDocument };