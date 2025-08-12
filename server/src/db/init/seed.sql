INSERT INTO users (username,fname, lname, password_hash, role, created_at) VALUES
('mdahamshi', 'Mohammad', 'Dahamshi', '$2b$10$x6gir2ZBJ399bARIxkow7uhrOw8fqPojsMeiAc1xMCRRL6CCqwDGS', 'admin', '1989-07-15 00:30:00'),
('adahamshi','Amenah', 'Dahamshi',   '$2b$10$cnAf72pKB2/w.d134QJu1O51s.PSfw0dhwXwWTKkq92XPbaTIUjUC', 'user', '2022-09-02 00:30:00'),
('sdahamshi','Sarah' ,'Dahamshi',    '$2b$10$cnAf72pKB2/w.d134QJu1O51s.PSfw0dhwXwWTKkq92XPbaTIUjUC', 'user', '2022-08-03 00:30:00'),
('salmah','Salmah', 'Dahamshi',   '$2b$10$cnAf72pKB2/w.d134QJu1O51s.PSfw0dhwXwWTKkq92XPbaTIUjUC', 'user', '2022-09-02 00:30:00');

INSERT INTO messages (user_id,title, content, created_at) VALUES
(1,'Test', 'Welcome to saramsg, everyone!', NOW() - INTERVAL '2 days'),
(1,'Test', 'exposed via cloudflare tunnel ! self hosted on my personal server, proxmox, coolify', NOW() - INTERVAL '2 days'),
(2,'Test', 'Hi, I love Dad.', NOW() - INTERVAL '1 day'),
(3,'Test', 'This is Amenah and I love Dad.', NOW() - INTERVAL '20 hours'),
(4,'Test', 'Salmah here, excited to join!', NOW() - INTERVAL '10 hours'),
(1,'Test', 'Reminder: be respectful in chat.', NOW() - INTERVAL '5 hours');