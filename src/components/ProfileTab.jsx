import React from "react";
import { X } from "lucide-react";
import { authService } from "../services/auth/auth.service";
import {  useNavigate } from "react-router-dom";

const ProfileTab = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await authService.logout();
        navigate("/login");
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={onClose}
                ></div>
            )}

            {/* Side tab */}
            <div
                className={`fixed top-0 right-0 h-full w-[250px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between px-4 py-4 border-b flex-col space-y-4">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-xl font-bold">Xin Chào!</h2>
                        <button onClick={onClose}>
                            <X className="w-6 h-6 hover:text-red-500" />
                        </button>
                    </div>
                    <div className="">
                        <p className="text-sm text-gray-600">
                            Account: {user?.ten || "Người Dùng"}
                        </p>
                    </div>

                </div>

                <div className="flex flex-col px-4 py-6 space-y-4 text-[16px] font-medium">
                    <a href="/profile" className="hover:text-orange-600">
                        Thông Tin Cá Nhân
                    </a>

                    {(user?.role === "admin" || user?.role === "staff") && (
                        <a href="/admin" className="hover:text-orange-600">
                            Trang Quản Trị
                        </a>
                    )}

                    <button
                        onClick={handleLogout}
                        className="text-left text-red-600 hover:text-red-800"
                    >
                        Đăng Xuất
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileTab;
