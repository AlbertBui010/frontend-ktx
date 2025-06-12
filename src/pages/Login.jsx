import React from "react";
import { Link, useNavigate } from "react-router-dom";
import bgLogin from "/img/login-bg.jpg";
import { authService } from "../services/auth/auth.service";
import { ROLE } from "../constant/api";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    tai_khoan: "",
    mat_khau: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý đầu vào hợp lệ
    if (!formData.tai_khoan || !formData.mat_khau) {
      alert("Vui lòng điền đầy đủ thông tin đăng nhập.");
      return;
    }

    if (formData.tai_khoan.length < 5 || formData.mat_khau.length < 6) {
      alert(
        "Tên đăng nhập phải có ít nhất 5 ký tự và mật khẩu ít nhất 6 ký tự."
      );
      return;
    }

    let dataRequest = {
      tai_khoan: formData.tai_khoan,
      mat_khau: formData.mat_khau,
    };

    let userType = ROLE.STUDENT;
    if (!formData.tai_khoan.startsWith("DH")) {
      dataRequest = {
        ma_nv: formData.tai_khoan,
        mat_khau: formData.mat_khau,
      };
      userType = ROLE.STAFF;
    }

    const response = await authService.login(dataRequest, userType);
    console.log(response);

    if (response.success) {
      localStorage.setItem("accessToken", response.data.tokens.accessToken);
      localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } else {
      alert(
        response.message || "Đăng nhập không thành công. Vui lòng thử lại."
      );
    }
  };
  return (
    <div
      className=" relative min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative w-[700px] h-auto bg-white rounded-[100px] border-black border-[2px p-6">
        <div className="w-full h-[200px] bg-white border-b-[2px] border-black rounded-t-[200px] flex justify-center items-center">
          <h1 className="text-black text-4xl font-bold">DORMANAGE</h1>
        </div>
        <div className="w-full h-[600px] flex justify-center mt-10 ">
          <form className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center">Đăng Nhập</h1>
            <input
              type="text"
              name="tai_khoan"
              value={formData.tai_khoan}
              onChange={handleChange}
              placeholder="MSSV Hoặc MA_NV"
              className="w-[400px] h-[70px] border-2 border-gray-300 rounded-[50px] border-collapse  p-4 text-lg shadow-lg"
            />
            <input
              type="mat_khau"
              name="mat_khau"
              value={formData.mat_khau}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-[400px] h-[70px] border-2 border-gray-300 border-collapse rounded-[50px] p-4 text-lg shadow-lg"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className=" p-4 w-[full] bg-black text-white font-bold rounded-[50px] text-lg duration-300 transition transform hover:bg-orange-500 shadow-lg"
            >
              Đăng Nhập
            </button>

            <div className="w-full flex justify-center mt-4">
              <p className="text-base">
                Bạn chưa có tài khoản?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="font-semibold underline cursor-pointer duration-300 transition transform hover:text-orange-500"
                >
                  Đăng Ký Tại Đây
                </span>
              </p>
            </div>
            <div className="w-full flex justify-center mt-4 text-lg">
              <Link
                to="/"
                className="font-bold underline duration-300 transition transform hover:text-orange-500"
              >
                Quay Về Trang Chủ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
