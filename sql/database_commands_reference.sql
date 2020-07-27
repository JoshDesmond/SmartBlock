-- Example / Reference Code from EdX course
CREATE TABLE Contacts(
    id INTEGER PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    EmailAddress VARCHAR(255),
    PhoneNumber VARCHAR(255),
    ZipCode VARCHAR(255)
);

INSERT INTO Contacts
VALUES (
    12, 'John', 'Doe',
    'JohnDoe@email.com', '999-999-9999', '29384'
);

SELECT * FROM Contacts WHERE FirstName = 'Roya';
SELECT FirstName FROM Contacts WHERE ID <= 4;
SELECT * FROM Contacts WHERE ID <= 4 AND ZipCode = '90210';

SELECT * FROM Contacts ORDER BY ID DESC;
SELECT FirstName FROM Contacts ORDER BY ID DESC;

UPDATE Contacts SET ZipCode = '33333' WHERE ID = 3;
UPDATE Contacts SET LastName = 'Smith', ZipCode = '44444' WHERE ID = 4;
UPDATE Contacts SET ZipCode = '22222' WHERE ZipCode = '90210';

DELETE FROM Contacts WHERE ID = 5;
DELETE FROM Contacts WHERE ZipCode = '90210';
DROP TABLE Contacts;