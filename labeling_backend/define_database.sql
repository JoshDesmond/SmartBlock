CREATE TABLE Webpages (
    Url VARCHAR PRIMARY KEY,
    Domain VARCHAR,
    FlagsId INTEGER,
    FOREIGN KEY (FlagsId) REFERENCES Flags(FlagsID)
);

CREATE TABLE Snapshots (
    SnapshotId INTEGER PRIMARY KEY,
    Url VARCHAR,
    DateTime INTEGER,
    Title VARCHAR,
    ContentRaw TEXT,
    FOREIGN KEY (Url) REFERENCES Webpages(Url)
);

CREATE TABLE Labels(
    LabelId INTEGER PRIMARY KEY,
    PrimaryVote INTEGER,
    SecondaryVote INTEGER,
    IsObvious INTEGER, --Boolean
    IsAmbiguous INTEGER, --Boolean
    Topic VARCHAR, --Optional
    SnapshotId INTEGER,
    FOREIGN KEY (SnapshotId) REFERENCES Snapshots(SnapshotId)
);

CREATE TABLE Flags(
    FlagsID INTEGER PRIMARY KEY,
    IsVeryAmbiguous INTEGER, --Boolean
    IsReviewable INTEGER, --Boolean
    IsNotTextual INTEGER, --Boolean
    IsInteresting INTEGER, --Boolean
    Url VARCHAR,
    FOREIGN KEY (Url) REFERENCES Webpages(Url)
);
