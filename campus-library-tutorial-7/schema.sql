-- 1. create the database 
CREATE DATABASE IF NOT EXISTS gqldemo;
USE gqldemo;
-- 2. create the two tables (authors 1 --- many books) 
-- I USED POSTGRESQL FOR THIS SO COMMANDS MENTIONED ABOVE IS NOT VALID

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50)
);
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    year INT,
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);
-- 3. put some sample rows in 
INSERT INTO authors (name, country)
VALUES ('Asha Patel', 'India'),
    ('Ravi Kumar', 'India');

INSERT INTO books (title, year, author_id)
VALUES ('Databases 101', 2020, 1),
    ('SQL in Practice', 2022, 1),
    ('Web Services Basics', 2023, 2);

SELECT * FROM books;
SELECT * FROM authors;