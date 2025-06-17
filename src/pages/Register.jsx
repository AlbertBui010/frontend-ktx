import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import bgLogin from "/img/login-bg.jpg";
import "react-datepicker/dist/react-datepicker.css";
import { studentService } from '../services/student/student.service';
import SuccessRegisterAlert from '../components/SuccessRegisterAlert';
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mssv: '',
    ten: '',
    dia_chi: '',
    email: '',
    phai: '',
    ngay_sinh: '',
    noi_sinh: '',
    dan_toc: '',
    ton_giao: '',
    khoa: '',
    lop: '',
    sdt: '',
    cmnd: '',
    ngay_cap_cmnd: '',
    noi_cap_cmnd: '',
    ho_khau: '',
    dia_chi_lien_he: '',
    ghi_chu: '',
    ngay_bat_dau_o: '',
    ly_do_dang_ky: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await studentService.registerStudent(formData);
      console.log("Đăng ký thành công:", response);
      // Nếu đăng ký thành công (status code từ server là 2xx)
      if (response.success === true) {
        // Hiện popup và truyền data
        setSuccessData(response.data);
        setShowSuccess(true);
        // Không navigate ngay, chờ user đóng popup
      } else {
        alert(`Có lỗi xảy ra khi đăng ký: ${response.statusText}`);
      }
    }  catch (error) {
      console.error("Đăng ký thất bại:", error);

      // Nếu server trả lỗi có nội dung
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Lỗi từ server: ${error.response.data.message}`);
      } else {
        alert("Không thể kết nối đến máy chủ hoặc có lỗi mạng.");
      }
    }
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSuccessData(null);
    navigate("/"); // Điều hướng sau khi đóng popup
  };
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
       <SuccessRegisterAlert open={showSuccess} onClose={handleCloseSuccess} data={successData} />
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className=" container mx-auto flex justify-center items-center h-full z-10">
        <div className="relative w-[80%] bg-white rounded-[100px] border-black border-[2px] p-6">
          <div className="w-full h-[150px] bg-white border-b-[2px] border-black rounded-t-[200px] flex justify-center items-center">
            <h1 className='text-black text-4xl font-bold'>DORMANAGE</h1>
          </div>

          <div className="w-full mx-auto flex justify-center items-center mt-10 ">
            <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full items-center justify-between'>
              <h1 className='text-3xl font-bold text-center mb-4'>Đăng Ký</h1>
              <div className="grid grid-cols-3 gap-6 mx-auto w-[80%]">
                {/* MSSV */}
                <div className="flex flex-col">
                  <label htmlFor="mssv" className="mb-1 font-semibold text-gray-700">MSSV:</label>
                  <input name="mssv" id="mssv" placeholder="MSSV" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Tên Sinh Viên */}
                <div className="flex flex-col">
                  <label htmlFor="ten" className="mb-1 font-semibold text-gray-700">Tên Sinh Viên:</label>
                  <input name="ten" id="ten" placeholder="Tên Sinh Viên" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 font-semibold text-gray-700">Email:</label>
                  <input name="email" id="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Địa Chỉ */}
                <div className="flex flex-col">
                  <label htmlFor="dia_chi" className="mb-1 font-semibold text-gray-700">Địa Chỉ:</label>
                  <input name="dia_chi" id="dia_chi" placeholder="Địa Chỉ" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Giới Tính */}
                <div className="flex flex-col">
                  <label htmlFor="phai" className="mb-1 font-semibold text-gray-700">Giới Tính:</label>
                  <select name="phai" id="phai" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow">
                    <option value="">-- Chọn Giới Tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                {/* Ngày Sinh */}
                <div className="flex flex-col">
                  <label htmlFor="ngay_sinh" className="mb-1 font-semibold text-gray-700">Ngày Sinh:</label>
                  <input type='date' name="ngay_sinh" id="ngay_sinh" placeholder="dd/mm/yyyy" onChange={handleChange} required className="w-full  h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Nơi Sinh */}
                <div className="flex flex-col">
                  <label htmlFor="noi_sinh" className="mb-1 font-semibold text-gray-700">Nơi Sinh:</label>
                  <input name="noi_sinh" id="noi_sinh" placeholder="Nơi Sinh" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Dân Tộc */}
                <div className="flex flex-col">
                  <label htmlFor="dan_toc" className="mb-1 font-semibold text-gray-700">Dân Tộc:</label>
                  <input name="dan_toc" id="dan_toc" placeholder="Dân Tộc" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Tôn Giáo */}
                <div className="flex flex-col">
                  <label htmlFor="ton_giao" className="mb-1 font-semibold text-gray-700">Tôn Giáo:</label>
                  <input name="ton_giao" id="ton_giao" placeholder="Tôn Giáo" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Khoa */}
                <div className="flex flex-col">
                  <label htmlFor="khoa" className="mb-1 font-semibold text-gray-700">Khoa:</label>
                  <input name="khoa" id="khoa" placeholder="Khoa" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Lớp */}
                <div className="flex flex-col">
                  <label htmlFor="lop" className="mb-1 font-semibold text-gray-700">Lớp:</label>
                  <input name="lop" id="lop" placeholder="Lớp" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Số Điện Thoại */}
                <div className="flex flex-col">
                  <label htmlFor="sdt" className="mb-1 font-semibold text-gray-700">Số Điện Thoại:</label>
                  <input name="sdt" id="sdt" placeholder="Số Điện Thoại" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* CMND/CCCD */}
                <div className="flex flex-col">
                  <label htmlFor="cmnd" className="mb-1 font-semibold text-gray-700">CMND/CCCD:</label>
                  <input name="cmnd" id="cmnd" placeholder="CMND/CCCD" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Ngày Cấp CMND */}
                <div className="flex flex-col">
                  <label htmlFor="ngay_cap_cmnd" className="mb-1 font-semibold text-gray-700">Ngày Cấp CMND:</label>
                  <input name="ngay_cap_cmnd" type='date' id="ngay_cap_cmnd" placeholder="Ngày Cấp CMND" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Nơi Cấp CMND */}
                <div className="flex flex-col">
                  <label htmlFor="noi_cap_cmnd" className="mb-1 font-semibold text-gray-700">Nơi Cấp CMND:</label>
                  <input name="noi_cap_cmnd" id="noi_cap_cmnd" placeholder="Nơi Cấp CMND" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Hộ Khẩu */}
                <div className="flex flex-col">
                  <label htmlFor="ho_khau" className="mb-1 font-semibold text-gray-700">Hộ Khẩu:</label>
                  <input name="ho_khau" id="ho_khau" placeholder="Hộ Khẩu" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Địa Chỉ Liên Hệ */}
                <div className="flex flex-col">
                  <label htmlFor="dia_chi_lien_he" className="mb-1 font-semibold text-gray-700">Địa Chỉ Liên Hệ:</label>
                  <input name="dia_chi_lien_he" id="dia_chi_lien_he" placeholder="Địa Chỉ Liên Hệ" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Ngày Bắt Đầu Ở */}
                <div className="flex flex-col">
                  <label htmlFor="ngay_bat_dau_o" className="mb-1 font-semibold text-gray-700">Ngày Bắt Đầu Ở:</label>
                  <input name="ngay_bat_dau_o" id="ngay_bat_dau_o" type='date' placeholder="Ngày Bắt Đầu Ở" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
                {/* Lý Do Đăng Ký */}
                <div className="flex flex-col">
                  <label htmlFor="ly_do_dang_ky" className="mb-1 font-semibold text-gray-700">Lý Do Đăng Ký:</label>
                  <input name="ly_do_dang_ky" id="ly_do_dang_ky" placeholder="Lý Do Đăng Ký" onChange={handleChange} required className="w-full h-[45px] border-2 border-gray-300 px-5 text-base shadow" />
                </div>
              </div>

              {/* Ghi chú */}
              <div className="w-[80%] mb-2">
                <label htmlFor="ghi_chu" className="mb-1 font-semibold text-gray-700 block">
                  Ghi chú:
                </label>
                <textarea
                  name="ghi_chu"
                  id="ghi_chu"
                  placeholder="Nhập nguyện vọng của bạn! Ví dụ: Nguyện vọng ở phòng đơn, phòng đôi, Lý do..."
                  value={formData.ghi_chu}
                  onChange={handleChange}
                  className="w-full h-[160px] border-2 border-gray-300 px-5 text-base shadow resize-none"
                />
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
    </div>
  );
};

export default Register;
