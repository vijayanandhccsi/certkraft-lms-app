import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize Environment Variables
dotenv.config();

console.log('Starting CertKraft LMS Server...');

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'certkraft_master',
  password: process.env.DB_PASSWORD || 'KkPy*JUTm#O6s',
  database: process.env.DB_NAME || 'certkraft_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Database Connection
const pool = mysql.createPool(DB_CONFIG);

// Check DB Connection (Non-blocking)
pool.getConnection()
  .then(conn => {
    console.log(`✅ Connected to MySQL Database: ${DB_CONFIG.database}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️  Running in Offline/Mock Mode - API will return simulated data where possible.');
  });

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Get All Courses
app.get('/api/courses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE status = "Published"');
    res.json(rows);
  } catch (error) {
    console.error('API Error (Courses):', error.message);
    // If DB fails, we could return an empty array or 500. 
    // For now, let's return 500 so the frontend falls back to mock data if implemented there.
    res.status(500).json({ error: error.message });
  }
});

// Get Specific Course
app.get('/api/courses/:id', async (req, res) => {
  try {
    const [course] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (course.length === 0) return res.status(404).json({ message: 'Course not found' });

    const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY sort_order', [req.params.id]);
    
    for (let mod of modules) {
      const [lessons] = await pool.query('SELECT * FROM lessons WHERE module_id = ? ORDER BY sort_order', [mod.id]);
      mod.lessons = lessons;
    }

    const result = course[0];
    result.modules = modules;
    res.json(result);
  } catch (error) {
    console.error('API Error (Course Detail):', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Mock Auth
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  try {
    // Basic query to check existence
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      const user = users[0];
      res.json({ 
        token: 'mock-jwt-token-' + user.id,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // Mock success for development if DB is empty or connection failed
      res.json({ 
        token: 'mock-jwt-token-dev',
        user: { id: 999, name: 'Dev User', email: email, role: 'Student' }
      });
    }
  } catch (error) {
    console.error('Auth Error:', error.message);
    // Fallback for demo purposes if DB fails
    res.json({ 
      token: 'mock-jwt-token-fallback',
      user: { id: 999, name: 'Fallback User', email: email, role: 'Student' }
    });
  }
});

// Profile
app.get('/api/me/profile', (req, res) => {
  // Return static mock data for now, or fetch from DB if you expand the schema
  res.json({
    student: { id: 1, name: 'Demo Student', email: 'student@demo.com', role: 'Student', avatar: '' },
    stats: { totalHours: 10, labsCompleted: 2, certificatesEarned: 0, badges: [], currentStreak: 1 },
    enrolledCourses: [],
    enrolledPaths: []
  });
});

// Serve Static Frontend (Production Mode)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Handle SPA Routing - send index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- SERVER STARTUP ---

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n🚀 Server running on port ${port}`);
    if (port === 80) {
      console.log(`   Public: http://www.certkraft.com`);
    } else {
      console.log(`   Public: http://www.certkraft.com:${port}`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EACCES' && port === 80) {
      console.log('⚠️  Permission denied on port 80. Attempting fallback to port 3000...');
      startServer(3000);
    } else if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is in use. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
    }
  });
};

const PREFERRED_PORT = process.env.PORT ? parseInt(process.env.PORT) : 80;
startServer(PREFERRED_PORT);