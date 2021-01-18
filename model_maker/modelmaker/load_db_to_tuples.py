import sqlite3
from typing import List, Tuple
from sqlite3 import Error

db_file = "c:/code/personal/smartblock/labeling_backend/labels.sqlite"


def load_tuples() -> List[Tuple[str, float]]:
    """
    Loads the text data from the database, and returns the list of tuples
    """
    tuples = list()
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
        for row in conn.execute("SELECT * FROM Labels"):
            for val in conn.execute(f"SELECT * FROM Snapshots WHERE SnapshotId = {row[6]}"):
                tuples.append([val[4], row[1]]) # TODO this is just using primary vote, a temp solution
        conn.commit()
        return tuples
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

    return None
