//this is an nodejs script that will be used to connect to database and get AE effects and send it to the client
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


//load config file. if not exists, create one
if (!fs.existsSync('private.json')) {
    fs.writeFileSync('private.json', JSON.stringify({"mongoDB": {"uri": "mongodb+srv://..."}}, null, 4));
    console.log('[DBAPI] private.json created. Please fill the data and restart the server.');
    process.exit(0);
}
const config = JSON.parse(fs.readFileSync('private.json', 'utf8'));
const uri = config.mongoDB.uri; //example: mongodb+srv://pindang2:<password>@aefxlib-1.c2hmmfx.mongodb.net/?retryWrites=true&w=majority


//connect to the database. database name: AE
mongoose.connect(uri, {dbName: 'AE'});
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[DBAPI] Connection error:'));
db.once('open', () => {
    console.log('[DBAPI] Connected to the database.');
});


function updateDB(db, lang) {
    //get the AE effects from all of JSON files under ./fxdata/(lang)/ directory
    if (!['en_US', 'ko_KR', 'ja_JP'].includes(lang) || lang == null) {
        return "[UPDATEDB ERR] Invalid language";
    }
    
    const dir = path.join(__dirname, 'fxdata', lang);
    const files = fs.readdirSync(dir);
    const effects = [];
    files.forEach(file => {
        const data = fs.readFileSync
        (path.join(dir, file), 'utf8');
        effects.push(JSON.parse(data));
    });

    //all data will saved under (lang) collection in 'AE' database
    //delete all data in the collection
    db.collection(lang).deleteMany({}, (err, result) => {
        console.log(result);
        if (err) {
            console.error(err);
        }
    });
    //insert all data to the collection
    db.collection(lang).insertMany(effects.flat(), (err, result) => {
        console.log(result);
        if (err) {
            console.error(err);
        }
    });

    
    return "[UPDATEDB] Database updated.";
}