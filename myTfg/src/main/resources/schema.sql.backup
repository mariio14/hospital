DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users (
   id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   userName VARCHAR(60) NOT NULL,
   password VARCHAR(60) NOT NULL,
   firstName VARCHAR(60) NOT NULL,
   lastName VARCHAR(60) NOT NULL,
   email VARCHAR(60) NOT NULL,
   role TINYINT NOT NULL,
   avatar MEDIUMBLOB
) engine=innodb;

/* Creacion usuario con userName y contraseña test */
INSERT INTO Users (userName, password, firstName, lastName, email, role, avatar) VALUES ('test', '$2a$10$tAX5UGkz3VvxhLe8.463oOuYMOXGFXB..pZzc2/sXXbOnJ2eWO2NO', 'Test', 'Tester', 'a@a', 0, '');

INSERT INTO Users (userName, password, firstName, lastName, email, role, avatar) VALUES ('admin', '$2a$10$tAX5UGkz3VvxhLe8.463oOuYMOXGFXB..pZzc2/sXXbOnJ2eWO2NO', 'admin', 'admin', 'admin@udc.es', 1, '');
