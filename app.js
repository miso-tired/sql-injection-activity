const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();


app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, PASSWORD TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('Ant', '123', 'Administrator')");
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/login', function(req, res) {
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password:', password);
    
    const query = `SELECT title FROM user WHERE username = '${username}' AND password = '${password}';`;
    console.log('SQL Query:', query);
    
    db.get(query, function (err, row) {
        if (err) {
            console.error('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send(`Hello <b>${row.title}</b>!<br /> 
                      This file contains all your secret data: <br /><br /> 
                      SECRETS <br /><br /> MORE SECRETS <br /><br /> 
                      <a href="/index.html">Go back to login</a>`);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});