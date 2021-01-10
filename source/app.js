// Express.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Crypto
const crypto = require('crypto');

function sha256(data) {
  return crypto.createHash("sha256").update(data, "binary").digest("hex");
}

// DB Config
const mysql = require('mysql');
const dbconfig = require('./config/db.js');
const conn = dbconfig.init();

// PORT Definition
const PORT = 5001;

// DB Connection
dbconfig.connect(conn);

app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// main page
app.get('/',(req, res) => {
    console.log("Success");
    res.send("Hello");
});

// Register Page
app.get('/register', (req, res) => {
    console.log("Register");
    res.render('register.ejs');
});

// Register Logic
app.post('/register', (req, res) => {
    name = req.body.name
    id = req.body.id
    pw = req.body.pw
    rpw = req.body.rpw

    query = "SELECT * FROM users WHERE id = '" + id + "'";
    conn.query(query, function(err, data) {
        if(data.length == 0){
            console.log("Good");
        }else{
          res.send("<script>alert('이미 존재하는 사용자입니다.');history.go(-1);</script>");
        }
    });

    if(pw !== rpw){
        res.send("<script>alert('동일한 비밀번호를 입력해주세요.');history.go(-1);</script>");
    }

    res.end("GOOD");
});

// Login Page
app.get('/login', (req, res) => {
    console.log("Login");
    res.render('login.ejs');
});

// Login Logic
app.post('/login', (req, res) => {
    id = req.body.id
    pw = req.body.pw

    query = "SELECT * FROM users where id = '" + id + "'"
    console.log(query);

});

// User Information
app.get('/users', (req, res) => {
    let query = "SELECT * FROM users";
    conn.query(query, function(err, rows, fields){
        if(err) console.log('query is not excuted, select fail...\n' + err);
        else res.render('admin_users.ejs', {list : rows});
    });
});

/*// User Information Update
app.get('/update', (req, res) => {
    let query = "SELECT * FROM users WHERE _id = 1";
    conn.query(query, function(err, rows, fileds){
        if(err) console.log('query is not excuted, select fail...\n' + err);
        //else console.log(rows[0].id);
        else res.render('admin_update.ejs', {list : rows});
    });
});
*/

app.post('/update', (req, res) => {
    console.log(req.body);
    let query = "DELETE FROM users WHERE _id = " + req.body.id;
    console.log(query);
    conn.query(query, function(err, rows){
        console.log(rows);
        if(err){
                console.log("query is not excute, Delete Fail...\n" + err);
        }else{
                console.log("Success");
        }
    });
});

app.listen(PORT, () => {
    console.log("Listeing PORT " + PORT + "....");
})