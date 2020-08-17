import sqlite3 from 'sqlite3';

class Model {
    constructor() {
        console.log("Constructing a model, hello world!");
        this.db = new sqlite3.Database('labels.sqlite');
    }

    /**
     *
     * @param webpage JSON object with fields url and domain
     */
    createWebpage(webpage) {

        const sqlString = `INSERT INTO Webpages(Url, Domain)
                           VALUES (?, ?)`;

        this.db.run(sqlString, [webpage.url, webpage.domain], (err) => {
            if (err) {
                console.log(err.message);
            }

            return webpage.url;
            // TODO return url
        });

    }

    /**
     *
     * @param url of the website
     * @param snapshot JSON object with fields dateTime, title, contentRaw
     */
    createSnapshot(snapshot, url) {
        const sqlString = `INSERT INTO Snapshots(Url, DateTime, Title, ContentRaw)
                           VALUES (?, ?, ?, ?)`;
        const params = [url, snapshot.dateTime, snapshot.title, snapshot.contentRaw];
        this.db.run(sqlString, params, (err) => {
            if (err) {
                console.log(err.message);
            }

            // TODO log status, return snapshotId
        });
    }

    createLabel(label, snapshotId) {
        // TODO
        const sqlString = `INSERT INTO Labels(PrimaryVote, SecondaryVote, IsObvious,
                                              IsAmbiguous, Topic, SnapshotId)
                           VALUES (?, ?, ?, ?, ?, ?)`;
        const params = []

    }

    createFlags() {

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
