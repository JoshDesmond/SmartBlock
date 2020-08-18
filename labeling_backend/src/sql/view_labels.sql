DROP VIEW IF EXISTS "View Labels";

CREATE VIEW "View Labels" AS
SELECT Webpages.Url,
       Snapshots.DateTime,
       Labels.PrimaryVote
FROM Webpages
         INNER JOIN Snapshots ON Webpages.Url = Snapshots.Url
         LEFT OUTER JOIN Labels ON Snapshots.SnapshotId = Labels.SnapshotId
ORDER BY Webpages.Domain;