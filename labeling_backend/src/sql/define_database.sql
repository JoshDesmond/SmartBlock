CREATE TABLE IF NOT EXISTS Webpages (
    Url VARCHAR PRIMARY KEY,
    Domain VARCHAR NOT NULL
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
    UserId INTEGER NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (SnapshotId) REFERENCES Snapshots(SnapshotId),
    CHECK (PrimaryVote <= 4 AND
           SecondaryVote <= 4 AND
           IsObvious <= 1 AND
           IsAmbiguous <= 1)
);

CREATE TABLE IF NOT EXISTS Flags(
    FlagsId INTEGER PRIMARY KEY,
    IsDynamicContent INTEGER DEFAULT 0, --Boolean
    IsReviewable INTEGER DEFAULT 0, --Boolean
    IsNotTextual INTEGER DEFAULT 0, --Boolean
    IsCounterIntuitive INTEGER DEFAULT 0, --Boolean
    Url VARCHAR NOT NULL,
    UserId INTEGER NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (Url) REFERENCES Webpages(Url),
    CHECK (IsDynamicContent <= 1 AND
           IsReviewable <= 1 AND
           IsNotTextual <= 1 AND
           IsCounterIntuitive <= 1)
);

CREATE TABLE IF NOT EXISTS Users(
    -- TODO research how to securely handle a users/userid table
    UserId INTEGER PRIMARY KEY,
    Username VARCHAR NOT NULL UNIQUE
);
