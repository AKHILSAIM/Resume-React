const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// your routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});