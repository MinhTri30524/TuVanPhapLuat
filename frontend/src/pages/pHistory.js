import React, { useEffect, useState } from 'react';
import CpHeader from '../components/cpHeader';
import CpFooter from '../components/cpFooter';
import CpScrollToTop from '../components/cpScrollToTop';
import instance, { endpoints } from '../configs/Apis';
import { useNavigate } from 'react-router-dom';
import slugify from "slugify";

const PHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await instance.get(endpoints.user_history);
        setActivities(res.data);
      } catch (err) {
        console.error('Lỗi khi tải lịch sử:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const renderIcon = (type) => {
    switch (type) {
      case 'document': return '📘';
      case 'news': return '📰';
      case 'question': return '💬';
      default: return '📄';
    }
  };

  const toSlug = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

  const handleNavigate = (item) => {
  if (item.activity_type === "document") {
    navigate(
      `/vanban/${slugify(item.title, { lower: true, strict: true })}/${item.reference_id}`
    );
  } else if (item.activity_type === "news") {
    navigate(`/tintuc/${toSlug(item.title)}/${item.reference_id}`);
  } else if (item.activity_type === "question") {
    navigate(`/tuvan`);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CpHeader />
      <CpScrollToTop />

      <main className="flex-grow py-16 px-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold text-[#1D3557] mb-6">
            Lịch sử truy vấn của bạn
          </h1>

          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">Bạn chưa có hoạt động nào.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activities.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  className="flex items-center gap-4 py-4 cursor-pointer hover:bg-gray-50 transition"
                >
                  <span className="text-2xl">{renderIcon(item.activity_type)}</span>
                  <div className="flex-1">
                    <p className="text-[#1D3557] font-semibold line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.activity_type === 'document'
                        ? 'Văn bản pháp luật'
                        : item.activity_type === 'news'
                        ? 'Tin tức pháp luật'
                        : 'Câu hỏi tư vấn'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleString('vi-VN')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <CpFooter />
    </div>
  );
};

export default PHistory;
