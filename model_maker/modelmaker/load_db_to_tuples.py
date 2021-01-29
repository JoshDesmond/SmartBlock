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
                vote = convert_vote_to_decimal(row[1])
                tuples.append([val[4], vote])  # TODO this is just using primary vote, a temp solution
        conn.commit()
        return tuples
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

    return None


# This just converts the values [1,2,3,4] to [-1, -.33, .33, 1] so as to normalize them for the nn
def convert_vote_to_decimal(vote) -> int:
    return 2.0/3.0 * vote - (5.0/3.0)
