-- At the minimum each label requires the following information
-- Url, Domain,
-- DateTime, Title, ContentRaw
-- PrimaryVote
--

INSERT INTO Webpages (Url, Domain)
VALUES ('https://stackoverflow.com/questions/39128718/',
        'stackoverflow.com');

INSERT INTO Snapshots (Url, DateTime, Title, ContentRaw)
VALUES ('https://stackoverflow.com/questions/39128718/', 1597205033,
        'postgresql - Insert data into strongly normalized DB and maintain the integrity ' ||
        '(Postgres) - Stack Overflow', 'Stack Overflow I created a link table for many-to-many ' ||
                                       'relation because few people can live at the same address ' ||
                                       'and one person can live in different locations at');

INSERT INTO Labels (PrimaryVote, SnapshotId)
VALUES (4, last_insert_rowid());

--

INSERT INTO Webpages (Url, Domain)
VALUES ('https://www.google.com/', 'google.com');

INSERT INTO Snapshots (Url, DateTime, Title, ContentRaw)
VALUES ('https://www.google.com/', 1597248476, 'Google',
        'About Store Google Privacy Terms Settings Advertising' ||
        'Business How Search works');

INSERT INTO Labels (PrimaryVote, IsAmbiguous, SnapshotId)
VALUES (3, TRUE, last_insert_rowid());

INSERT INTO Flags (IsNotTextual, Url)
VALUES (TRUE, 'https://www.google.com/');