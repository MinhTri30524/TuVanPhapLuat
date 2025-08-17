SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE laws_queryrecommendation;
TRUNCATE TABLE laws_queryintent;
TRUNCATE TABLE laws_userquery;
TRUNCATE TABLE laws_legalnews_tags;
TRUNCATE TABLE laws_legalnews;
TRUNCATE TABLE laws_tag;
TRUNCATE TABLE laws_lawarticle;
TRUNCATE TABLE laws_lawdocument;
TRUNCATE TABLE laws_lawcategory;
SET FOREIGN_KEY_CHECKS = 1;

-- ===========================
-- LawCategory (10 bản ghi)
-- ===========================
INSERT INTO laws_lawcategory (id, name, description) VALUES
(1, 'Luật Dân sự', 'Các văn bản liên quan đến luật dân sự.'),
(2, 'Luật Hình sự', 'Các văn bản liên quan đến luật hình sự.'),
(3, 'Luật Lao động', 'Các quy định về lao động và việc làm.'),
(4, 'Luật Đất đai', 'Quy định về quyền sử dụng đất.'),
(5, 'Luật Hôn nhân & Gia đình', 'Quy định về hôn nhân và gia đình.'),
(6, 'Luật Giao thông', 'Quy định về an toàn giao thông.'),
(7, 'Luật Thương mại', 'Quy định về thương mại và kinh doanh.'),
(8, 'Luật Thuế', 'Các quy định về thuế.'),
(9, 'Luật Môi trường', 'Quy định về bảo vệ môi trường.'),
(10, 'Luật Công nghệ thông tin', 'Quy định về CNTT và an ninh mạng.');

-- ===========================
-- LawDocument (10 bản ghi)
-- ===========================
INSERT INTO laws_lawdocument (id, title, code, category_id, issued_by, issued_date, effective_date, expired_date, summary, source_url, created_at) VALUES
(1, 'Bộ luật Dân sự 2015', '91/2015/QH13', 1, 'Quốc hội', '2015-11-24', '2017-01-01', NULL, 'Quy định chung về quyền, nghĩa vụ dân sự.', 'https://example.com/1', NOW()),
(2, 'Bộ luật Hình sự 2015', '100/2015/QH13', 2, 'Quốc hội', '2015-11-27', '2018-01-01', NULL, 'Quy định về tội phạm và hình phạt.', 'https://example.com/2', NOW()),
(3, 'Luật Lao động 2019', '45/2019/QH14', 3, 'Quốc hội', '2019-11-20', '2021-01-01', NULL, 'Quy định về quyền và nghĩa vụ của người lao động.', 'https://example.com/3', NOW()),
(4, 'Luật Đất đai 2013', '45/2013/QH13', 4, 'Quốc hội', '2013-11-29', '2014-07-01', NULL, 'Quy định về quyền sử dụng đất.', 'https://example.com/4', NOW()),
(5, 'Luật Hôn nhân & Gia đình 2014', '52/2014/QH13', 5, 'Quốc hội', '2014-06-19', '2015-01-01', NULL, 'Quy định về hôn nhân và gia đình.', 'https://example.com/5', NOW()),
(6, 'Luật Giao thông đường bộ 2008', '23/2008/QH12', 6, 'Quốc hội', '2008-11-13', '2009-07-01', NULL, 'Quy định về giao thông đường bộ.', 'https://example.com/6', NOW()),
(7, 'Luật Thương mại 2005', '36/2005/QH11', 7, 'Quốc hội', '2005-06-14', '2006-01-01', NULL, 'Quy định về thương mại và kinh doanh.', 'https://example.com/7', NOW()),
(8, 'Luật Quản lý thuế 2019', '38/2019/QH14', 8, 'Quốc hội', '2019-06-13', '2020-07-01', NULL, 'Quy định về thuế và quản lý thuế.', 'https://example.com/8', NOW()),
(9, 'Luật Bảo vệ môi trường 2020', '72/2020/QH14', 9, 'Quốc hội', '2020-11-17', '2022-01-01', NULL, 'Quy định về bảo vệ môi trường.', 'https://example.com/9', NOW()),
(10, 'Luật An ninh mạng 2018', '24/2018/QH14', 10, 'Quốc hội', '2018-06-12', '2019-01-01', NULL, 'Quy định về an ninh mạng.', 'https://example.com/10', NOW());

-- ===========================
-- LawArticle (10 bản ghi)
-- ===========================
INSERT INTO laws_lawarticle (id, document_id, article_number, title, content, `order`) VALUES
(1, 1, 'Điều 1', 'Phạm vi điều chỉnh', 'Nội dung điều 1...', 1),
(2, 2, 'Điều 2', 'Tội phạm', 'Nội dung điều 2...', 1),
(3, 3, 'Điều 3', 'Hợp đồng lao động', 'Nội dung điều 3...', 1),
(4, 4, 'Điều 4', 'Quyền sử dụng đất', 'Nội dung điều 4...', 1),
(5, 5, 'Điều 5', 'Kết hôn', 'Nội dung điều 5...', 1),
(6, 6, 'Điều 6', 'Quy tắc giao thông', 'Nội dung điều 6...', 1),
(7, 7, 'Điều 7', 'Mua bán hàng hóa', 'Nội dung điều 7...', 1),
(8, 8, 'Điều 8', 'Khai thuế', 'Nội dung điều 8...', 1),
(9, 9, 'Điều 9', 'Bảo vệ môi trường', 'Nội dung điều 9...', 1),
(10, 10, 'Điều 10', 'Bảo mật thông tin', 'Nội dung điều 10...', 1);

-- ===========================
-- Tag (10 bản ghi)
-- ===========================
INSERT INTO laws_tag (id, name) VALUES
(1, 'Hợp đồng'),
(2, 'Tội phạm'),
(3, 'Lao động'),
(4, 'Đất đai'),
(5, 'Hôn nhân'),
(6, 'Giao thông'),
(7, 'Thương mại'),
(8, 'Thuế'),
(9, 'Môi trường'),
(10, 'An ninh mạng');

-- ===========================
-- LegalNews (10 bản ghi)
-- ===========================
INSERT INTO laws_legalnews (id, title, content, source, publish_date, source_url, thumbnail, created_at) VALUES
(1, 'Tin tức 1', 'Nội dung tin 1...', 'Báo A', '2025-01-01', 'https://example.com/news1', NULL, NOW()),
(2, 'Tin tức 2', 'Nội dung tin 2...', 'Báo B', '2025-01-02', 'https://example.com/news2', NULL, NOW()),
(3, 'Tin tức 3', 'Nội dung tin 3...', 'Báo C', '2025-01-03', 'https://example.com/news3', NULL, NOW()),
(4, 'Tin tức 4', 'Nội dung tin 4...', 'Báo D', '2025-01-04', 'https://example.com/news4', NULL, NOW()),
(5, 'Tin tức 5', 'Nội dung tin 5...', 'Báo E', '2025-01-05', 'https://example.com/news5', NULL, NOW()),
(6, 'Tin tức 6', 'Nội dung tin 6...', 'Báo F', '2025-01-06', 'https://example.com/news6', NULL, NOW()),
(7, 'Tin tức 7', 'Nội dung tin 7...', 'Báo G', '2025-01-07', 'https://example.com/news7', NULL, NOW()),
(8, 'Tin tức 8', 'Nội dung tin 8...', 'Báo H', '2025-01-08', 'https://example.com/news8', NULL, NOW()),
(9, 'Tin tức 9', 'Nội dung tin 9...', 'Báo I', '2025-01-09', 'https://example.com/news9', NULL, NOW()),
(10, 'Tin tức 10', 'Nội dung tin 10...', 'Báo J', '2025-01-10', 'https://example.com/news10', NULL, NOW());

-- Liên kết LegalNews với Tag
INSERT INTO laws_legalnews_tags (legalnews_id, tag_id) VALUES
(1, 1),(2, 2),(3, 3),(4, 4),(5, 5),
(6, 6),(7, 7),(8, 8),(9, 9),(10, 10);

-- ===========================
-- UserQuery (10 bản ghi, user_id=1)
-- ===========================
INSERT INTO laws_userquery (id, user_id, query_text, created_at) VALUES
(1, 1, 'Quy định về hợp đồng lao động', NOW()),
(2, 1, 'Mức phạt tội phạm mạng', NOW()),
(3, 1, 'Quyền sử dụng đất', NOW()),
(4, 1, 'Thủ tục kết hôn', NOW()),
(5, 1, 'Quy định giao thông', NOW()),
(6, 1, 'Thuế thu nhập cá nhân', NOW()),
(7, 1, 'Bảo vệ môi trường', NOW()),
(8, 1, 'Quy định thương mại điện tử', NOW()),
(9, 1, 'Tội phạm ma túy', NOW()),
(10, 1, 'Bảo mật thông tin cá nhân', NOW());

-- ===========================
-- QueryIntent (10 bản ghi)
-- ===========================
INSERT INTO laws_queryintent (id, query_id, intent_label, confidence, created_at) VALUES
(1, 1, 'Tìm luật lao động', 0.95, NOW()),
(2, 2, 'Tìm luật an ninh mạng', 0.90, NOW()),
(3, 3, 'Tìm luật đất đai', 0.88, NOW()),
(4, 4, 'Tìm luật hôn nhân', 0.92, NOW()),
(5, 5, 'Tìm luật giao thông', 0.89, NOW()),
(6, 6, 'Tìm luật thuế', 0.91, NOW()),
(7, 7, 'Tìm luật môi trường', 0.87, NOW()),
(8, 8, 'Tìm luật thương mại', 0.93, NOW()),
(9, 9, 'Tìm luật hình sự', 0.94, NOW()),
(10, 10, 'Tìm luật bảo mật', 0.90, NOW());

-- ===========================
-- QueryRecommendation (10 bản ghi)
-- ===========================
INSERT INTO laws_queryrecommendation (id, intent_id, recommended_text, related_document_id, created_at) VALUES
(1, 1, 'Xem Luật Lao động 2019', 3, NOW()),
(2, 2, 'Xem Luật An ninh mạng 2018', 10, NOW()),
(3, 3, 'Xem Luật Đất đai 2013', 4, NOW()),
(4, 4, 'Xem Luật Hôn nhân & Gia đình 2014', 5, NOW()),
(5, 5, 'Xem Luật Giao thông đường bộ 2008', 6, NOW()),
(6, 6, 'Xem Luật Quản lý thuế 2019', 8, NOW()),
(7, 7, 'Xem Luật Bảo vệ môi trường 2020', 9, NOW()),
(8, 8, 'Xem Luật Thương mại 2005', 7, NOW()),
(9, 9, 'Xem Bộ luật Hình sự 2015', 2, NOW()),
(10, 10, 'Xem Bộ luật Dân sự 2015', 1, NOW());
