const express = require('express')
const { get } = require('./todo-service')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express()
app.use(express.json());
const port = 3000

let refreshTokens = [];
const SECRET = 'your-secret-key';
const REFRESH_SECRET = 'your-refresh-secret-key';

app.get('/todo', async (req, res) => {
  try {
    const content = await get()
    return res.json({ result: content })
  } catch (err) {
    return res.status(500).json({ result: 'server internal error', error: err })
  }
})

app.post('/signup', async (req, res) => {
  const { id, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // save id and hashedPassword to db
});

app.post('/signin', async (req, res) => {
  const { id, password } = req.body;
  // get user from db
  const user = {}; // fetched from db
  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ id: user.id }, SECRET, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '14d' });
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/refresh', (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    return res.status(403).json({ message: 'Refresh token is not valid or expired' });
  }
  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Refresh token is not valid or expired' });
    const accessToken = jwt.sign({ id: user.id }, SECRET, { expiresIn: '5m' });
    res.json({ accessToken });
  });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token is missing' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Access token is not valid or expired' });
    req.user = user;
    next();
  });
};

app.get('/todo', authenticateToken, (req, res) => {
  // handle GET /todo
});

app.post('/todo', authenticateToken, (req, res) => {
  // handle POST /todo
});

const server = app.listen(port, () => {
  console.log(`Todo app listening on port ${port}`)
})

module.exports = { app, server }
