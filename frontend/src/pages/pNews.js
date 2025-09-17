import React, { useState, useEffect } from "react";
import CpHeader from "../components/cpHeader";
import CpFooter from "../components/cpFooter";
import { useNavigate } from "react-router-dom";
import instance, { endpoints } from "../configs/Apis";

const toSlug = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD") // bỏ dấu
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

function PNews() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newsData, setNewsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách category từ API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        let res = await instance.get(endpoints.categories);
        setCategories(res.data.results || []);
      } catch (err) {
        console.error(" Lỗi khi fetch categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      try {
        let res = await instance.get(endpoints.news);
        setNewsData(res.data.results || res.data || []);
      } catch (err) {
        console.error(" Lỗi khi fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  if (loading) return <div className="p-10 text-center"> Đang tải tin tức...</div>;
  console.log('newsData:', newsData);
  const groupedNews = {};
  const others = [];

  newsData.forEach((item) => {
    const cat = item.category?.name;
    if (!cat) {
      others.push(item);
    } else {
      if (!groupedNews[cat]) groupedNews[cat] = [];
      groupedNews[cat].push(item);
    }
  });

  if (others.length) groupedNews["Khác"] = others;

  const categoriesToShow = selectedCategory
    ? { [selectedCategory]: groupedNews[selectedCategory] || [] }
    : groupedNews;

  return (
    <React.Fragment>
      <CpHeader />
      <div className="max-w-6xl mx-auto p-4 py-24 font-sans text-[#1D3557]">

        {/* Thanh chọn chuyên mục */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm font-medium">
          <button
            onClick={() => setSelectedCategory("")}
            className={`hover:text-blue-600 ${selectedCategory === "" ? "text-blue-700 font-bold" : ""
              }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`hover:text-blue-600 ${selectedCategory === cat.name ? "text-blue-700 font-bold" : ""
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Hiển thị tin theo nhóm */}
        {Object.entries(categoriesToShow).map(([category, items]) =>
          items.length > 0 ? (
            <div key={category} className="mb-10">
              {/* Tiêu đề chuyên mục */}
              <h2 className="text-xl font-bold mb-4 uppercase text-[#E63946]">
                {category}
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Tin chính */}
                <div className="md:col-span-2 flex flex-col">
                  <img
                    src={
                      items[0].thumbnail ||
                      "https://res.cloudinary.com/degewiqpj/image/upload/v1755418622/luatvietnam.vn_van-ban-moi.html_eputqb.png"
                    }
                    alt={items[0].title}
                    className="w-full h-64 object-cover rounded"
                  />
                  <h3
                    className="mt-3 text-lg font-semibold hover:text-blue-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/tintuc/${toSlug(items[0].title)}/${items[0].id}`)
                    }
                  >
                    {items[0].title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {items[0].content || "Nội dung chi tiết sẽ được cập nhật."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {items[0].publish_date}
                  </p>
                </div>

                {/* Tin phụ */}
                <div className="space-y-3">
                  {items.slice(1, 5).map((item) => (
                    <div
                      key={item.id}
                      className="border-b pb-2 hover:text-blue-600 cursor-pointer"
                      onClick={() =>
                        navigate(`/tintuc/${toSlug(item.title)}/${item.id}`)
                      }
                    >
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.publish_date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
      <CpFooter />
    </React.Fragment>
  );
}

export default PNews;
