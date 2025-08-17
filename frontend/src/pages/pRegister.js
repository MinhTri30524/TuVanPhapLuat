import React, { useState } from 'react';

function PRegister() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Validate and send data to API
        console.log('Đăng ký với dữ liệu:', formData);
    };

    return (
        <div className="min-h-screen bg-[#f4f4f4] relative px-4 pt-24 flex flex-col items-center justify-center">
            <div className="absolute top-6 left-6 flex items-center gap-4">
                <img src="/assets/imgs/LogoChu2.png" alt="logo" className="h-10" />
                <a
                    href="/"
                    className="text-[#1D3557] border border-[#1D3557] px-4 py-1 rounded-full text-sm hover:bg-[#1D3557] hover:text-white transition"
                >
                    ← Quay về trang chủ
                </a>
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-[#1D3557]">Tạo tài khoản miễn phí</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Đã có tài khoản Tư Vấn Pháp Luật?{' '}
                        <a href="/login" className="text-red-600 underline hover:text-red-800">Đăng nhập tại đây!</a>
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Tên tài khoản *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#1D3557]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email của bạn *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#1D3557]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Số điện thoại *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#1D3557]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Mật khẩu *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#1D3557]"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Nhập lại mật khẩu *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#1D3557]"
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Bằng cách đăng ký, bạn đồng ý với{' '}
                        <a href="/" className="text-red-600 underline hover:text-red-800">Quy ước sử dụng</a> của Tư Vấn Pháp Luật.
                    </p>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-[#1D3557] text-white py-2 rounded-lg hover:bg-[#16324a] transition"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
}
export default PRegister;