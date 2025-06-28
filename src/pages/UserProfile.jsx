// src/pages/UserProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth/auth.service";
import { studentService } from "../services/student/student.service";
import { staffService } from "../services/staff/staff.service";

/* ----- Khai báo field ----- */
const FIELD_CONFIG = {
  student: [
    { key: "mssv", label: "MSSV", noEdit: true, required: true },
    { key: "ten", label: "Tên", required: true },
    { key: "dia_chi", label: "Địa chỉ" },
    { key: "phai", label: "Giới tính", type: "select", opts: ["Nam", "Nữ", "Khác"] },
    { key: "ngay_sinh", label: "Ngày sinh", type: "date" },
    { key: "noi_sinh", label: "Nơi sinh" },
    { key: "dan_toc", label: "Dân tộc" },
    { key: "ton_giao", label: "Tôn giáo" },
    { key: "khoa", label: "Khoa" },
    { key: "lop", label: "Lớp" },
    { key: "sdt", label: "SĐT", type: "number" },
    { key: "email", label: "Email", required: true },
    { key: "cmnd", label: "CMND", type: "number" },
    { key: "ngay_cap_cmnd", label: "Ngày cấp CMND", type: "date" },
    { key: "noi_cap_cmnd", label: "Nơi cấp CMND" },
    { key: "ho_khau", label: "Hộ khẩu" },
    { key: "dia_chi_lien_he", label: "Địa chỉ liên hệ" },
  ],
  staff: [
    { key: "ma_nv", label: "Mã NV", noEdit: true, required: true },
    { key: "ten", label: "Tên", required: true },
    { key: "phai", label: "Giới tính", type: "select", opts: ["Nam", "Nữ", "Khác"] },
    { key: "ngay_vao_lam", label: "Ngày vào làm", type: "date", noEdit: true },
    { key: "phong_ban", label: "Phòng ban", noEdit: true },
    {
      key: "role",
      label: "Chức vụ",
      noEdit: true,
      type: "select",
      opts: [
        { value: "admin", text: "Admin" },
        { value: "staff", text: "Staff" },
      ],
    },
    { key: "sdt", label: "SĐT", type: "number" },
    { key: "email", label: "Email", required: true },
    { key: "cmnd", label: "CMND", type: "number" },
  ],
};

export default function UserProfile() {
  const [formData, setFormData] = useState({});
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [type, setType] = useState(null); // 'student' | 'staff'

  useEffect(() => {
    (async () => {
      try {
        const { user } = await authService.getProfile();
        const t = user.ma_nv || user.role === "admin" ? "staff" : "student";
        setType(t);
        setFormData(user);
        setOriginal(user);
      } catch {
        alert("Không lấy được thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fields = useMemo(() => (type ? FIELD_CONFIG[type] : []), [type]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onSave = async () => {
    setLoading(true);
    try {
      if (type === "student") await studentService.update(formData.id, formData);
      else await staffService.update(formData.id, formData);
      authService.setUserInfo(formData, type);
      setOriginal(formData);
      alert("Cập nhật thành công!");
      setEditing(false);
    } catch (err) {
      alert(err?.response?.data?.error?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải…</p>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl p-8 rounded-lg mt-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Thông Tin {type === "student" ? "Sinh Viên" : "Nhân Viên"}
        </h1>
        <div className="w-[75px] h-1 bg-orange-500"></div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ key, label, type: fType = "text", opts, required, noEdit }) => {
          const disabled = !editing || noEdit;

          if (fType === "select") {
            return (
              <div key={key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium">{label}</label>
                <select
                  name={key}
                  value={formData[key] ?? ""}
                  onChange={onChange}
                  disabled={disabled}
                  required={required && !disabled}
                  className={`p-3 rounded-md ${disabled ? "bg-gray-100 cursor-not-allowed" : "border border-gray-300 focus:ring-2 focus:ring-orange-400"
                    }`}
                >
                  <option value="">-- Chọn --</option>
                  {opts.map((o) =>
                    typeof o === "string"
                      ? <option key={o} value={o}>{o}</option>
                      : <option key={o.value} value={o.value}>{o.text}</option>
                  )}
                </select>
              </div>
            );
          }

          return (
            <div key={key} className="flex flex-col">
              <label className="mb-1 text-sm font-medium">{label}</label>
              <input
                type={fType}
                name={key}
                value={formData[key] ?? ""}
                onChange={onChange}
                disabled={disabled}
                required={required && !disabled}
                className={`p-3 rounded-md ${disabled ? "bg-gray-100 cursor-not-allowed" : "border border-gray-300 focus:ring-2 focus:ring-orange-400"
                  }`}
              />
            </div>
          );
        })}
      </div>

      {/* Nút thao tác nằm ngoài <form> để tránh trigger submit bất ngờ */}
      <div className="mt-8 flex justify-end gap-4">
        {editing ? (
          <>
            <button
              onClick={onSave}
              className="px-6 py-3 bg-black transition transform duration-200 hover:bg-green-500 text-white rounded-md font-bold"
              disabled={loading}
            >
              Lưu
            </button>
            <button
              onClick={() => {
                setFormData(original);
                setEditing(false);
              }}
              className="px-6 py-3 bg-black transition transform duration-200 hover:bg-red-500 text-white rounded-md font-bold"
              disabled={loading}
            >
              Hủy
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-3 bg-black transition transform duration-200 hover:bg-orange-500 text-white rounded-md font-bold"
          >
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}
