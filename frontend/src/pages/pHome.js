import React, { useState } from 'react';
import CpHeader from '../components/cpHeader';
import CpFooter from '../components/cpFooter';
import CpScrollToTop from '../components/cpScrollToTop';
import { useNavigate } from 'react-router-dom';

const faqList = [
    {
        id: 1,
        question: 'Tôi có thể tra cứu văn bản pháp luật ở đâu?',
        answer: 'Bạn có thể sử dụng tính năng "Tra cứu văn bản" ngay trên trang chủ hoặc truy cập mục Công cụ.',
    },
    {
        id: 2,
        question: 'Làm sao để gửi câu hỏi tư vấn?',
        answer: 'Bạn chỉ cần nhấn nút "Đặt câu hỏi", điền thông tin và nội dung cần tư vấn, chúng tôi sẽ phản hồi nhanh nhất.',
    },
    {
        id: 3,
        question: 'Tôi có được tư vấn miễn phí không?',
        answer: 'Hệ thống hỗ trợ tư vấn miễn phí với các câu hỏi cơ bản, các gói nâng cao sẽ có thông báo rõ ràng.',
    },
    {
        id: 4,
        question: 'Hệ thống có cập nhật các biểu mẫu pháp lý mới không?',
        answer: 'Có, hệ thống thường xuyên cập nhật biểu mẫu pháp lý mới nhất từ các cơ quan có thẩm quyền.',
    },
];

function PHome() {
    const [activeId, setActiveId] = useState(null);
    const navigate = useNavigate();
    const toggle = (id) => {
        setActiveId(activeId === id ? null : id);
    };


    return (
        <React.Fragment>
            <CpHeader />
            <div className="min-h-screen bg-white text-[#1D3557] pt-20">
                <section className="text-center px-4 py-32 max-w-4xl mx-auto">
                    <p className="uppercase text-sm tracking-widest mb-4 text-[#A8B3C5]">
                        Giải pháp pháp lý thông minh
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Hệ thống tra cứu thông minh và <br />
                        tư vấn pháp luật trực tuyến
                    </h1>
                    <p className="text-[#457B9D] mb-8 text-lg">
                        Hỗ trợ bạn tìm kiếm thông tin pháp luật, văn bản, điều khoản dễ dàng. <br />
                        Tư vấn thông minh dựa trên trí tuệ nhân tạo – nhanh chóng, chính xác, đáng tin cậy.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => navigate('/tracuu')} className="bg-[#1D3557] text-white px-6 py-3 rounded-full hover:bg-[#16324f] transition">
                            Tra cứu luật
                        </button>
                        <button className="border border-[#1D3557] text-[#1D3557] px-6 py-3 rounded-full hover:bg-[#E5F0FB] transition">
                            Bắt đầu tư vấn
                        </button>
                    </div>
                </section>

                <section className="py-20 px-6 bg-[#F1FAFF]">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">

                        <div>
                            <span className="inline-block bg-[#1D3557] text-white text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                                Văn bản mới
                            </span>
                            <h2 className="text-3xl font-bold text-[#1D3557] mb-4 leading-tight">
                                Luật Đất đai năm 2024 (hiệu lực từ 01/01/2025)
                            </h2>
                            <p className="text-[#457B9D] text-base mb-4">
                                Luật Đất đai 2024 sửa đổi bổ sung nhiều quy định liên quan đến quy hoạch, định giá đất và thủ tục hành chính...
                            </p>
                            <a href="/van-ban/luat-dat-dai-2024" className="text-[#1D3557] hover:underline text-sm font-medium">
                                Xem chi tiết →
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: '📄',
                                    title: 'Nghị định 10/2023/NĐ-CP',
                                    desc: 'Hướng dẫn thi hành Luật Đất đai liên quan đến cấp sổ đỏ lần đầu.',
                                    link: '/van-ban/nghi-dinh-10-2023',
                                },
                                {
                                    icon: '⚖️',
                                    title: 'Thông tư 02/2023/TT-BTP',
                                    desc: 'Quy định về đăng ký quyền sử dụng đất và tài sản gắn liền với đất.',
                                    link: '/van-ban/thong-tu-02-2023',
                                },
                                {
                                    icon: '📌',
                                    title: 'Luật Nhà ở 2023',
                                    desc: 'Bổ sung các quy định về nhà ở xã hội, cho thuê và mua bán nhà ở thương mại.',
                                    link: '/van-ban/luat-nha-o-2023',
                                },
                                {
                                    icon: '📚',
                                    title: 'Luật Kinh doanh BĐS 2023',
                                    desc: 'Quy định mới về điều kiện, hình thức kinh doanh bất động sản và quyền nghĩa vụ của các bên.',
                                    link: '/van-ban/luat-kinh-doanh-bds-2023',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-[#E0E8F3]">
                                    <div className="mb-4">
                                        <span className="inline-block bg-[#1D3557] text-white p-2 rounded-md">{item.icon}</span>
                                    </div>
                                    <h3 className="font-semibold text-base mb-1 text-[#1D3557]">{item.title}</h3>
                                    <p className="text-sm text-[#457B9D]">{item.desc}</p>
                                    <a href={item.link} className="text-[#1D3557] hover:underline text-xs mt-2 inline-block">
                                        Xem chi tiết →
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-16 px-6">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

                        <div>
                            <p className="text-sm uppercase tracking-widest text-[#A8B3C5] font-medium mb-3">Chủ đề phổ biến</p>
                            <h2 className="text-3xl font-bold text-[#1D3557] mb-4">Các văn bản pháp luật bạn cần biết</h2>
                            <p className="text-[#457B9D] leading-relaxed">
                                Chúng tôi tổng hợp các văn bản pháp luật quan trọng và phổ biến nhất giúp bạn dễ dàng tra cứu và cập nhật theo lĩnh vực: dân sự, hình sự, đất đai, lao động,...
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                ['Bộ luật Dân sự 2015', 'Quy định về quyền, nghĩa vụ dân sự, giao dịch, thừa kế, tài sản cá nhân,...'],
                                ['Bộ luật Lao động 2019', 'Hướng dẫn quyền lợi người lao động, hợp đồng, nghỉ phép, lương thưởng,...'],
                                ['Luật Đất đai 2024', 'Cập nhật mới nhất về quyền sử dụng đất, chuyển nhượng, bồi thường,...'],
                                ['Luật Hình sự 2015 (sửa đổi 2017)', 'Quy định hành vi phạm tội, hình phạt và trách nhiệm hình sự cá nhân, tổ chức.'],
                                ['Luật Hôn nhân và Gia đình', 'Quy định về kết hôn, ly hôn, quyền và nghĩa vụ giữa vợ chồng, con cái.'],
                                ['Các lĩnh vực khác', 'Các quy định khi tham gia giao thông, xử phạt hành chính, an toàn giao thông.'],
                            ].map(([title, desc], i) => (
                                <div key={i} className="bg-[#F8FAFC] hover:bg-[#E9F4FD] shadow-sm rounded-xl p-5 transition border border-[#E0E8F3]">
                                    <h3 className="text-lg font-semibold text-[#1D3557]">{title}</h3>
                                    <p className="text-sm text-[#457B9D] mt-1">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-[#F1F5F9] py-16 px-6">
                    <div className="max-w-7xl mx-auto text-center mb-10">
                        <p className="text-sm uppercase tracking-widest text-[#A8B3C5] font-medium mb-2">Tiện ích</p>
                        <h2 className="text-3xl font-bold text-[#1D3557]">Công cụ nổi bật</h2>
                        <p className="text-[#457B9D] mt-2">Những tính năng chính giúp bạn tiếp cận pháp luật dễ dàng và nhanh chóng</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {[
                            ['Tra cứu văn bản', 'Tìm kiếm nhanh chóng các văn bản pháp luật mới nhất'],
                            ['Đặt câu hỏi tư vấn', 'Gửi câu hỏi pháp lý và nhận phản hồi từ hệ thống'],
                            ['Tra cứu biểu mẫu', 'Tải xuống các mẫu đơn, mẫu hợp đồng phổ biến'],
                            ['Chat tư vấn thông minh', 'Trò chuyện với hệ thống AI hỗ trợ tư vấn pháp luật']
                        ].map(([title, desc], i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-[#E0E8F3] hover:shadow-lg transition">
                                <h3 className="text-lg font-semibold text-[#1D3557] mb-2">{title}</h3>
                                <p className="text-sm text-[#457B9D] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="bg-white py-20 px-6 text-gray-900">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="uppercase text-sm tracking-widest font-semibold mb-3" style={{ color: '#1D3557' }}>
                            Giải đáp thắc mắc
                        </p>
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">
                            Các câu hỏi thường gặp
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Bạn có thắc mắc? Xem câu hỏi phổ biến bên dưới hoặc gửi câu hỏi cho chúng tôi.
                        </p>
                        <button
                            className="mb-10 px-6 py-2 text-white rounded-full hover:opacity-90 transition"
                            style={{ backgroundColor: '#1D3557' }}
                        >
                            Đặt câu hỏi
                        </button>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqList.map((item) => (
                            <div key={item.id} className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={() => toggle(item.id)}
                                    className="w-full flex justify-between items-center text-left"
                                >
                                    <div className="flex items-center space-x-4">
                                        <span
                                            className="w-7 h-7 flex items-center justify-center text-white rounded-full text-sm font-semibold"
                                            style={{ backgroundColor: '#1D3557' }}
                                        >
                                            {item.id}
                                        </span>
                                        <span className="text-lg font-medium text-gray-800">
                                            {item.question}
                                        </span>
                                    </div>
                                    <span
                                        className={`text-xl transform transition-transform duration-200`}
                                        style={{
                                            color: '#1D3557',
                                            transform: activeId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                    >
                                        ▼
                                    </span>
                                </button>
                                {activeId === item.id && (
                                    <div className="mt-3 pl-11 text-gray-600 text-sm leading-relaxed">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-[#0F172A] py-20 px-6 text-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <p className="uppercase text-sm tracking-widest text-[#94A3B8] mb-2">Bảng Tin</p>
                                <h2 className="text-4xl font-bold">Các tin tức khác</h2>
                            </div>
                            <button className="bg-white text-[#0F172A] font-medium px-5 py-2 rounded-full hover:bg-gray-200 transition">
                                Xem Thêm
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    img: "/assets/imgs/1.jpg",
                                    tag: "FINANCIAL",
                                    title: "Những sai lầm cần tránh khi lập mô hình tài chính",
                                    date: "DEC 18, 2025",
                                },
                                {
                                    img: "/assets/imgs/2.jpg",
                                    tag: "LAW",
                                    title: "Hiểu đúng về quy định mới trong luật dân sự",
                                    date: "DEC 18, 2025",
                                },
                                {
                                    img: "/assets/imgs/3.jpg",
                                    tag: "TAXES",
                                    title: "Cập nhật biểu thuế TNCN năm 2025",
                                    date: "DEC 18, 2025",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-[#1E293B] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                                    <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                                    <div className="p-5">
                                        <span className="text-xs uppercase text-[#94A3B8] font-semibold mb-2 inline-block">{item.tag}</span>
                                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                        <p className="text-sm text-[#94A3B8]">{item.date} • 5 MIN READ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
            <CpScrollToTop />
            <CpFooter />
        </React.Fragment>
    );
}

export default PHome;
