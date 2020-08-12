import sqlite3 from 'sqlite3';

class Model {
    constructor() {
        console.log("Constructing a model, hello world!");
        this.db = new sqlite3.Database('labels.sqlite');
    }

    doSomething(body) {
        console.log("Here's a body: " + body);
    }

    /**
     * Console logs the entire database
     */
    printDatabase() {
        this.db.all('SELECT * FROM Labels', (err, rows) => {
            if (err) console.log(err);
            else console.log(rows);
        });
    }
}

export {Model}