INSERT INTO accounts (email, password) VALUES 
('a@a.com', '$2b$10$Cvu50woVHRBeUA6QIAT9hOfn.G7MRz0H6tMLeGnSLW732MhUSnZle'),
('b@b.com', 'password'),
('c@c.com', 'password'),
('d@d.com', 'password'),
('e@e.com', 'password'),
('f@f.com', 'password'),
('g@g.com', 'password'),
('h@h.com', 'password'),
('i@i.com', 'password'),
('j@j.com', 'password'),
('k@k.com', 'password'),
('l@l.com', 'password'),
('m@m.com', 'password'),
('n@n.com', 'password'),
('o@o.com', 'password');

INSERT INTO users_info (user_id, first_name, last_name, nickname, date_of_birth, sexe, orientation, bio, location) VALUES 
(1, 'John', 'Doe', 'JohnDoe454', '1990-07-01', 'M', 'F', 'hello world, I am John Doe, nice to meet you !'),
(2, 'Pierre', 'Doe', 'PierreDoe454', '1970-02-09', 'M', 'F', 'hello world, I am Pierre Doe, nice to meet you !', '{"latitude": 45.73908, "longitude": 0.37865}'),
(3, 'Celine', 'Doe', 'CelineDoe454', '2001-09-17', 'F', 'M', 'hello world, I am Celine Doe, nice to meet you !', '{"latitude": 45.72291, "longitude": 0.20854}'),
(4, 'Alice', 'Smith', 'AliceWonder', '1995-03-12', 'F', 'M', 'Exploring life, one adventure at a time.', '{"latitude": 45.80974, "longitude": 2.56102}'),
(5, 'Bob', 'Johnson', 'BobbyJ', '1988-10-04', 'M', 'F', 'Coder by day, gamer by night.', null),
(6, 'Emma', 'Brown', 'EmmyB', '2000-06-21', 'F', 'M', 'Coffee lover and bookworm.', null),
(7, 'Lucas', 'Davis', 'LukeD', '1993-11-30', 'M', 'F', 'Fitness enthusiast and tech geek.', null),
(8, 'Olivia', 'Garcia', 'LivG', '1998-01-15', 'F', 'M', 'Traveling the world, one step at a time.', null),
(9, 'Liam', 'Martinez', 'LiamM', '1991-04-09', 'M', 'F', 'Passionate about photography and nature.', null),
(10, 'Sophia', 'Anderson', 'SophA', '1996-12-25', 'F', 'M', 'Living life with love and laughter.', null),
(11, 'Ethan', 'Thomas', 'EthanT', '1992-08-14', 'M', 'F', 'Dream big, work hard.', null),
(12, 'Isabella', 'Moore', 'IsaM', '1997-09-05', 'F', 'M', 'Designing my way through life.', null),
(13, 'Mason', 'Taylor', 'MaseT', '1985-05-22', 'M', 'F', 'Music is my escape.', null),
(14, 'Mia', 'Harris', 'MiaH', '2003-07-19', 'F', 'M', 'Student, dreamer, doer.', null),
(15, 'James', 'Clark', 'JamesC', '1999-02-11', 'M', 'F', 'Tech enthusiast and avid learner.', null);

INSERT INTO users_tags (user_id, tag) VALUES 
(1, '4'), (1, '5'), (1, '1'), (1, '12'), (1, '9'),
(2, '16'), (2, '6'), (2, '9'), (2, '13'), (2, '1'),
(3, '2'), (3, '6'), (3, '14'), (3, '7'),
(4, '3'), (4, '10'), (4, '8'),
(5, '5'), (5, '12'), (5, '9'),
(6, '7'), (6, '1'), (6, '11'),
(7, '4'), (7, '9'), (7, '13'),
(8, '2'), (8, '6'), (8, '14'),
(9, '7'), (9, '1'), (9, '11'),
(10, '3'), (10, '10'), (10, '8'),
(11, '5'), (11, '12'), (11, '9'),
(12, '7'), (12, '1'), (12, '11'),
(13, '4'), (13, '9'), (13, '13'),
(14, '2'), (14, '6'), (14, '14'),
(15, '7'), (15, '1'), (15, '11');

INSERT INTO users_images (user_id, local_url) VALUES 
(1, 'test1.png'), (1, 'test2.png'), (1, 'test3.png'),
(2, 'test2.png'), (2, 'test3.png'), (2, 'test1.png'),
(3, 'test4.png'), (3, 'test5.png'), (3, 'test6.png'),
(4, 'test7.png'), (4, 'test8.png'), (4, 'test9.png'),
(5, 'test3.png'), (5, 'test2.png'), (5, 'test1.png'),
(6, 'test6.png'), (6, 'test5.png'), (6, 'test4.png'),
(7, 'test9.png'), (7, 'test8.png'), (7, 'test7.png'),
(8, 'test1.png'), (8, 'test2.png'), (8, 'test3.png'),
(9, 'test2.png'), (9, 'test3.png'), (9, 'test1.png'),
(10, 'test4.png'), (10, 'test5.png'), (10, 'test6.png'),
(11, 'test7.png'), (11, 'test8.png'), (11, 'test9.png'),
(12, 'test3.png'), (12, 'test2.png'), (12, 'test1.png'),
(13, 'test6.png'), (13, 'test5.png'), (13, 'test4.png'),
(14, 'test9.png'), (14, 'test8.png'), (14, 'test7.png'),
(15, 'test1.png'), (15, 'test2.png'), (15, 'test3.png');


