import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CpHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({});
    const [avatarPreview, setAvatarPreview] = useState(""); // preview ảnh
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            const userObj = JSON.parse(storedUser);
            setUser({
                ...userObj,
                avatar: userObj.avatar || "https://www.svgrepo.com/show/452030/avatar-default.svg",
            });
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const openProfile = () => {
        if (user) {
            setProfileData({
                username: user.username,
                email: user.email,
                phone_number: user.phone_number || "",
                avatarFile: null,
            });
            setAvatarPreview(user.avatar || "https://www.svgrepo.com/show/452030/avatar-default.svg");
            setProfileOpen(true);
            setUserMenuOpen(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData({ ...profileData, avatarFile: file });
            setAvatarPreview(URL.createObjectURL(file)); // preview ngay
        }
    };

    const saveProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("username", profileData.username);
            formData.append("email", profileData.email);
            formData.append("phone_number", profileData.phone_number);
            if (profileData.avatarFile) {
                formData.append("avatar", profileData.avatarFile);
            }

            const res = await axios.patch("/api/me/", formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setUser({
                ...res.data,
                avatar: res.data.avatar || "https://www.svgrepo.com/show/452030/avatar-default.svg",
            });
            localStorage.setItem("user", JSON.stringify(res.data));
            toast.success("Cập nhật thông tin thành công!");
            setProfileOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-8 h-20 flex items-center justify-between overflow-visible">
            <img
                src="/assets/imgs/logo.jpg"
                alt="Logo nền"
                className="absolute inset-0 m-auto w-20 opacity-10 pointer-events-none"
                style={{ zIndex: 0 }}
            />

            {/* Logo chính */}
            <div className="z-10">
                <img src="/assets/imgs/LogoChu2.png" alt="Logo" className="h-24 object-contain" />
            </div>

            {/* Menu chính */}
            <div className="hidden md:flex gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button onClick={() => navigate('/')} className="hover:text-[#1D3557]">Trang Chủ</button>
                <button onClick={() => navigate('/vanban')} className="hover:text-[#1D3557]">Văn Bản</button>
                <button onClick={() => navigate('/tuvan')} className="hover:text-[#1D3557]">Đặt câu hỏi</button>
                <button onClick={() => navigate('/tintuc')} className="hover:text-[#1D3557]">Tin Tức Pháp Luật</button>
                <button onClick={() => navigate('/chat')} className="hover:text-[#1D3557]">Chat Bot Tư Vấn</button>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="hover:text-[#1D3557]"    
                >
                    <img src="/assets/imgs/menu.png" alt="menu" className="w-6 h-6" />
                </button>
            </div>

            {/* Mega menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-screen bg-white shadow-lg z-50">
                    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-4 gap-6">
                        <div> <h3 className="font-bold text-red-600">Văn bản</h3> <ul className="mt-1 space-y-1"> <li>Văn bản mới</li> <li>Văn bản luật Việt Nam</li> <li>Văn bản tiếng Anh</li> <li>Văn bản UBND</li> <li>Công văn</li> <li>Tiêu chuẩn Việt Nam</li> </ul> </div> 
                        <div> <h3 className="font-bold text-red-600">Lĩnh vực tra cứu</h3> <input type="text" placeholder="Tìm lĩnh vực..." className="border rounded p-1 w-full mb-2" /> <ul className="space-y-1"> <li>An ninh quốc gia</li> <li>Bảo hiểm</li> <li>Chính sách</li> <li>Công nghiệp</li> </ul> </div> 
                        <div> <h3 className="font-bold text-red-600">Tin tức pháp luật</h3> <ul className="space-y-1"> <li>Tin văn bản mới</li> <li>Thuế - Phí</li> <li>Đất đai - Nhà ở</li> <li>Lao động</li> <li>Giao thông</li> </ul> </div> 
                        <div> <h3 className="font-bold text-red-600">Dịch vụ</h3> <ul className="space-y-1"> <li>Tra cứu văn bản</li> <li>Phân tích văn bản</li> <li>Dịch vụ dịch thuật</li> <li>Tổng đài tư vấn</li> </ul> </div>
                    </div>
                </div>
            )}

            {/* Khu vực bên phải */}
            <div className="flex items-center gap-3 z-10">
                {!user ? (
                    <button className="hover:underline" onClick={() => navigate('/login')}>
                        Đăng nhập
                    </button>
                ) : (
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full border object-cover cursor-pointer"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        />

                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg p-2 z-50">
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <button
                                    className="w-full text-left mt-2 text-blue-600 hover:underline"
                                    onClick={openProfile}
                                >
                                    Cài đặt
                                </button>
                                <button
                                    className="w-full text-left mt-1 text-red-600 hover:underline"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={() => navigate('/tracuu')}
                    className="bg-[#1D3557] text-white px-4 py-2 rounded-full hover:opacity-90"
                >
                    Tra cứu ngay
                </button>
            </div>

            {/* Profile Modal */}
            {profileOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Cập nhật thông tin</h2>

                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={avatarPreview}
                                alt="preview"
                                className="w-20 h-20 rounded-full object-cover border mb-2"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="w-full"
                            />
                        </div>

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            className="w-full mb-2 p-2 border rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full mb-2 p-2 border rounded"
                        />
                        <input
                            type="tel"
                            name="phone_number"
                            placeholder="Số điện thoại"
                            value={profileData.phone_number}
                            onChange={handleProfileChange}
                            className="w-full mb-2 p-2 border rounded"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setProfileOpen(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={saveProfile}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default CpHeader;
