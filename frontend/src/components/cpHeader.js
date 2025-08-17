import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CpHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //console.log('isMenuOpen:', isMenuOpen);
    const navigate = useNavigate();
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-8 h-20 flex items-center justify-between overflow-visible">
            <img
                src="/assets/imgs/logo.jpg"
                alt="Logo nền"
                className="absolute inset-0 m-auto w-20 opacity-10 pointer-events-none"
                style={{ zIndex: 0 }}
            />

            <div className="z-10">
                <img src="/assets/imgs/LogoChu2.png" alt="Logo" className="h-24 object-contain" />
            </div>

            <div className="hidden md:flex gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button onClick={() => navigate('/')} className="hover:text-[#1D3557] bg-transparent border-none">
                    Trang Chủ
                </button>
                <button onClick={() => navigate('/vanban')} className="hover:text-[#1D3557] bg-transparent border-none">
                    Văn Bản
                </button>
                <button onClick={() => navigate('/tuvan')} className="hover:text-[#1D3557] bg-transparent border-none">
                    Tư Vấn
                </button>

                <button onClick={() => navigate('/tintuc')} className="hover:text-[#1D3557] bg-transparent border-none">
                    Tin Tức Pháp Luật
                </button>
                <button onClick={() => navigate('/chat')} className="hover:text-[#1D3557] bg-transparent border-none">
                    Chat Bot Tư Vấn
                </button>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="hover:text-[#1D3557] bg-transparent border-none"
                >
                    <img src="/assets/imgs/menu.png" alt="menu" className="w-6 h-6" />
                </button>
            </div>

            {isMenuOpen && (
                <div className="absolute top-full left-0 w-screen bg-white shadow-lg z-50">
                    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-4 gap-6">
                        <div>
                            <h3 className="font-bold text-red-600">Văn bản</h3>
                            <ul className="mt-1 space-y-1">
                                <li>Văn bản mới</li>
                                <li>Văn bản luật Việt Nam</li>
                                <li>Văn bản tiếng Anh</li>
                                <li>Văn bản UBND</li>
                                <li>Công văn</li>
                                <li>Tiêu chuẩn Việt Nam</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-600">Lĩnh vực tra cứu</h3>
                            <input type="text" placeholder="Tìm lĩnh vực..." className="border rounded p-1 w-full mb-2" />
                            <ul className="space-y-1">
                                <li>An ninh quốc gia</li>
                                <li>Bảo hiểm</li>
                                <li>Chính sách</li>
                                <li>Công nghiệp</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-600">Tin tức pháp luật</h3>
                            <ul className="space-y-1">
                                <li>Tin văn bản mới</li>
                                <li>Thuế - Phí</li>
                                <li>Đất đai - Nhà ở</li>
                                <li>Lao động</li>
                                <li>Giao thông</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-600">Dịch vụ</h3>
                            <ul className="space-y-1">
                                <li>Tra cứu văn bản</li>
                                <li>Phân tích văn bản</li>
                                <li>Dịch vụ dịch thuật</li>
                                <li>Tổng đài tư vấn</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}



            <div className="flex gap-3 z-10">
                <button className="hover:underline" onClick={() => navigate('/login')}>Đăng nhập</button>
                <button onClick={() => navigate('/tracuu')} className="bg-[#1D3557] text-white px-4 py-2 rounded-full hover:opacity-90">
                    Tra cứu ngay
                </button>
            </div>
        </header>
    )
}

export default CpHeader;