const express = require('express');
const mysql = require('mysql2');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'database-1.c12wio0iwfy7.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Bharat0802',
  database: 'mydb',
  port: 3306
});

// Function to ensure connection is active
function ensureConnection(callback) {
  connection.ping((err) => {
    if (err) {
      console.error('Connection lost, attempting to reconnect:', err);
      connection.connect((connectErr) => {
        if (connectErr) {
          console.error('Reconnection failed:', connectErr);
          callback(connectErr);
        } else {
          console.log('Reconnected to the database');
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  });
}

// Connect to database initially
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Wrap query execution with connection check
function queryWithConnectionCheck(query, params, callback) {
  ensureConnection((err) => {
    if (err) {
      callback(err);
      return;
    }
    connection.query(query, params, callback);
  });
}

// API Endpoints

// 1. GET all users
app.get('/api/users', (req, res) => {
  queryWithConnectionCheck('SELECT * FROM users', [], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 2. GET single user by ID
app.get('/api/users/:id', (req, res) => {
  queryWithConnectionCheck('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  });
});

// 3. POST create new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  queryWithConnectionCheck('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      created_at: new Date()
    });
  });
});

// 4. PUT update user
app.put('/api/users/:id', (req, res) => {
  const { name, email } = req.body;
  queryWithConnectionCheck('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// 5. DELETE user
app.delete('/api/users/:id', (req, res) => {
  queryWithConnectionCheck('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Add School API
app.post('/api/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'Name, address, latitude, and longitude are required' });
  }

  if (typeof name !== 'string' || typeof address !== 'string' || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ message: 'Invalid data types' });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({ message: 'Invalid latitude or longitude values' });
  }

  queryWithConnectionCheck('INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', 
    [name, address, latitude, longitude], 
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: result.insertId,
        name,
        address,
        latitude,
        longitude,
        created_at: new Date()
      });
    });
});

// List Schools API
app.get('/api/listSchools', (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'User latitude and longitude are required' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon) || userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
    return res.status(400).json({ message: 'Invalid latitude or longitude values' });
  }

  queryWithConnectionCheck('SELECT * FROM schools', [], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const schoolsWithDistance = results.map(school => ({
      ...school,
      distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  connection.end(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});
