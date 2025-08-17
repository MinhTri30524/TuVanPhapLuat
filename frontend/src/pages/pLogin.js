import React from "react";

const PLogin = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="absolute top-6 left-6 flex items-center gap-4">
                <img src="/assets/imgs/LogoChu2.png" alt="logo" className="h-10" />
                <a
                    href="/"
                    className="text-[#1D3557] border border-[#1D3557] px-4 py-1 rounded-full text-sm hover:bg-[#1D3557] hover:text-white transition"
                >
                    ← Quay về trang chủ
                </a>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-[#1D3557] text-center mb-4">
                    Đăng nhập để tiếp tục
                </h2>

                <p className="text-sm text-center mb-6">
                    Bạn chưa có tài khoản Tư Vấn Pháp Luật?{" "}
                    <a href="/register" className="text-[#E63946] hover:underline">
                        Đăng ký tại đây!
                    </a>
                </p>

                <form className="space-y-4">
                    <div>
                        <label className="block font-medium text-sm mb-1">
                            Tên tài khoản hoặc email *
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D3557]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Mật khẩu *</label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#1D3557]"
                            required
                        />
                    </div>

                    <div className="text-right">
                        <a
                            href="/forgot-password"
                            className="text-sm text-[#E63946] hover:underline"
                        >
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1D3557] text-white py-2 rounded font-semibold hover:opacity-90 transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="text-center my-4 text-sm text-gray-500">Hoặc</div>

                <div className="flex flex-col gap-2">
                    <button className="w-full flex items-center justify-center gap-2 border rounded py-2 hover:bg-gray-50 transition">
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="h-5"
                        />
                        Đăng nhập bằng Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border rounded py-2 hover:bg-gray-50 transition">
                        <img
                            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                            alt="Facebook"
                            className="h-5"
                        />
                        Đăng nhập bằng Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PLogin;
