import sqlite3
from sqlite3 import Error

# This is just a temporary reference file, will be deleted probably
db_file = "c:/code/personal/smartblock/labeling_backend/labels.sqlite"

def connect_db():
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
        for row in conn.execute("SELECT * FROM Labels"):
            for val in conn.execute(f"SELECT * FROM Snapshots WHERE SnapshotId = {row[6]}"):
                print(val)
            print(row)
        conn.commit()
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    connect_db()
