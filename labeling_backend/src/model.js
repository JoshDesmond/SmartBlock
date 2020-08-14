import sqlite3 from 'sqlite3';

class Model {
    constructor() {
        console.log("Constructing a model, hello world!");
        this.db = new sqlite3.Database('labels.sqlite');
    }

    doSomething(body) {
        console.log("Here's a body: " + body);
        console.log(`Body.url: ${body.url}`);
        console.log(`Body.title: ${body.title}`);
    }

    /**
     * Console logs the entire database
     */
    printDatabase() {
        console.log(this.db);
        this.db.all('SELECT SnapshotId, Url, Title FROM Snapshots', printSnapshots);

        function printSnapshots(err, rows) {
            if (err) console.log(err);

            for (let row of rows) {
                this.db.get('SELECT * FROM Labels WHERE SnapshotID=?',
                    [row.SnapshotId], printLabel);

                function printLabel(innerErr, innerRow) {
                    if (innerErr) console.log(innerErr);
                    console.log(`URL: ${row.Url}, Label: ${JSON.stringify(innerRow)}`);
                }
            }
        }
    }
}

export {Model}
