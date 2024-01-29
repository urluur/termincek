const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require("dotenv").config();
const app = express()

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));

app.use(cors(
  {
    origin: '*',
    credentials: true,
    exposedHeaders: ['set-cookie']
  }
))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const db = require('./db/dbConn');

const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', require('./routes/routes'));
app.use('/auth', require('./routes/auth'));
app.use('/', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

app.listen(process.env.PORT, () => {
  console.log('Server is running on port: ' + process.env.PORT);
});
