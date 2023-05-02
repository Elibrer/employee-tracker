INSERT INTO department (name) 
VALUES  ('Grocery'),
        ('Dairy'),
        ('Produce'),
        ('Management'),
        ('Online'),
        ('Drivers'),
        ('Shoppers');

INSERT INTO role (title, salary, department_id)
VALUES  ('Nightfill', 45, 1),
        ('Nightfill Captain', 50, 1),
        ('Dairy Fill', 45, 2),
        ('Dairy Captain', 50, 2),
        ('Produce Fill', 45, 3),
        ('Produce Captain', 50, 3),
        ('Delivery Driver', 55, 4),
        ('Lead Delivery Driver', 65, 4),
        ('Shopper', 50, 5);
        ('Grocery Manager', 78, 6),
        ('Dairy Manager', 80, 7),
        ('Produce Manager', 80, 8),
        ('Online manager', 85, 9),
        ('Store Manager', 120, 10);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Tony', 'Nahdi', 1, 6),
        ('Aaron', 'Bates', 1, 6),
        ('Kevin', 'Jones', 1, 6),
        ('Sarah', 'Young', 1, 6),
        ('Alan', 'Midas', 2, 7),
        ('Gretchin', 'Blake', 2, 7),
        ('Sanam', 'Grace', 2, 7),
        ('Greg', 'Davies', 2, 7),
        ('Bill', 'Henderson', 3, 8),
        ('Katie', 'Mater', 3, 8),
        ('Jordan', 'Dawson', 3 8),
        ('Lionel', 'Ritchie', 4, 9),
        ('Michael', 'Jordan', 4, 9),
        ('Blake', 'Griffen', 4, 9),
        ('Tony', 'Parker', 4, 9),
        ('Jason', 'Statham', 5, 9),
        ('Michael', 'Bay', 5, 9),
        ('Leonardo', 'Da Vinci', 5, 9),
        ('Benjamin', 'Franklin', 6, 10),
        ('Barack', 'Obama', 7, 10),
        ('Brad', 'Pitt', 8, 10),
        ('Angelina', 'Jolie', 9, 10),
        ('Lleyton', 'Hewitt', 10, NULL);
