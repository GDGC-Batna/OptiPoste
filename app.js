const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ocrRoutes = require('./routes/ocrRoutes');

dotenv.config();
// connectDB(); // Comment out or remove this line

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/ocr', ocrRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});