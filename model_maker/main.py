import sqlite3
from sqlite3 import Error

db_file = "c:/code/personal/smartblock/labeling_backend/labels.sqlite"

def connect_db():
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
        for row in conn.execute("SELECT * FROM Labels"):
            print(row)
        conn.commit()
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    connect_db()
