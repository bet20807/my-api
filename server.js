const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');  // เพิ่มบรรทัดนี้
const app = express();
const port = 3000;

// เชื่อมต่อฐานข้อมูล
const dbPath = path.resolve(__dirname, 'lotto.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.error('Database path:', dbPath);
  } else {
    console.log('Connected to the lotto database.');
  }
});

app.use(express.json());

// ------------------------------------------------------------
// Users CRUD
// ------------------------------------------------------------
// Get all users
app.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    handleResponse(res, err, rows);
  });
});

// Get specific user by id
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM users WHERE user_id = ?', [id], (err, row) => {
    handleResponse(res, err, row, 404, 'User not found');
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const { username, password, email, phone } = req.body;
  db.run(
    'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)',
    [username, password, email, phone],
    function (err) {
      handleResponse(
        res,
        err,
        { message: 'User created successfully', id: this.lastID },
        500,
        'Failed to create user'
      );
    }
  );
});

// Update user
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { username, password, email, phone } = req.body;
  db.run(
    'UPDATE users SET username = ?, password = ?, email = ?, phone = ? WHERE user_id = ?',
    [username, password, email, phone, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: 'User updated successfully' },
        404,
        'User not found',
        this.changes
      );
    }
  );
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM users WHERE user_id = ?', [id], function (err) {
    handleResponse(
      res,
      err,
      { message: 'User deleted successfully' },
      404,
      'User not found',
      this.changes
    );
  });
});

// ------------------------------------------------------------
// Lotto Draws CRUD
// ------------------------------------------------------------
// Get all lotto draws
app.get('/lotto_draws', (req, res) => {
  db.all('SELECT * FROM lotto_draws', [], (err, rows) => {
    handleResponse(res, err, rows);
  });
});

// Get specific lotto draw by id
app.get('/lotto_draws/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM lotto_draws WHERE draw_id = ?', [id], (err, row) => {
    handleResponse(res, err, row, 404, 'Lotto draw not found');
  });
});

// Create a new lotto draw
app.post('/lotto_draws', (req, res) => {
  const { draw_date } = req.body;
  db.run(
    'INSERT INTO lotto_draws (draw_date) VALUES (?)',
    [draw_date],
    function (err) {
      handleResponse(
        res,
        err,
        { message: 'Lotto draw created successfully', id: this.lastID },
        500,
        'Failed to create lotto draw'
      );
    }
  );
});

// Update lotto draw
app.put('/lotto_draws/:id', (req, res) => {
  const id = req.params.id;
  const { draw_date, winning_number, is_drawn } = req.body;
  db.run(
    'UPDATE lotto_draws SET draw_date = ?, winning_number = ?, is_drawn = ? WHERE draw_id = ?',
    [draw_date, winning_number, is_drawn, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: 'Lotto draw updated successfully' },
        404,
        'Lotto draw not found',
        this.changes
      );
    }
  );
});

// Delete lotto draw
app.delete('/lotto_draws/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM lotto_draws WHERE draw_id = ?', [id], function (err) {
    handleResponse(
      res,
      err,
      { message: 'Lotto draw deleted successfully' },
      404,
      'Lotto draw not found',
      this.changes
    );
  });
});

// ------------------------------------------------------------
// Helper function for handling responses
// ------------------------------------------------------------
function handleResponse(res, err, data, notFoundStatusCode = 404, notFoundMessage = 'Not found', changes = null) {
  if (err) {
    res.status(500).json({ error: err.message });
    return;
  }
  if (!data && !changes) {
    res.status(notFoundStatusCode).json({ error: notFoundMessage });
    return;
  }
  res.json(data);
}

// ------------------------------------------------------------
// Start server
// ------------------------------------------------------------

app.listen(port, () => {
  console.log(`Lotto API listening at http://localhost:${port}`);
});
