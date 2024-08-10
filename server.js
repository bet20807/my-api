const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple GET endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// POST endpoint
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({
    message: 'Data received successfully',
    data: data
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
