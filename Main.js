const express = require('express');
const cors = require('cors');
const db = require('./database');  // Import the database connection

const app = express();
app.use(express.json());
app.use(cors());

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, due_date, status } = req.body;

  const query = 'INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)';
  db.query(query, [title, description, due_date, status], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId });
  });
});

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET /tasks/:id - Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM tasks WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });
});

// PUT /tasks/:id - Update a specific task by ID
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, status } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?';

  db.query(query, [title, description, due_date, status, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows > 0) {
      res.json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });
});

// DELETE /tasks/:id - Delete a specific task by ID
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows > 0) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
