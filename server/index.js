require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Defaults updated to match production setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'certkraft_master',
  password: process.env.DB_PASSWORD || 'KkPy*JUTm#O6s',
  database: process.env.DB_NAME || 'certkraft_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check DB Connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL Database');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', db: 'connected' });
});

// Get All Courses
app.get('/api/courses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE status = "Published"');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get Specific Course with Modules & Lessons
app.get('/api/courses/:id', async (req, res) => {
  try {
    const [course] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (course.length === 0) return res.status(404).json({ message: 'Course not found' });

    // Fetch modules
    const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY sort_order', [req.params.id]);
    
    // Fetch lessons for each module
    for (let mod of modules) {
      const [lessons] = await pool.query('SELECT * FROM lessons WHERE module_id = ? ORDER BY sort_order', [mod.id]);
      mod.lessons = lessons;
    }

    const result = course[0];
    result.modules = modules;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Mock Auth Login (Replace with real JWT/BCrypt in production)
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      const user = users[0];
      res.json({ 
        token: 'mock-jwt-token-' + user.id,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login error' });
  }
});

// Student Profile (Mock Implementation)
app.get('/api/me/profile', (req, res) => {
  res.json({
    student: { id: 1, name: 'Demo Student', email: 'student@demo.com', role: 'Student', avatar: '' },
    stats: { totalHours: 10, labsCompleted: 2, certificatesEarned: 0, badges: [], currentStreak: 1 },
    enrolledCourses: [],
    enrolledPaths: []
  });
});

// Serve Static Frontend (Production Mode)
// NOTE: Nginx/Apache usually serves static files, but this acts as a fallback or for local testing
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});