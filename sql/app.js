const sqlite3 = require("sqlite3").verbose();

// Code partially from: https://www.sqlitetutorial.net/sqlite-nodejs/connect/
let db = new sqlite3.Database(":memory:", function (err) {
    "use strict";
    if (err) {
        console.log("Could not connect to database", err);
    } else {
        console.log("Connected to database");
    }
});

// Code from: https://charlietheprogrammer.com/the-best-nodejs-sqlite-tutorial-part-1/
const dbSchema = `CREATE TABLE IF NOT EXISTS Users (
        id integer NOT NULL PRIMARY KEY,
        login text NOT NULL UNIQUE,
        password text NOT NULL,
        email text NOT NULL UNIQUE,
        first_name text,
        last_name text
    );`;

db.exec(dbSchema, function (err) {
    "use strict";
    if (err) {
        console.log(err);
    }
});

db.close();
