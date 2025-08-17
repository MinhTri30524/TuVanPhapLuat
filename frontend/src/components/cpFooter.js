import React from 'react';

const CpFooter = () => {
    return (
        <footer className="text-white py-10 px-6" style={{ backgroundColor: '#1D3557' }}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                {/* Cột 1: Giới thiệu */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Về chúng tôi</h2>
                    <p className="text-gray-300">
                        Hệ thống chuyên gia pháp lý hỗ trợ tư vấn thông minh, chính xác và nhanh chóng.
                    </p>
                </div>

                {/* Cột 2: Liên kết nhanh */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Liên kết nhanh</h2>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="/" className="hover:text-white">Trang chủ</a></li>
                        <li><a href="/" className="hover:text-white">Giới thiệu</a></li>
                        <li><a href="/" className="hover:text-white">Hỏi đáp</a></li>
                        <li><a href="/" className="hover:text-white">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Cột 3: Liên hệ */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Liên hệ</h2>
                    <ul className="space-y-2 text-gray-300">
                        <li>Email: support@tuvanphapluat.vn</li>
                        <li>Hotline: 0123 456 789</li>
                        <li>Địa chỉ: 123 Đường Luật, Quận 1, TP.HCM</li>
                    </ul>
                </div>
            </div>

            <div className="mt-10 border-t border-gray-600 pt-6 text-center text-gray-400 text-xs">
                © {new Date().getFullYear()} TuVanPhapLuat. All rights reserved.
            </div>
        </footer>
    )
}
export default CpFooter;
