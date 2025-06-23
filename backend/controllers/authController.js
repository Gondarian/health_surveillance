const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Security constants
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '1h';

const loginUser = (req, res) => {
  console.log('RAW REQUEST BODY:', req.body);

  const { username, password } = req.body;
  console.log(`Login attempt for: ${username}`);

  const sql = 'SELECT * FROM Users WHERE username = ?';
  db.query(sql, [username.trim()], async (err, results) => {
    if (err) {
      console.error('DATABASE ERROR:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    try {
      const validPass = await bcrypt.compare(password.trim(), user.password);
      if (!validPass) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      res.json({
        message: 'Login successful',
        token
      });

    } catch (err) {
      console.error('BCRYPT ERROR:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  });
};


const registerUser = async (req, res) => {
  // Validate all fields
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate role enum
  const validRoles = ['admin', 'health_worker', 'viewer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  try {
    // Check for existing user first
    const checkSql = 'SELECT id FROM Users WHERE username = ? LIMIT 1';
    db.query(checkSql, [username], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Duplicate check error:', checkErr);
        return res.status(500).json({ error: 'Registration failed' });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      const insertSql = 'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)';
      db.query(insertSql, [username, hashedPassword, role], (insertErr) => {
        if (insertErr) {
          console.error('Registration error:', insertErr);
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    console.error('Password hashing error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

module.exports = { loginUser, registerUser };