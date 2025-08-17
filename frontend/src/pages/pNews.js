import React, { useState } from "react";
import CpHeader from "../components/cpHeader";
import CpFooter from "../components/cpFooter";
import { useNavigate } from 'react-router-dom';

const newsData = [
    {
        id: 1,
        title: "Sắp bỏ hoàn toàn xăng A92, A95 có đúng không?",
        description:
            "Thông tin sắp bỏ hoàn toàn xăng A92, A95 thay bằng xăng sinh học E10 đang gây hoang mang dư luận trên mạng xã hội, vậy thực hư thế nào?",
        image: "assets/imgs/xang.jpg",
        date: "25/07/2025",
    },
    {
        id: 2,
        title: "Chậm đóng BHXH bao lâu thì bị tính lãi và xử phạt?",
        date: "25/07/2025",
    },
    {
        id: 3,
        title: "Hợp đồng học nghề, tập nghề tại doanh nghiệp có phải đóng BHXH?",
        date: "25/07/2025",
    },
    {
        id: 4,
        title:
            "Mẫu thông báo chấm dứt cam kết thực hiện mục tiêu xã hội, môi trường",
        date: "25/07/2025",
    },
    {
        id: 5,
        title:
            "7 điểm mới về tiền lương, phụ cấp đối với nhà giáo từ 01/01/2026 [Dự kiến]",
        date: "25/07/2025",
    },
    {
        id: 6,
        title:
            "Tiền xăng xe, điện thoại, ăn trưa... cho người lao động có được miễn thuế?",
        date: "24/07/2025",
    },
];

const categories = [
    "Hành chính", "Thuế - Phí", "Đất đai - Nhà ở", "Bảo hiểm",
    "Cán bộ - Công chức", "Lao động", "Dân sự", "Biểu mẫu",
    "Giao thông", "Lĩnh vực khác", "Media Luật", "Sách Luật"
];

function PNews() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("");

    return (<React.Fragment>
        <CpHeader />
        <div className="max-w-6xl mx-auto p-4 py-24 font-sans text-[#1D3557]">
            <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium mt-4">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(cat)}
                        className={`hover:text-blue-600 ${selectedCategory === cat ? "text-blue-700 font-bold" : ""
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <h1 className="text-2xl font-bold mb-2">{selectedCategory || "TIN PHÁP LUẬT"}</h1>

            <input
                type="text"
                placeholder="Nhập nội dung cần tìm..."
                className="w-full border px-3 py-2 rounded-md text-sm mb-6"
            />

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <img
                        src={newsData[0].image}
                        alt="main"
                        className="w-full h-64 object-cover rounded"
                    />
                    <h2 className="mt-3 text-xl font-semibold hover:text-blue-600 cursor-pointer">
                        {newsData[0].title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">{newsData[0].description}</p>
                </div>

                <div className="space-y-4">
                    {newsData.slice(1).map((item) => (
                        <div key={item.id} className="border-b pb-2">
                            <h3 className="text-sm font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/tintuc/chitiet')}>
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
        <CpFooter />
    </React.Fragment>

    );
}

export default PNews;
