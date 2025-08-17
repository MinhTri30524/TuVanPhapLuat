INSERT INTO account_customuser 
(id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined, phone_number, address)
VALUES
(1, 'pbkdf2_sha256$260000$abc123$examplehash1', NULL, 1, 'admin', 'Admin', 'User', 'admin@example.com', 1, 1, NOW(), '0123456789', '123 Admin Street'),
(2, 'pbkdf2_sha256$260000$abc123$examplehash2', NULL, 0, 'user01', 'Nguyen', 'An', 'user01@example.com', 0, 1, NOW(), '0912345678', 'Hanoi'),
(3, 'pbkdf2_sha256$260000$abc123$examplehash3', NULL, 0, 'user02', 'Tran', 'Binh', 'user02@example.com', 0, 1, NOW(), '0987654321', 'Ho Chi Minh'),
(4, 'pbkdf2_sha256$260000$abc123$examplehash4', NULL, 0, 'user03', 'Le', 'Chi', 'user03@example.com', 0, 1, NOW(), '0934567890', 'Da Nang'),
(5, 'pbkdf2_sha256$260000$abc123$examplehash5', NULL, 0, 'user04', 'Pham', 'Dung', 'user04@example.com', 0, 1, NOW(), '0976543210', 'Hai Phong'),
(6, 'pbkdf2_sha256$260000$abc123$examplehash6', NULL, 0, 'user05', 'Vo', 'Hoa', 'user05@example.com', 0, 1, NOW(), '0909123456', 'Can Tho'),
(7, 'pbkdf2_sha256$260000$abc123$examplehash7', NULL, 0, 'user06', 'Bui', 'Khanh', 'user06@example.com', 0, 1, NOW(), '0945678901', 'Quang Ninh'),
(8, 'pbkdf2_sha256$260000$abc123$examplehash8', NULL, 0, 'user07', 'Dang', 'Linh', 'user07@example.com', 0, 1, NOW(), '0967890123', 'Hue'),
(9, 'pbkdf2_sha256$260000$abc123$examplehash9', NULL, 0, 'user08', 'Hoang', 'Minh', 'user08@example.com', 0, 1, NOW(), '0911223344', 'Nha Trang'),
(10, 'pbkdf2_sha256$260000$abc123$examplehash10', NULL, 0, 'user09', 'Nguyen', 'Nam', 'user09@example.com', 0, 1, NOW(), '0988776655', 'Vung Tau');
