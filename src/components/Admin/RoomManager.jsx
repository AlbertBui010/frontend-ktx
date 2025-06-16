import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/room/room.service';
import { roomTypeService } from '../../services/room/room.service';

const initialRoomState = {
  id: '',
  ten_phong: '',
  id_loai_phong: '',
  so_tang: '',
  trang_thai: '',
  mo_ta: '',
  dang_hien: true,
};

const RoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRoomType, setSearchTermRoomType] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(initialRoomState);
  const [loading, setLoading] = useState(false);

  // Load room types
  useEffect(() => {
    roomTypeService.getAll().then(res => {
      const data = res.data?.roomTypes || res.data || [];
      setRoomTypes(data);
    });
  }, []);

  // Load rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomService.getAll();
      const data = res.data?.rooms || res.data || [];
      setRooms(data);
      setFilteredRooms(data);
    } catch {
      setRooms([]);
      setFilteredRooms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filtering
  useEffect(() => {
    let results = rooms;
    if (searchTermName) {
      results = results.filter(room =>
        room.ten_phong?.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermRoomType) {
      results = results.filter(room =>
        String(room.id_loai_phong) === searchTermRoomType
      );
    }
    setFilteredRooms(results);
  }, [searchTermName, searchTermRoomType, rooms]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoom(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRoom = () => {
    setIsAdding(true);
    setEditingRoom(null);
    setCurrentRoom({
      ...initialRoomState,
      dang_hien: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRoom) {
        await roomService.update(currentRoom.id, currentRoom);
      } else {
        await roomService.create(currentRoom);
      }
      await fetchRooms();
      setIsAdding(false);
      setEditingRoom(null);
      setCurrentRoom(initialRoomState);
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu phòng!');
    }
    setLoading(false);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setCurrentRoom(room);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      setLoading(true);
      try {
        await roomService.delete(id);
        await fetchRooms();
        if (editingRoom && editingRoom.id === id) {
          setEditingRoom(null);
          setIsAdding(false);
          setCurrentRoom(initialRoomState);
        }
      } catch {
        alert('Xóa thất bại!');
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingRoom(null);
    setCurrentRoom(initialRoomState);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Quản Lý Phòng</h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lọc Phòng</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Lọc theo Tên Phòng"
            className="p-3 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermName}
            onChange={(e) => setSearchTermName(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermRoomType}
            onChange={(e) => setSearchTermRoomType(e.target.value)}
          >
            <option value="">Tất cả loại phòng</option>
            {roomTypes.map(rt => (
              <option key={rt.id} value={rt.id}>{rt.ten_loai}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Add/Update Form --- */}
      {(isAdding || editingRoom) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingRoom ? 'Cập Nhật Phòng' : 'Thêm Phòng Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="ten_phong" className="text-sm font-medium text-gray-700 capitalize mb-1">Tên Phòng</label>
              <input
                type="text"
                id="ten_phong"
                name="ten_phong"
                value={currentRoom.ten_phong}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="id_loai_phong" className="text-sm font-medium text-gray-700 capitalize mb-1">Loại Phòng</label>
              <select
                id="id_loai_phong"
                name="id_loai_phong"
                value={currentRoom.id_loai_phong}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Chọn loại phòng</option>
                {roomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.ten_loai}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="so_tang" className="text-sm font-medium text-gray-700 capitalize mb-1">Số Tầng</label>
              <input
                type="number"
                id="so_tang"
                name="so_tang"
                value={currentRoom.so_tang}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="trang_thai" className="text-sm font-medium text-gray-700 capitalize mb-1">Trạng Thái</label>
              <select
                id="trang_thai"
                name="trang_thai"
                value={currentRoom.trang_thai}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="available">Còn trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Bảo trì</option>
                <option value="reserved">Đã đặt</option>
              </select>
            </div>
            <div className="flex flex-col col-span-full">
              <label htmlFor="mo_ta" className="text-sm font-medium text-gray-700 capitalize mb-1">Mô Tả</label>
              <textarea
                id="mo_ta"
                name="mo_ta"
                value={currentRoom.mo_ta}
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
                checked={currentRoom.dang_hien}
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
                {editingRoom ? 'Cập Nhật' : 'Thêm Mới'}
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

      {/* --- Room List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Danh Sách Phòng</h2>
          <button
            onClick={handleAddRoom}
            className="bg-black hover:bg-green-600 hover:scale-105 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition transform duration-100"
          >
            Thêm Phòng
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : filteredRooms.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy phòng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tầng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiển Thị</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.ten_phong}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.RoomType?.ten_loai || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.so_tang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.trang_thai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.RoomType ? Number(room.RoomType.gia_thue).toLocaleString('vi-VN') + ' VNĐ' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {room.dang_hien ? (
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
                        onClick={() => handleEdit(room)}
                        className="w-[100px] h-[50px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-orange-500 mr-3 rounded-[50px] "
                        disabled={loading}
                      >
                        Cập Nhật
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
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

export default RoomManager;