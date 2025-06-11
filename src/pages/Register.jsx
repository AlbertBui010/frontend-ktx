import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import bgLogin from "/img/login-bg.jpg";
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mssv: '',
    ten: '',
    dia_chi: '',
    phai: '',
    ngay_sinh: '',
    noi_sinh: '',
    dan_toc: '',
    ton_giao: '',
    khoa: '',
    sdt: '',
    cmnd: '',
    ngay_cap_cmnd: '',
    noi_cap_cmnd: '',
    ho_khau: '',
    dia_chi_lien_he: '',
    mat_khau: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/sinhvien", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Đăng ký thành công. Vui lòng chờ duyệt từ quản trị viên.");
        navigate("/login");
      } else {
        alert("Có lỗi xảy ra khi đăng ký.");
      }
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative w-[50%] bg-white rounded-[100px] border-black border-[2px] p-6">
        <div className="w-full h-[150px] bg-white border-b-[2px] border-black rounded-t-[200px] flex justify-center items-center">
          <h1 className='text-black text-4xl font-bold'>DORMANAGE</h1>
        </div>

        <div className="w-[full] mx-auto flex justify-center mt-10 ">
          <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full items-center justify-between'>
            <h1 className='text-3xl font-bold text-center mb-4'>Đăng Ký</h1>
            <div className="grid grid-cols-2 gap-6 w-full px-8">
              <input name="mssv" placeholder="MSSV" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="ten" placeholder="Tên Sinh Viên" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="dia_chi" placeholder="Địa Chỉ" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <select name="phai" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow">
                <option value="">-- Chọn Giới Tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <input name="ngay_sinh" placeholder="dd/mm/yyyy" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="noi_sinh" placeholder="Nơi Sinh" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="dan_toc" placeholder="Dân Tộc" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="ton_giao" placeholder="Tôn Giáo" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="khoa" placeholder="Khoa" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="sdt" placeholder="Số Điện Thoại" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="cmnd" placeholder="CMND/CCCD" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="ngay_cap_cmnd" placeholder="Ngày Cấp CMND" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="noi_cap_cmnd" placeholder="Nơi Cấp CMND" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="ho_khau" placeholder="Hộ Khẩu" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input name="dia_chi_lien_he" placeholder="Địa Chỉ Liên Hệ" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
              <input type="password" name="mat_khau" placeholder="Mật Khẩu" onChange={handleChange} required className="w-[90%] h-[45px] border-2 border-gray-300 rounded-full px-5 text-base shadow" />
            </div>


            <button type="submit" className='p-4 w-[50%] bg-black text-white font-bold rounded-[50px] text-lg duration-300 transition transform hover:bg-orange-500 shadow-lg'>
              Gửi Phiếu Đăng Ký
            </button>

            <div className="w-full flex justify-center mt-4">
              <p className="text-base">
                Bạn đã có tài khoản?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="font-semibold underline cursor-pointer duration-300 transition transform hover:text-orange-500"
                >
                  Đăng nhập Tại Đây
                </span>
              </p>
            </div>
            <div className="w-full flex justify-center mt-4 text-lg">
              <Link to="/" className="font-bold underline duration-300 transition transform hover:text-orange-500">
                Quay Về Trang Chủ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
