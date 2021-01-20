import sqlite3 from 'sqlite3';

class Model {

    constructor() {
        console.log("Constructing a model, hello world!");
        const dbPath = "../labels.sqlite";
        this.db = new sqlite3.Database(dbPath); // TODO test for existence of file first
    }

    postSnapshotLabel(data, response) {
        const url = data.webpage.url;
        this.createWebpage(data.webpage); // TODO handle duplicate websites
        // TODO convert this to use promises or something, (nested callbacks are ugly).
        // TODO create flags
        // TODO use username (data.label.username)
        this.createSnapshot(data.snapshot, url, (snapshotId) => {
            this.createLabel(data.label, snapshotId, (labelId) => {
                const responseJSON = {
                    status: "success",
                    url: url,
                    snapshotId: snapshotId,
                    labelId: labelId,
                };

                response.json(responseJSON);
            });
        });
    }

    /**
     * Handles the undo route with a passed in snapshotLabel as data.
     * @param data
     * @param response
     */
    undoLabel(data, response) {
        // Need to SELECT and retrieve snapshotId - that, along with the url, is enough to
        // delete the entries
        const sqlSnapshotString = `DELETE
                                   FROM Snapshots
                                   WHERE SnapshotId = ?`
        const sqlLabelString = `DELETE
                                FROM Labels
                                WHERE SnapshotId = ?`

        // The SnapshotId, once retrieved, is enough to delete the Label and Snapshot entries
        this.getSnapshotIdOfData(data, (snapshotId) => {
            this.db.run(sqlSnapshotString, [snapshotId], function (err) {
                if (err) return console.error(err.message);
            });
            this.db.run(sqlLabelString, [snapshotId], function (err) {
                if (err) return console.error(err.message);
            })

            const sqlWebpagesString = `DELETE
                                       FROM Webpages
                                       WHERE Url = ?`;
            const sqlFlagsString = `DELETE
                                    FROM Flags
                                    WHERE Url = ?`;

            // The url is enough information to retrieve the Webpages and Flags entries, however,
            // these should only be deleted if there now exist no labels for the url
            this.checkIfUrlHasLabels(data, (hasLabels) => {
                if (hasLabels) {
                    response.json({status: "Undo Success! - Url/Flags kept"});
                    return;
                }

                // Since there is no url, delete the entry in Urls and Flags
                this.db.run(sqlWebpagesString, [data.webpage.url], function (err) {
                    if (err) return console.error(err.message);
                });
                this.db.run(sqlFlagsString, [data.webpage.url], function (err) {
                    if (err) return console.error(err.message);

                    response.json({status: "Undo Success!"});
                });
            });
        });
    }

    /**
     *
     * @param data
     * @param callback
     */
    getSnapshotIdOfData(data, callback) {
        const sqlString = `SELECT SnapshotId
                           FROM Snapshots
                           WHERE Url = ?
                             AND DateTime = ?`;
        const params = [data.webpage.url, data.snapshot.dateTime];
        this.db.get(sqlString, params, function (err, row) {
            if (err) {
                return console.error(err.message);
            }
            callback(row.SnapshotId);
        });
    }

    /**
     * Checks if a URL has any associated Labels
     *
     * @param data Standard Data JSON object
     * @param callback Returns a boolean that is true if the url still has labels
     */
    checkIfUrlHasLabels(data, callback) {
        const sqlString = `SELECT SnapshotId
                           FROM Snapshots
                           WHERE Url = ?`
        this.db.get(sqlString, [data.webpage.url], function (err, row) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row is: ${row}`);
            callback(row !== null);
        })
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
                                              IsAmbiguous, Topic, SnapshotId, UserId)
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [label.primaryVote, label.secondaryVote, label.isObvious,
            label.isAmbiguous, label.topic, snapshotId, label.userId];

        this.db.run(sqlString, params, function (err) {
            if (err) {
                console.log(err.message);
            }

            callback(this.lastID);
        });
    }

    /**
     * Adds a new username to the database, and returns the userID via the callback
     * @param {String} username
     * @param {Function} callback
     */
    createUser(username, callback) {
        const sqlString = `INSERT INTO Users(Username)
                           VALUES (?)`;
        this.db.run(sqlString, [username], function (err) {
            if (err) {
                console.log(err.message);
            }

            console.log(this.lastID);

            callback(this.lastID);
        });
    }

    getUserIdOfUsername(username, callback) {
        const sqlString = `SELECT UserId
                           FROM Users
                           WHERE Username = ?`
        this.db.get(sqlString, [username], function (err, row) {
            if (err) {
                console.log(err.message);
            }

            callback(row.UserId);
        });

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
