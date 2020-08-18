import sqlite3 from 'sqlite3';


class Model {
    constructor() {
        console.log("Constructing a model, hello world!");
        this.db = new sqlite3.Database('labels.sqlite');
    }


    postSnapshotLabel(data, response) {
        const url = data.webpage.url;
        this.createWebpage(data.webpage);
        // TODO convert this to use promises or something, (nested callbacks are ugly).
        this.createSnapshot(data.snapshot, url, (snapshotId) => {
            this.createLabel(data.label, snapshotId, (labelId) => {
                const responseJSON = {
                    status: "success",
                    url: url,
                    snapshotId: snapshotId,
                    labelId: labelId,
                };

                console.log(response);
                response.json(responseJSON);
            });
        });
    }

    /**
     *
     * @param webpage JSON object with fields url and domain
     */
    createWebpage(webpage) {
        console.log(`creating webpage with webpage.url === ${webpage.url}`);
        const sqlString = `INSERT INTO Webpages(Url, Domain)
                           VALUES (?, ?)`;


        this.db.run(sqlString, [webpage.url, webpage.domain], (err) => {
            if (err) {
                console.log(err.message);
            }
        });

    }

    /**
     * Inserts a new snapshot into the database and returns the SnapshotId
     *
     * @param url of the website
     * @param snapshot JSON object with fields dateTime, title, contentRaw
     * @param callback Callback to return the SnapshotId
     */
    createSnapshot(snapshot, url, callback) {
        console.log(`creating snapshot with snapshot.url === ${url}`);
        const sqlString = `INSERT INTO Snapshots(Url, DateTime, Title, ContentRaw)
                           VALUES (?, ?, ?, ?)`;
        const params = [url, snapshot.dateTime, snapshot.title, snapshot.contentRaw];
        this.db.run(sqlString, params, function (err) {
            if (err) {
                console.log(err.message);
            }

            callback(this.lastID);
        });
    }

    /**
     * Inserts the given label into the database with the given snapshotId
     *
     * @param label
     * @param {Number} snapshotId
     * @param {function} callback Callback to return inserted labelId
     */
    createLabel(label, snapshotId, callback) {
        console.log(`creating label with snapshotId === ${snapshotId}`);
        const sqlString = `INSERT INTO Labels(PrimaryVote, SecondaryVote, IsObvious,
                                              IsAmbiguous, Topic, SnapshotId)
                           VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [label.primaryVote, label.secondaryVote, label.isObvious,
            label.isAmbiguous, label.topic, snapshotId];

        this.db.run(sqlString, params, function (err) {
            if (err) {
                console.log(err.message);
            }

            callback(this.lastID);
        });

    }

    createFlags() {

    }

    /**
     * Console logs the entire database
     * @deprecated TODO clean this up into something useful or delete it
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

    /**
     * Clears all entries in snapshots (for use in development)
     */
    clearDatabase() {
        console.log("Clearing Database");
        this.db.run(`DELETE
                     FROM Snapshots`);
        this.db.run(`DELETE
                     FROM Labels`);
        this.db.run(`DELETE
                     FROM Webpages`);
        this.db.run(`DELETE
                     FROM Flags`);
    }
}

export {Model}
