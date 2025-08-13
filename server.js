// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Helpers
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send('<h2>Both fields are required. <a href="/register">Go back</a></h2>');
  }
  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.send('<h2>⚠ Username already exists. <a href="/register">Try again</a></h2>');
  }
  users.push({ username, password });
  saveUsers(users);
  res.send('<h2>✅ Registration successful! <a href="/">Login here</a></h2>');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    // redirect to education landing
    res.redirect('/education.html');
  } else {
    res.send('<h2>❌ Invalid username or password. <a href="/">Try again</a> or <a href="/register">Register</a></h2>');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
