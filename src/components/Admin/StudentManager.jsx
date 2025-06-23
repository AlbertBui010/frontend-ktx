import React, { useState, useEffect } from "react";
import { studentService } from "../../services/student/student.service";

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

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermMSSV, setSearchTermMSSV] = useState("");
  const [searchTermPhone, setSearchTermPhone] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(initialStudentState);
  const [loading, setLoading] = useState(false);

  // Load students from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAll();
      setStudents(res.data.students || res.data.sinh_vien || []);
      setFilteredStudents(res.data.students || res.data.sinh_vien || []);
    } catch (error) {
      alert("Không thể tải danh sách sinh viên!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = students;
    if (searchTermName) {
      results = results.filter((student) =>
        (student.ten || "").toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermMSSV) {
      results = results.filter((student) =>
        (student.mssv || "").toLowerCase().includes(searchTermMSSV.toLowerCase())
      );
    }
    if (searchTermPhone) {
      results = results.filter((student) =>
        (student.sdt || "").includes(searchTermPhone)
      );
    }
    setFilteredStudents(results);
  }, [searchTermName, searchTermMSSV, searchTermPhone, students]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    setIsAdding(true);
    setEditingStudent(null);
    setCurrentStudent(initialStudentState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, currentStudent);
        alert("Cập nhật sinh viên thành công!");
      } else {
        await studentService.create(currentStudent);
        alert("Thêm sinh viên mới thành công!");
      }
      setIsAdding(false);
      setEditingStudent(null);
      setCurrentStudent(initialStudentState);
      fetchStudents();
    } catch (error) {
      alert(
        error?.response?.data?.error?.message ||
          "Có lỗi xảy ra khi lưu sinh viên!"
      );
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setCurrentStudent(student);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        await studentService.delete(id);
        alert("Xóa sinh viên thành công!");
        fetchStudents();
      } catch (error) {
        alert(
          error?.response?.data?.error?.message ||
            "Có lỗi xảy ra khi xóa sinh viên!"
        );
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingStudent(null);
    setCurrentStudent(initialStudentState);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        Quản Lý Sinh Viên
      </h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Lọc Sinh Viên
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Lọc theo Tên"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={searchTermName}
            onChange={(e) => setSearchTermName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Lọc theo Mã Số Sinh Viên"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={searchTermMSSV}
            onChange={(e) => setSearchTermMSSV(e.target.value)}
          />
          <input
            type="text"
            placeholder="Lọc theo Số Điện Thoại"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={searchTermPhone}
            onChange={(e) => setSearchTermPhone(e.target.value)}
          />
        </div>
      </div>

      {/* --- Add/Update Form --- */}
      {(isAdding || editingStudent) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingStudent ? "Cập Nhật Sinh Viên" : "Thêm Sinh Viên Mới"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Object.keys(initialStudentState).map((key) => {
              if (["dang_hien"].includes(key)) return null;
              let inputType = "text";
              if (key === "ngay_sinh" || key === "ngay_cap_cmnd")
                inputType = "date";
              if (key === "sdt" || key === "cmnd") inputType = "number";
              if (key === "phai") {
                return (
                  <div key={key} className="flex flex-col">
                    <label
                      htmlFor={key}
                      className="text-sm font-medium text-gray-700 capitalize mb-1"
                    >
                      {key.replace(/_/g, " ")}
                    </label>
                    <select
                      id={key}
                      name={key}
                      value={currentStudent[key]}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nu">Nữ</option>
                      <option value="Khac">Khác</option>
                    </select>
                  </div>
                );
              }
              if (key === "trang_thai") {
                return (
                  <div key={key} className="flex flex-col">
                    <label
                      htmlFor={key}
                      className="text-sm font-medium text-gray-700 capitalize mb-1"
                    >
                      {key.replace(/_/g, " ")}
                    </label>
                    <select
                      id={key}
                      name={key}
                      value={currentStudent[key]}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                      required
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="active_resident">Đang ở</option>
                      <option value="applicant">Chờ duyệt</option>
                      <option value="inactive">Chưa đăng ký</option>
                    </select>
                  </div>
                );
              }
              return (
                <div key={key} className="flex flex-col">
                  <label
                    htmlFor={key}
                    className="text-sm font-medium text-gray-700 capitalize mb-1"
                  >
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type={inputType}
                    id={key}
                    name={key}
                    value={currentStudent[key]}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder={`Nhập ${key.replace(/_/g, " ")}`}
                    required
                  />
                </div>
              );
            })}

            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-black hover:bg-green-600 hover:scale-105 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition transform duration-100"
              >
                {editingStudent ? "Cập Nhật" : "Thêm Mới"}
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

      {/* --- Student List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Danh Sách Sinh Viên
          </h2>
          <button
            onClick={handleAddStudent}
            className="bg-black hover:bg-green-600 hover:scale-105 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition transform duration-100"
          >
            Thêm Sinh Viên
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500">
            Không tìm thấy sinh viên nào.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã SV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giới Tính
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SĐT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khoa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.mssv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.ten}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.phai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.ngay_sinh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.sdt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.khoa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.trang_thai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(student)}
                        className="w-[100px] h-[50px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-orange-500 mr-3 rounded-[50px] "
                      >
                        Cập Nhật
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="w-[100px] h-[50px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-red-500 mr-3 rounded-[50px]"
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

export default StudentManager;