import React, { useEffect, useState } from "react";
import { studentService } from "../services/student/student.service";
import { staffService } from "../services/staff/staff.service";
import { authService } from "../services/auth/auth.service";

// Các trường cho từng loại user
const studentFields = [
  "mssv",
  "ten",
  "dia_chi",
  "phai",
  "ngay_sinh",
  "noi_sinh",
  "dan_toc",
  "ton_giao",
  "khoa",
  "sdt",
  "cmnd",
  "ngay_cap_cmnd",
  "noi_cap_cmnd",
  "ho_khau",
  "dia_chi_lien_he",
  "trang_thai",
  "email",
  "lop",
];
const staffFields = [
  "ma_nv",
  "ten",
  "phai",
  "ngay_vao_lam",
  "phong_ban",
  "role",
  "sdt",
  "email",
  "cmnd",
  "trang_thai",
];

const initialStudentState = {
  mssv: "",
  ten: "",
  dia_chi: "",
  phai: "",
  ngay_sinh: "",
  noi_sinh: "",
  dan_toc: "",
  ton_giao: "",
  khoa: "",
  sdt: "",
  cmnd: "",
  ngay_cap_cmnd: "",
  noi_cap_cmnd: "",
  ho_khau: "",
  dia_chi_lien_he: "",
  trang_thai: "",
  email: "",
  lop: "",
  dang_hien: true,
};
const initialStaffState = {
  ma_nv: "",
  ten: "",
  phai: "",
  ngay_vao_lam: "",
  phong_ban: "",
  role: "",
  sdt: "",
  email: "",
  cmnd: "",
  trang_thai: "",
  dang_hien: true,
};

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("student");

  useEffect(() => {
    const userInfo = authService.getUserInfo();
    // Ưu tiên kiểm tra role === "admin" trước
    if (userInfo?.role === "admin") {
      setUserType("admin");
      setUser({ ...initialStaffState, ...userInfo });
    } else if (userInfo?.ma_nv) {
      setUserType("staff");
      setUser({ ...initialStaffState, ...userInfo });
    } else {
      setUserType("student");
      setUser({ ...initialStudentState, ...userInfo });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (userType === "student") {
        await studentService.update(user.id, user);
        authService.setUserInfo(user, "student");
      } else {
        await staffService.update(user.id, user);
        authService.setUserInfo(user, userType); // staff hoặc admin
      }
      alert("Cập nhật thông tin thành công!");
      setEditing(false);
    } catch (error) {
      alert(
        error?.response?.data?.error?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin!"
      );
    }
    setLoading(false);
  };

  // Chọn fields phù hợp
  const fields = userType === "student" ? studentFields : staffFields;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Thông Tin Cá Nhân (
        {userType === "student"
          ? "Sinh viên"
          : userType === "admin"
          ? "Admin"
          : "Nhân viên"}
        )
      </h2>
      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {fields.map((key) => {
          let inputType = "text";
          if (["ngay_sinh", "ngay_cap_cmnd", "ngay_vao_lam"].includes(key))
            inputType = "date";
          if (["sdt", "cmnd"].includes(key)) inputType = "number";
          if (key === "phai") {
            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, " ")}
                </label>
                <select
                  name={key}
                  value={user[key] || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            );
          }
          if (key === "role") {
            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, " ")}
                </label>
                <select
                  name={key}
                  value={user[key] || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            );
          }
          if (key === "trang_thai") {
            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, " ")}
                </label>
                <select
                  name={key}
                  value={user[key] || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  {userType === "student" ? (
                    <>
                      <option value="active_resident">Đang ở</option>
                      <option value="applicant">Chờ duyệt</option>
                      <option value="inactive">Chưa đăng ký</option>
                    </>
                  ) : (
                    <>
                      <option value="active">Đang làm</option>
                      <option value="inactive">Nghỉ việc</option>
                      <option value="suspended">Tạm nghỉ</option>
                    </>
                  )}
                </select>
              </div>
            );
          }
          return (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type={inputType}
                name={key}
                value={user[key] || ""}
                onChange={handleChange}
                disabled={!editing}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                required={["mssv", "ten", "email", "ma_nv"].includes(key)}
              />
            </div>
          );
        })}
        <div className="col-span-full flex justify-end space-x-4 mt-4">
          {editing ? (
            <>
              <button
                type="submit"
                className="bg-black hover:bg-green-600 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition"
                disabled={loading}
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition"
                disabled={loading}
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-black hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;