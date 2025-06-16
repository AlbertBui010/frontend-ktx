import React, { useState, useEffect } from "react";
import { roomService } from "../../services/room/room.service";

const initialBedState = {
  id: "",
  ten_giuong: "",
  trang_thai: "available",
  id_sinh_vien: null,
};

const BedManager = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [beds, setBeds] = useState([]);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [searchTermName, setSearchTermName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [currentBed, setCurrentBed] = useState(initialBedState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load danh sách phòng
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await roomService.getAll({ limit: 100 });
        const data = res.data?.rooms || res.data?.data?.rooms || [];
        setRooms(data);
      } catch {
        setRooms([]);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  // Load danh sách giường theo phòng
  useEffect(() => {
    if (!selectedRoomId) {
      setBeds([]);
      setFilteredBeds([]);
      return;
    }
    const fetchBeds = async () => {
      setLoading(true);
      try {
        const res = await roomService.getBeds(selectedRoomId);
        const data = res.data?.beds || res.data || [];
        setBeds(data);
        setFilteredBeds(data);
      } catch {
        setBeds([]);
        setFilteredBeds([]);
      }
      setLoading(false);
    };
    fetchBeds();
  }, [selectedRoomId]);

  // Lọc theo tên giường
  useEffect(() => {
    let results = beds;
    if (searchTermName) {
      results = results.filter((bed) =>
        (bed.ten_giuong || "")
          .toLowerCase()
          .includes(searchTermName.toLowerCase())
      );
    }
    setFilteredBeds(results);
  }, [searchTermName, beds]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBed((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddBed = () => {
    setIsAdding(true);
    setEditingBed(null);
    setCurrentBed({
      ...initialBedState,
      trang_thai: "available",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" }); // Clear previous messages

    try {
      if (editingBed) {
        await roomService.updateBed(selectedRoomId, currentBed.id, {
          ten_giuong: currentBed.ten_giuong,
          trang_thai: currentBed.trang_thai,
        });
        setMessage({ type: "success", text: "Cập nhật giường thành công!" });
      } else {
        // This is the part that fails when adding too many beds
        await roomService.createBed(selectedRoomId, {
          ten_giuong: currentBed.ten_giuong,
          trang_thai: currentBed.trang_thai,
        });
        setMessage({ type: "success", text: "Thêm giường thành công!" });
      }

      // If successful, reload beds and reset form
      const res = await roomService.getBeds(selectedRoomId);
      const data = res.data?.beds || res.data || [];
      setBeds(data);
      setFilteredBeds(data);
      setIsAdding(false);
      setEditingBed(null);
      setCurrentBed(initialBedState);

    } catch (err) {
      console.error("Error saving bed:", err); // Log the full error for debugging

      let errorMessage = "Có lỗi xảy ra khi lưu giường! Vui lòng thử lại.";

      // Attempt to extract the most specific error message from the backend response
      if (err.response) {
        // Axios error with a response from the server
        const errorData = err.response.data;

        // Prioritize error.message if nested (like your previous example: error: { message: "..." })
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
        // Fallback to data.message if it's directly at the root of the response data
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Fallback to error details if available and more specific
        else if (errorData.error && errorData.error.details) {
          errorMessage = errorData.error.details;
        }
        // Handle specific status codes if needed (e.g., for capacity exceeded)
        else if (err.response.status === 400) { // Bad Request, often for validation errors
          errorMessage = "Dữ liệu không hợp lệ hoặc số lượng giường đã đạt giới hạn.";
        }
        // You can add more specific checks here based on your backend error structure
      } else if (err.request) {
        // Axios error but no response from server (e.g., network error)
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
      } else {
        // Other generic errors (e.g., client-side code issue)
        errorMessage = err.message || "Lỗi không xác định!";
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
    setLoading(false);
  };

  const handleEdit = (bed) => {
    setEditingBed(bed);
    setCurrentBed({
      id: bed.id,
      ten_giuong: bed.ten_giuong,
      trang_thai: bed.trang_thai,
      id_sinh_vien: bed.id_sinh_vien,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giường này?")) {
      setLoading(true);
      try {
        await roomService.deleteBed(selectedRoomId, id);
        // Reload beds
        const res = await roomService.getBeds(selectedRoomId);
        const data = res.data?.beds || res.data || [];
        setBeds(data);
        setFilteredBeds(data);
        if (editingBed && editingBed.id === id) {
          setEditingBed(null);
          setIsAdding(false);
          setCurrentBed(initialBedState);
        }
        setMessage({ type: "success", text: "Xóa giường thành công!" });
      } catch (err) {
        setMessage({
          type: "error",
          text:
            err?.response?.data?.message ||
            err?.message ||
            "Xóa thất bại!",
        });
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingBed(null);
    setCurrentBed(initialBedState);
  };

  // Helper lấy tên phòng
  const getRoomName = (id) => {
    const room = rooms.find((r) => String(r.id) === String(id));
    return room ? room.ten_phong : "N/A";
  };

  return (
    <div className="container mx-auto p-4">
      {/* Hiển thị thông báo */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {message.text}
          <button
            className="float-right font-bold"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            ×
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6 text-cyan-700">
        Quản Lý Giường
      </h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chọn Phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
          >
            <option value="">-- Chọn phòng --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.ten_phong}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Lọc theo Tên Giường"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchTermName}
            onChange={(e) => setSearchTermName(e.target.value)}
            disabled={!selectedRoomId}
          />
        </div>
      </div>

      {/* --- Add/Update Form --- */}
      {(isAdding || editingBed) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingBed ? "Cập Nhật Thông Tin Giường" : "Thêm Giường Mới"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <label
                htmlFor="ten_giuong"
                className="text-sm font-medium text-gray-700 capitalize mb-1"
              >
                Tên Giường
              </label>
              <input
                type="text"
                id="ten_giuong"
                name="ten_giuong"
                value={currentBed.ten_giuong}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="trang_thai"
                className="text-sm font-medium text-gray-700 capitalize mb-1"
              >
                Trạng Thái
              </label>
              <select
                id="trang_thai"
                name="trang_thai"
                value={currentBed.trang_thai}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="available">Còn trống</option>
                <option value="occupied">Đã sử dụng</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                {editingBed ? "Cập Nhật" : "Thêm Mới"}
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

      {/* --- Bed List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Danh Sách Giường {selectedRoomId && `- ${getRoomName(selectedRoomId)}`}
          </h2>
          <button
            onClick={handleAddBed}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
            disabled={!selectedRoomId}
          >
            Thêm Giường
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : filteredBeds.length === 0 ? (
          <p className="text-center text-gray-500">
            {selectedRoomId
              ? "Không tìm thấy giường nào."
              : "Vui lòng chọn phòng để xem danh sách giường."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Giường
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Giường
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
                {filteredBeds.map((bed) => (
                  <tr key={bed.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bed.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bed.ten_giuong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bed.trang_thai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(bed)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-300"
                        disabled={loading}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(bed.id)}
                        className="text-red-600 hover:text-red-900 transition duration-300"
                        disabled={loading}
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

export default BedManager;