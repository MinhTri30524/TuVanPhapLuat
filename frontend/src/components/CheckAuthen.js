import React from "react";

export default function CheckAuthen({ open, onLogin, onRegister }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-96 p-6 rounded-xl shadow-lg relative text-center">

                <h2 className="text-lg font-bold text-[#1D3557] mb-4">
                    Bạn cần đăng nhập để sử dụng chức năng này
                </h2>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onLogin}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={onRegister}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
}
