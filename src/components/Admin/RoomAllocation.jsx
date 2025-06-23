import React, { useEffect, useState } from "react";
import { roomAllocationService } from "../../services/roomAlocation/roomAlocation.service";

const initialState = {
  id_sv: "",
  id_giuong: "",
  ngay_bat_dau: "",
  ngay_ket_thuc: "",
  trang_thai: "active",
  ly_do_ket_thuc: "",
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
};

const RoomAllocation = () => {
  const [allocations, setAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data
  const fetchAllocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await roomAllocationService.getAll();
      setAllocations(res.data.allocations || []);
      setFilteredAllocations(res.data.allocations || []);
    } catch (err) {
      setError("Không thể tải danh sách phân bổ phòng! Vui lòng thử lại.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // Search/filter
  useEffect(() => {
    let results = allocations;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (item) =>
          (item.Student?.ten || "").toLowerCase().includes(term) ||
          (item.Student?.mssv || "").toLowerCase().includes(term) ||
          (item.Bed?.ten_giuong || "").toLowerCase().includes(term) ||
          (item.Bed?.Room?.ten_phong || "").toLowerCase().includes(term)
      );
    }
    setFilteredAllocations(results);
  }, [searchTerm, allocations]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setIsFormOpen(true);
    setEditing(null);
    setForm(initialState);
    setError(null);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      id_sv: item.id_sv,
      id_giuong: item.id_giuong,
      ngay_bat_dau: formatDateForInput(item.ngay_bat_dau),
      ngay_ket_thuc: formatDateForInput(item.ngay_ket_thuc),
      trang_thai: item.trang_thai,
      ly_do_ket_thuc: item.ly_do_ket_thuc || "",
    });
    setIsFormOpen(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditing(null);
    setForm(initialState);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dataToSend = {
        ...form,
        ngay_bat_dau: form.ngay_bat_dau,
        ngay_ket_thuc: form.ngay_ket_thuc || null,
      };
      if (editing) {
        await roomAllocationService.update(editing.id, dataToSend);
        alert("Cập nhật phân bổ thành công!");
      } else {
        await roomAllocationService.create(dataToSend);
        alert("Thêm phân bổ mới thành công!");
      }
      handleCancel();
      fetchAllocations();
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          "Có lỗi xảy ra khi lưu phân bổ phòng!"
      );
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phân bổ này?")) {
      setLoading(true);
      setError(null);
      try {
        await roomAllocationService.delete(id);
        alert("Xóa phân bổ thành công!");
        fetchAllocations();
      } catch (err) {
        setError(
          err?.response?.data?.error?.message ||
            "Có lỗi xảy ra khi xóa phân bổ phòng!"
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-700">
        Quản Lý Phân Bổ Phòng
      </h1>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setError(null)}
          >
            ×
          </span>
        </div>
      )}

      {/* Filter */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Lọc Phân Bổ
        </h2>
        <input
          type="text"
          placeholder="Lọc theo tên sinh viên, MSSV, giường, phòng..."
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editing ? "Cập Nhật Phân Bổ" : "Thêm Phân Bổ Mới"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                ID Sinh Viên
              </label>
              <input
                type="number"
                name="id_sv"
                value={form.id_sv}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                ID Giường
              </label>
              <input
                type="number"
                name="id_giuong"
                value={form.id_giuong}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Ngày Bắt Đầu
              </label>
              <input
                type="date"
                name="ngay_bat_dau"
                value={form.ngay_bat_dau}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                name="ngay_ket_thuc"
                value={form.ngay_ket_thuc || ""}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Trạng Thái
              </label>
              <select
                name="trang_thai"
                value={form.trang_thai}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="active">Đang ở</option>
                <option value="expired">Hết hạn</option>
                <option value="temporarily_away">Tạm vắng</option>
                <option value="suspended">Tạm dừng</option>
                <option value="terminated">Kết thúc</option>
                <option value="pending_checkout">Chờ trả phòng</option>
                <option value="transferred">Chuyển phòng</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Lý Do Kết Thúc
              </label>
              <input
                type="text"
                name="ly_do_ket_thuc"
                value={form.ly_do_ket_thuc}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                {loading
                  ? "Đang lưu..."
                  : editing
                  ? "Cập Nhật"
                  : "Thêm Mới"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Danh Sách Phân Bổ Phòng
          </h2>
          <button
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
          >
            Thêm Phân Bổ
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : filteredAllocations.length === 0 ? (
          <p className="text-center text-gray-500">
            Không tìm thấy phân bổ nào.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MSSV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Sinh Viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giường
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tầng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Bắt Đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Kết Thúc
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
                {filteredAllocations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.Student?.mssv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.Student?.ten}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.Bed?.ten_giuong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.Bed?.Room?.ten_phong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.Bed?.Room?.so_tang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.ngay_bat_dau
                        ? new Date(item.ngay_bat_dau).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.ngay_ket_thuc
                        ? new Date(item.ngay_ket_thuc).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.trang_thai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-300"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

export default RoomAllocation;