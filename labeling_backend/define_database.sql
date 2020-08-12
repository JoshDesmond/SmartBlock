CREATE TABLE IF NOT EXISTS Webpages (
    Url VARCHAR PRIMARY KEY,
    Domain VARCHAR NOT NULL,
    FlagsId INTEGER NOT NULL,
    FOREIGN KEY (FlagsId) REFERENCES Flags(FlagsId)
);

CREATE TABLE IF NOT EXISTS Snapshots (
    SnapshotId INTEGER PRIMARY KEY,
    Url VARCHAR NOT NULL,
    DateTime INTEGER NOT NULL,
    Title VARCHAR NOT NULL,
    ContentRaw TEXT,
    FOREIGN KEY (Url) REFERENCES Webpages(Url)
);

CREATE TABLE IF NOT EXISTS Labels(
    LabelId INTEGER PRIMARY KEY,
    PrimaryVote INTEGER NOT NULL,
    SecondaryVote INTEGER, -- Optional
    IsObvious INTEGER DEFAULT 0, --Boolean
    IsAmbiguous INTEGER DEFAULT 0, --Boolean
    Topic VARCHAR, --Optional
    SnapshotId INTEGER NOT NULL,
    FOREIGN KEY (SnapshotId) REFERENCES Snapshots(SnapshotId),
    CHECK (PrimaryVote <= 4 AND
           SecondaryVote <= 4 AND
           IsObvious <= 1 AND
           IsAmbiguous <= 1)
);

CREATE TABLE IF NOT EXISTS Flags(
    FlagsId INTEGER PRIMARY KEY,
    IsVeryAmbiguous INTEGER DEFAULT 0, --Boolean
    IsReviewable INTEGER DEFAULT 0, --Boolean
    IsNotTextual INTEGER DEFAULT 0, --Boolean
    IsInteresting INTEGER DEFAULT 0, --Boolean
    Url VARCHAR NOT NULL,
    FOREIGN KEY (Url) REFERENCES Webpages(Url),
    CHECK (IsVeryAmbiguous <= 1 AND
           IsReviewable <= 1 AND
           IsNotTextual <= 1 AND
           IsInteresting <= 1)
);
