import React, { useState, useEffect } from 'react';
import { roomTypeService } from '../../services/room/room.service';

const initialRoomTypeState = {
  id: '', ten_loai: '', so_giuong: '', gia_thue: '', dien_tich: '', mo_ta: '', dang_hien: true,
  ngay_tao: '', ngay_cap_nhat: '', nguoi_tao: '', nguoi_cap_nhat: ''
};

const RoomTypeManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [currentRoomType, setCurrentRoomType] = useState(initialRoomTypeState);
  const [loading, setLoading] = useState(false);

  // Load data từ API
  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await roomTypeService.getAll();
      const data = res.data.roomTypes || res.data;
      setRoomTypes(data);
      setFilteredRoomTypes(data);
    } catch {
      setRoomTypes([]);
      setFilteredRoomTypes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = roomTypes;
    if (searchTermName) {
      results = results.filter(type =>
        type.ten_loai.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    setFilteredRoomTypes(results);
  }, [searchTermName, roomTypes]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoomType(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRoomType = () => {
    setIsAdding(true);
    setEditingRoomType(null);
    setCurrentRoomType({
      ...initialRoomTypeState,
      dang_hien: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRoomType) {
        await roomTypeService.update(currentRoomType.id, currentRoomType);
      } else {
        await roomTypeService.create(currentRoomType);
      }
      await fetchRoomTypes();
      setIsAdding(false);
      setEditingRoomType(null);
      setCurrentRoomType(initialRoomTypeState);
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu loại phòng!');
    }
    setLoading(false);
  };

  const handleEdit = (roomType) => {
    setEditingRoomType(roomType);
    setCurrentRoomType(roomType);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      setLoading(true);
      try {
        await roomTypeService.delete(id);
        await fetchRoomTypes();
        if (editingRoomType && editingRoomType.id === id) {
          setEditingRoomType(null);
          setIsAdding(false);
          setCurrentRoomType(initialRoomTypeState);
        }
      } catch {
        alert('Xóa thất bại!');
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingRoomType(null);
    setCurrentRoomType(initialRoomTypeState);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Quản Lý Loại Phòng</h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lọc Loại Phòng</h2>
        <input
          type="text"
          placeholder="Lọc theo Tên Loại Phòng"
          className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchTermName}
          onChange={(e) => setSearchTermName(e.target.value)}
        />
      </div>

      {/* --- Add/Update Form --- */}
      {(isAdding || editingRoomType) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingRoomType ? 'Cập Nhật Loại Phòng' : 'Thêm Loại Phòng Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="ten_loai" className="text-sm font-medium text-gray-700 capitalize mb-1">Tên Loại Phòng</label>
              <input
                type="text"
                id="ten_loai"
                name="ten_loai"
                value={currentRoomType.ten_loai}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="so_giuong" className="text-sm font-medium text-gray-700 capitalize mb-1">Số Giường</label>
              <input
                type="number"
                id="so_giuong"
                name="so_giuong"
                value={currentRoomType.so_giuong}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gia_thue" className="text-sm font-medium text-gray-700 capitalize mb-1">Giá (VNĐ)</label>
              <input
                type="number"
                id="gia_thue"
                name="gia_thue"
                value={currentRoomType.gia_thue}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="dien_tich" className="text-sm font-medium text-gray-700 capitalize mb-1">Dien tich(m2)</label>
              <input
                type="number"
                id="dien_tich"
                name="dien_tich"
                value={currentRoomType.dien_tich}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col col-span-full">
              <label htmlFor="mo_ta" className="text-sm font-medium text-gray-700 capitalize mb-1">Mô Tả</label>
              <textarea
                id="mo_ta"
                name="mo_ta"
                value={currentRoomType.mo_ta}
                onChange={handleInputChange}
                rows="3"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>
            <div className="flex items-center col-span-full">
              <input
                type="checkbox"
                id="dang_hien"
                name="dang_hien"
                checked={currentRoomType.dang_hien}
                onChange={handleInputChange}
                className="h-5 w-5 text-purple-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="dang_hien" className="ml-2 text-sm font-medium text-gray-700">Đang hiển thị</label>
            </div>

            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                {editingRoomType ? 'Cập Nhật' : 'Thêm Mới'}
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

      {/* --- Room Type List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Danh Sách Loại Phòng</h2>
          <button
            onClick={handleAddRoomType}
            className="bg-black hover:bg-green-600 hover:scale-105 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition transform duration-100"
          >
            Thêm Loại Phòng
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : filteredRoomTypes.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy loại phòng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Loại Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Giường</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diện Tích</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hiển Thị</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoomTypes.map((roomType) => (
                  <tr key={roomType.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.ten_loai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.so_giuong}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(roomType.gia_thue).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.dien_tich}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{roomType.mo_ta}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {roomType.dang_hien ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Có
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Không
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(roomType)}
                        className="w-[100px] h-[50px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-orange-500 mr-3 rounded-[50px] "
                        disabled={loading}
                      >
                        Cập Nhật
                      </button>
                      <button
                        onClick={() => handleDelete(roomType.id)}
                        className="w-[100px] h-[50px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-red-500 mr-3 rounded-[50px]"
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

export default RoomTypeManager;