function createDB(language) {
    const sqlite3 = require('sqlite3').verbose();
    const datapath = "fxdata/" + language; //this is the path to the folder containing the fx data
    //데이터 파일은 fxdata/en_US/ 폴더에 있음. 이 폴더에 있는 모든 파일들을 읽어서 데이터베이스를 만들어야 함.
    const fs = require('fs');
    var db = new sqlite3.Database('database/' + language, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('[DBCREATOR] Connected to the ' + language + ' database.');
    });
}