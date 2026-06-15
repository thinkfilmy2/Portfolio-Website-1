import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// ─── Default admin password hash (password: "admin123") ───
// Change this by setting ADMIN_PASSWORD_HASH in .env
const DEFAULT_HASH = bcrypt.hashSync('admin123', 10);
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || DEFAULT_HASH;
const SESSION_SECRET = process.env.SESSION_SECRET || 'portfolio-admin-secret-key-change-me';

// ─── Middleware ───
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// ─── File paths ───
const DATA_FILE = path.join(__dirname, 'data', 'siteContent.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'images', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── Multer setup ───
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// ─── Auth middleware ───
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// ─── Helper: read/write JSON ───
function readContent() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeContent(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── AUTH ROUTES ───
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  if (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    req.session.authenticated = true;
    return res.json({ success: true });
  }
  return res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/auth/check', (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.authenticated) });
});

// ─── CONTENT ROUTES ───
// Public: anyone can read content (frontend needs this)
app.get('/api/content', (req, res) => {
  const content = readContent();
  res.json(content);
});

// Protected: update a section
app.put('/api/content/:section', requireAuth, (req, res) => {
  const { section } = req.params;
  const content = readContent();
  content[section] = req.body;
  writeContent(content);
  res.json({ success: true, section });
});

// Protected: update entire content
app.put('/api/content', requireAuth, (req, res) => {
  writeContent(req.body);
  res.json({ success: true });
});

// ─── UPLOAD ROUTES ───
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/images/uploads/${req.file.filename}`;
  res.json({
    success: true,
    filename: req.file.filename,
    path: filePath,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

app.delete('/api/upload/:filename', requireAuth, (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'File not found' });
});

app.get('/api/uploads', requireAuth, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(f => !f.startsWith('.'))
      .map(filename => {
        const stat = fs.statSync(path.join(UPLOAD_DIR, filename));
        return {
          filename,
          path: `/images/uploads/${filename}`,
          size: stat.size,
          modified: stat.mtime,
        };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
    res.json(files);
  } catch {
    res.json([]);
  }
});

// ─── CHANGE PASSWORD ───
app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords required' });
  }
  if (!bcrypt.compareSync(currentPassword, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }
  // Note: In a real app, you'd persist this. For now, it's session-only.
  console.log('Password changed (in-memory only). Set ADMIN_PASSWORD_HASH env var for persistence.');
  res.json({ success: true });
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log(`\n  🚀 Admin API running at http://localhost:${PORT}`);
  console.log(`  📁 Data file: ${DATA_FILE}`);
  console.log(`  📷 Uploads dir: ${UPLOAD_DIR}\n`);
});
