require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 8882;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

const db = mysql.createConnection({
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: 'codenames'
});

db.connect();

app.get('/getwords', (req, res) => {
  var sql = `SELECT * FROM vocabulary ORDER BY RAND() LIMIT 25`;

  db.query(sql, (err, result) => {
    if (err) { console.log(err) }
    var resultWithColors = addColor(result);
    res.send(resultWithColors);
  })

});

app.get('/collections/:listname', (req, res) => {
  var sql = `SELECT * FROM vocabulary WHERE collection=? ORDER BY RAND() LIMIT 25`;
  var queryArgs = [req.params.listname];

  db.query(sql, queryArgs, (err, result) => {
    if (err) { console.log(err) }
    var resultWithColors = addColor(result);
    res.send(resultWithColors);
  })

});

app.get('/collections', (req, res) => {
  var sql = `SELECT COUNT(*) as count, collection FROM vocabulary GROUP BY collection`;

  db.query(sql, (err, result) => {
    if (err) { console.log(err) }
    res.send(result);
  })

});

app.post('/addwords', (req, res) => {
  var sql = `INSERT INTO vocabulary (collection, word) VALUES (?, ?)`;
  var queryArgs = [req.body.list.toLowerCase(), req.body.word];

  db.query(sql, queryArgs, (err, result) => {
    if (err) { res.send('word already exists'); }
    res.send('word added');
  })

});

// adding random colors to each card, last card shows who start the game
var addColor = function(array) {
  var teams = ['red', 'blue'];
  var startTeam = teams[Math.floor(Math.random() * 2)];
  for (var i = 0; i < 25; i++) {
    if (i < 7) {
      array[i].color = 'yellow';
    } else if (i < 8) {
      array[i].color = 'black';
    } else if (i < 16) {
      array[i].color = 'blue';
    } else if (i < 24) {
      array[i].color = 'red';
    } else {
      if (startTeam === 'blue') {
        array[24].color = 'blue';
      } else {
        array[24].color = 'red';
      }
    }
  }
  return array;
}