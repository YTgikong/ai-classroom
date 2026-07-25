const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');

const PORT = process.env.PORT || 8080;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
// sha256('12345') — same default as the previous client-side-only password.
const DEFAULT_ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
  || '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

const redis = createClient({ url: REDIS_URL });
redis.on('error', (err) => console.error('Redis error:', err));

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

async function getAdminPasswordHash() {
  const stored = await redis.get('admin_password_hash');
  return stored || DEFAULT_ADMIN_PASSWORD_HASH;
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || !(await redis.exists(`session:${token}`))) {
    return res.status(401).json({ error: '未登入或登入已過期' });
  }
  next();
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/prompts', async (req, res) => {
  const data = await redis.get('prompts');
  res.json(data ? JSON.parse(data) : null);
});

app.post('/api/prompts', requireAuth, async (req, res) => {
  await redis.set('prompts', JSON.stringify(req.body));
  res.json({ ok: true });
});

app.post('/api/login', async (req, res) => {
  const { password } = req.body || {};
  if (!password || sha256(password) !== (await getAdminPasswordHash())) {
    return res.status(401).json({ error: '密碼錯誤' });
  }
  const token = crypto.randomBytes(24).toString('hex');
  await redis.set(`session:${token}`, '1', { EX: SESSION_TTL_SECONDS });
  res.json({ token });
});

app.post('/api/logout', requireAuth, async (req, res) => {
  const token = req.headers.authorization.slice(7);
  await redis.del(`session:${token}`);
  res.json({ ok: true });
});

app.post('/api/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || sha256(currentPassword) !== (await getAdminPasswordHash())) {
    return res.status(401).json({ error: '目前密碼錯誤' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: '新密碼至少需要 6 碼' });
  }
  await redis.set('admin_password_hash', sha256(newPassword));
  res.json({ ok: true });
});

redis.connect().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
