import React, { useState } from 'react';
import CpHeader from '../components/cpHeader';
import CpFooter from '../components/cpFooter';

function PAdvise() {
    const [activeTab, setActiveTab] = useState("chuyengia");
    const topics = [
        { name: "Đất đai - Nhà ở", count: 407 },
        { name: "Dân sự", count: 312 },
        { name: "Hôn nhân", count: 258 },
        { name: "Lao động", count: 122 },
        { name: "Doanh nghiệp", count: 98 },
        { name: "Hình sự", count: 76 },
        { name: "Hành chính", count: 60 },
    ];

    const questions = [
        {
            id: 12169,
            title: "Có thể khởi kiện hành vi chủ tịch xã không tổ chức hòa giải?",
            category: "Đất đai - Nhà ở",
            date: "25/07/2025",
        },
        {
            id: 12168,
            title: "Giao dịch đất vô hiệu nhưng đã thế chấp ngân hàng thì sao?",
            category: "Đất đai - Nhà ở",
            date: "25/07/2025",
        },
    ];
    return (
        <React.Fragment>
            <CpHeader />
            <div className='py-20'>
                <section
                    className="bg-cover bg-center text-white py-12 px-6"
                    style={{ backgroundImage: "url('/assets/imgs/banner.jpg')" }}
                >
                    <h1 className="text-3xl font-bold">LUẬT SƯ TƯ VẤN</h1>
                    <p className="text-lg">Cùng hỏi đáp và nghe tư vấn từ các chuyên gia luật</p>
                </section>

                {/* Tabs */}
                <div className="flex border-b mt-4">
                    <button
                        onClick={() => setActiveTab("chuyengia")}
                        className={`px-4 py-2 ${activeTab === "chuyengia" ? "border-b-2 border-orange-500 font-semibold" : ""
                            }`}
                    >
                        Hỏi đáp cùng chuyên gia
                    </button>
                    <button
                        onClick={() => setActiveTab("luatsu")}
                        className={`px-4 py-2 ${activeTab === "luatsu" ? "border-b-2 border-orange-500 font-semibold" : ""
                            }`}
                    >
                        Văn phòng luật
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex mt-6 px-4">
                    {/* Sidebar */}
                    <aside className="w-1/4 border-r p-4 max-h-[500px] overflow-y-auto">
                        <h3 className="font-semibold mb-4">Chủ đề</h3>
                        <ul className="space-y-2">
                            {topics.map((t, idx) => (
                                <li key={idx} className="hover:text-red-600 text-[#1D3557] cursor-pointer">
                                    <strong>{t.name}</strong> ({t.count})
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Question List */}
                    <div className="w-3/4 p-4 space-y-4">
                        <h2 className="text-xl font-bold mb-2">TẤT CẢ CÂU HỎI</h2>
                        {questions.map((q) => (
                            <div key={q.id} className="border-b pb-2">
                                <p className="text-sm text-gray-500">
                                    #{q.id} - {q.category} - {q.date}
                                </p>
                                <p className="font-medium text-[#1D3557] cursor-pointer">{q.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Buttons */}
                <div className="fixed bottom-6 right-6 space-y-3">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 mr-2">
                        + Tạo câu hỏi
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-900">
                        Hỏi với AI
                    </button>
                </div>
            </div>
            <CpFooter />
        </React.Fragment>
    )
}
export default PAdvise;