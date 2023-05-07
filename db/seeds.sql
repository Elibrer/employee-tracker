
INSERT INTO department (name) 
VALUES  ('Grocery'),
        ('Dairy'),
        ('Produce'),
        ('Drivers'),
        ('Online'),
        ('Shoppers'),
        ('Management');

INSERT INTO role (title, salary, department_id)
VALUES  ('Nightfill', 45000, 1),
        ('Nightfill Captain', 50000, 1),
        ('Dairy Fill', 45000, 2),
        ('Dairy Captain', 50000, 2),
        ('Produce Fill', 45000, 3),
        ('Produce Captain', 50000, 3),
        ('Delivery Driver', 55000, 4),
        ('Lead Delivery Driver', 65000, 4),  
        ('Shopper', 50000, 6),
        ('Grocery Manager', 78000, 1),
        ('Dairy Manager', 80000, 2),
        ('Produce Manager', 80000, 3),
        ('Online manager', 85000, 5),
        ('Store Manager', 120000, 7);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Lleyton', 'Hewitt', 14, NULL),
        ('Kevin', 'Magnussen', 13, 1),
        ('Jennifer', 'Aniston', 12, 1),
        ('Kim', 'Possible', 11, 1),
        ('Ronald', 'Weasley', 10, 1),
        ('Angelina', 'Jolie', 9, 2),
        ('Brad', 'Pitt', 9, 2),
        ('Barack', 'Obama', 9, 2),
        ('Benjamin', 'Franklin', 9, 2),
        ('Leonardo', 'Da Vinci', 9, 2),
        ('Michael', 'Bay', 8, 2),
        ('Jason', 'Statham', 7, 11),
        ('Tony', 'Parker', 7, 11),
        ('Blake', 'Griffen', 7, 11),
        ('Michael', 'Jordan', 6, 3),
        ('Lionel', 'Ritchie', 5, 15),
        ('Jordan', 'Dawson', 5, 15),
        ('Katie', 'Mater', 4, 4),
        ('Bill', 'Henderson', 3, 18),
        ('Greg', 'Davies', 3, 18),
        ('Sanam', 'Grace', 3, 18),
        ('Gretchin', 'Blake', 3, 18),
        ('Alan', 'Midas', 2, 5),
        ('Sarah', 'Young', 1, 23),
        ('Kevin', 'Jones', 1, 23),
        ('Aaron', 'Bates', 1, 23),
        ('Tony', 'Zhou', 1, 23);
    