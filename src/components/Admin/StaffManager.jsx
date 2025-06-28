import React, { useState, useEffect } from "react";
import { staffService } from "../../services/staff/staff.service";

const initialStaffState = {
  ma_nv: "",
  ten: "",
  mat_khau: "",
  role: "",
  sdt: "",
  email: "",
  cmnd: "",
  phai: "",
  phong_ban: "",
  ngay_vao_lam: "",
  trang_thai: "",
  dang_hien: true,
};

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermRole, setSearchTermRole] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [currentStaff, setCurrentStaff] = useState(initialStaffState);
  const [loading, setLoading] = useState(false);

  // Load staff from API
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffService.getAll();
      setStaff(res.data.staff || []);
      setFilteredStaff(res.data.staff || []);
    } catch {
      alert("Không thể tải danh sách nhân viên!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = staff;
    if (searchTermName) {
      results = results.filter((member) =>
        (member.ten || "").toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermRole) {
      results = results.filter((member) =>
        (member.role || "").toLowerCase().includes(searchTermRole.toLowerCase())
      );
    }
    setFilteredStaff(results);
  }, [searchTermName, searchTermRole, staff]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentStaff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddStaff = () => {
    setIsAdding(true);
    setEditingStaff(null);
    setCurrentStaff(initialStaffState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        // Không gửi mat_khau khi update
        const { mat_khau, ...updateData } = currentStaff;
        await staffService.update(editingStaff.id, updateData);
        alert("Cập nhật nhân viên thành công!");
      } else {
        // Gửi cả mat_khau khi tạo mới
        await staffService.create(currentStaff);
        alert("Thêm nhân viên mới thành công!");
      }
      setIsAdding(false);
      setEditingStaff(null);
      setCurrentStaff(initialStaffState);
      fetchStaff();
    } catch (error) {
      alert(
        error?.response?.data?.error?.message ||
          "Có lỗi xảy ra khi lưu nhân viên!"
      );
    }
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setCurrentStaff(member);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await staffService.delete(id);
        alert("Xóa nhân viên thành công!");
        fetchStaff();
      } catch (error) {
        alert(
          error?.response?.data?.error?.message ||
            "Có lỗi xảy ra khi xóa nhân viên!"
        );
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingStaff(null);
    setCurrentStaff(initialStaffState);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-700">
        Quản Lý Nhân Viên
      </h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Lọc Nhân Viên
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Lọc theo Tên Nhân Viên"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermName}
            onChange={(e) => setSearchTermName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Lọc theo Chức Vụ (Role)"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermRole}
            onChange={(e) => setSearchTermRole(e.target.value)}
          />
        </div>
      </div>

      {/* --- Add/Update Form --- */}
      {(isAdding || editingStaff) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingStaff ? "Cập Nhật Thông Tin Nhân Viên" : "Thêm Nhân Viên Mới"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Các trường nhập liệu */}
            {Object.keys(initialStaffState).map((key) => {
              if (key === "dang_hien") return null;
              let inputType = "text";
              if (key === "ngay_vao_lam") inputType = "date";
              if (key === "mat_khau") {
                // Chỉ cho nhập mật khẩu khi thêm mới
                if (editingStaff) return null;
                return (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 capitalize mb-1">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      id={key}
                      name={key}
                      value={currentStaff[key]}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </div>
                );
              }
              if (key === "phai") {
                return (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 capitalize mb-1">
                      {key.replace(/_/g, " ")}
                    </label>
                    <select
                      id={key}
                      name={key}
                      value={currentStaff[key]}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    <label className="text-sm font-medium text-gray-700 capitalize mb-1">
                      {key.replace(/_/g, " ")}
                    </label>
                    <select
                      id={key}
                      name={key}
                      value={currentStaff[key]}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    <label className="text-sm font-medium text-gray-700 capitalize mb-1">
                      {key.replace(/_/g, " ")}
                    </label>
                    <select
                      id={key}
                      name={key}
                      value={currentStaff[key]}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="active">Đang làm</option>
                      <option value="inactive">Nghỉ việc</option>
                      <option value="suspended">Tạm nghỉ</option>
                    </select>
                  </div>
                );
              }
              return (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 capitalize mb-1">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type={inputType}
                    id={key}
                    name={key}
                    value={currentStaff[key]}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Nhập ${key.replace(/_/g, " ")}`}
                    required={["ma_nv", "ten", "role", "email"].includes(key)}
                  />
                </div>
              );
            })}
            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
              >
                {editingStaff ? "Cập Nhật" : "Thêm Mới"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Staff List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Danh Sách Nhân Viên
          </h2>
          <button
            onClick={handleAddStaff}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
          >
            Thêm Nhân Viên
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : filteredStaff.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy nhân viên nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã NV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên NV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chức Vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng Ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SĐT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.ma_nv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.ten}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.phong_ban}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.sdt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.trang_thai === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.trang_thai}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-300"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900 transition duration-300"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManager;