const express = require('express');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const dbcreator = require('./dbcreator.js');
const app = express();
const fs = require('fs');
const PORT = 5211;

////////////////////////
//     PREPARING      //
////////////////////////

if(!fs.existsSync("blacklist.json")){
    fs.writeFileSync("blacklist.json", "[{}]");
}
var reqlog = {};

//load sqlite db from /database/en_US.db, and create a new one if not exists
var db = new sqlite3.Database('database/en_US.db', (err) => {
    if (err) {
        console.error(err.message);
        if(err.message == "SQLITE_CANTOPEN: unable to open database file"){
            console.log("Creating a new database file...");
            dbcreator.createDB("en_US.db");
            console.log("Database file created.");
        }
    }
    console.log('Connected to the en_US database.');
});

////////////////////////
//     FUNCTIONS      //
////////////////////////

function handleListening (){
    console.log(`Listening on: http://localhost:${PORT}`);
}


////////////////////////
//     MIDDLEWARE     //
////////////////////////

//use ./webroot as root directory for web files
app.use(express.static(__dirname + "/webroot"));

// /-> webroot. delivers html, css, js, img, etc.
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/get", (req, res) => {
    //api
});

app.get("/api/refresh", (req, res) => {
    //verify the request by checking the token in header
    var token = req.headers.token;
    if(token == "p2workspae1234fxlib"){
        res.send("refreshing");
    }else{
        //set status code to 401
        res.status(401);
        res.send("ERR: unauthorized request.");
    }
    //clear now variable
    now = null;
});

app.listen(PORT, handleListening);