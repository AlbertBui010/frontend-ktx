import React, { useState, useEffect } from 'react';

const RoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRoomType, setSearchTermRoomType] = useState('');
  const [searchTermStatus, setSearchTermStatus] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Mock Room Types for dropdown (in a real app, fetch this from API)
  const mockRoomTypes = [
    { id: 'LP001', ten: 'Phòng Tiêu Chuẩn' },
    { id: 'LP002', ten: 'Phòng Cao Cấp' },
    { id: 'LP003', ten: 'Phòng Đặc Biệt' },
  ];

  const initialRoomState = {
    id: '', id_ktx: '', id_loai_phong: '', ten: '', sl_max: '', sl_hien_tai: '',
    trang_thai: '', mo_ta: '', dang_hien: true, ngay_tao: '', ngay_cap_nhat: '',
    nguoi_tao: '', nguoi_cap_nhat: ''
  };
  const [currentRoom, setCurrentRoom] = useState(initialRoomState);

  // Load initial data
  useEffect(() => {
    const mockRooms = [
      { id: 'P001', id_ktx: 'KTXA', id_loai_phong: 'LP001', ten: 'Phòng A101', sl_max: 4, sl_hien_tai: 2, trang_thai: 'Hoạt động', mo_ta: 'Tầng 1, hướng ra vườn', dang_hien: true, ngay_tao: '2024-01-15', ngay_cap_nhat: '2024-01-15', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'P002', id_ktx: 'KTXB', id_loai_phong: 'LP002', ten: 'Phòng B203', sl_max: 2, sl_hien_tai: 2, trang_thai: 'Đầy', mo_ta: 'Tầng 2, view đẹp', dang_hien: true, ngay_tao: '2024-01-20', ngay_cap_nhat: '2024-01-20', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'P003', id_ktx: 'KTXA', id_loai_phong: 'LP001', ten: 'Phòng A102', sl_max: 4, sl_hien_tai: 0, trang_thai: 'Trống', mo_ta: 'Phòng mới sơn lại', dang_hien: true, ngay_tao: '2024-02-01', ngay_cap_nhat: '2024-02-01', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'P004', id_ktx: 'KTXC', id_loai_phong: 'LP003', ten: 'Phòng C301', sl_max: 1, sl_hien_tai: 1, trang_thai: 'Đầy', mo_ta: 'Phòng đặc biệt, yên tĩnh', dang_hien: true, ngay_tao: '2024-02-10', ngay_cap_nhat: '2024-02-10', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
    ];
    setRooms(mockRooms);
    setFilteredRooms(mockRooms);
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = rooms;

    if (searchTermName) {
      results = results.filter(room =>
        room.ten.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermRoomType) {
      results = results.filter(room =>
        room.id_loai_phong === searchTermRoomType
      );
    }
    if (searchTermStatus) {
      results = results.filter(room =>
        room.trang_thai === searchTermStatus
      );
    }
    setFilteredRooms(results);
  }, [searchTermName, searchTermRoomType, searchTermStatus, rooms]);

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
      id: `P${Date.now().toString().slice(-5)}`, // Simple ID generation
      ngay_tao: new Date().toISOString().slice(0, 10),
      nguoi_tao: 'current_user',
      dang_hien: true,
      sl_hien_tai: 0 // Default current occupants to 0 for new rooms
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRoom) {
      setRooms(rooms.map(r => (r.id === currentRoom.id ? {
        ...currentRoom,
        ngay_cap_nhat: new Date().toISOString().slice(0, 10),
        nguoi_cap_nhat: 'current_user'
      } : r)));
      setEditingRoom(null);
    } else {
      setRooms([...rooms, currentRoom]);
    }
    setCurrentRoom(initialRoomState);
    setIsAdding(false);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setCurrentRoom(room);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      setRooms(rooms.filter(room => room.id !== id));
      if (editingRoom && editingRoom.id === id) {
        setEditingRoom(null);
        setIsAdding(false);
        setCurrentRoom(initialRoomState);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingRoom(null);
    setCurrentRoom(initialRoomState);
  };

  // Helper to get room type name
  const getRoomTypeName = (id_loai_phong) => {
    const type = mockRoomTypes.find(rt => rt.id === id_loai_phong);
    return type ? type.ten : 'N/A';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Quản Lý Phòng</h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lọc Phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Lọc theo Tên Phòng"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermName}
            onChange={(e) => setSearchTermName(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermRoomType}
            onChange={(e) => setSearchTermRoomType(e.target.value)}
          >
            <option value="">Lọc theo Loại Phòng</option>
            {mockRoomTypes.map(type => (
              <option key={type.id} value={type.id}>{type.ten}</option>
            ))}
          </select>
          <select
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermStatus}
            onChange={(e) => setSearchTermStatus(e.target.value)}
          >
            <option value="">Lọc theo Trạng Thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Đang sửa chữa">Đang sửa chữa</option>
            <option value="Đầy">Đầy</option>
            <option value="Trống">Trống</option>
          </select>
        </div>
      </div>

      {/* --- Add/Update Form --- */}
      {(isAdding || editingRoom) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingRoom ? 'Cập Nhật Phòng' : 'Thêm Phòng Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="ten" className="text-sm font-medium text-gray-700 capitalize mb-1">Tên Phòng</label>
              <input
                type="text"
                id="ten"
                name="ten"
                value={currentRoom.ten}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="id_ktx" className="text-sm font-medium text-gray-700 capitalize mb-1">ID KTX</label>
              <input
                type="text"
                id="id_ktx"
                name="id_ktx"
                value={currentRoom.id_ktx}
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
                {mockRoomTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.ten}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="sl_max" className="text-sm font-medium text-gray-700 capitalize mb-1">SL Tối Đa</label>
              <input
                type="number"
                id="sl_max"
                name="sl_max"
                value={currentRoom.sl_max}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="sl_hien_tai" className="text-sm font-medium text-gray-700 capitalize mb-1">SL Hiện Tại</label>
              <input
                type="number"
                id="sl_hien_tai"
                name="sl_hien_tai"
                value={currentRoom.sl_hien_tai}
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
                <option value="">Chọn trạng thái</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Đang sửa chữa">Đang sửa chữa</option>
                <option value="Đầy">Đầy</option>
                <option value="Trống">Trống</option>
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
                className="h-5 w-5 text-emerald-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="dang_hien" className="ml-2 text-sm font-medium text-gray-700">Đang hiển thị</label>
            </div>

            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
              >
                {editingRoom ? 'Cập Nhật' : 'Thêm Mới'}
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

        {filteredRooms.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy phòng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL Hiện Tại/Max</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getRoomTypeName(room.id_loai_phong)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.sl_hien_tai}/{room.sl_max}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        room.trang_thai === 'Hoạt động' ? 'bg-green-100 text-green-800' :
                        room.trang_thai === 'Đầy' ? 'bg-red-100 text-red-800' :
                        room.trang_thai === 'Trống' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {room.trang_thai}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(room)}
                        className="w-[100px] h-[50px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-orange-500 mr-3 rounded-[50px] "
                      >
                        Cập Nhật
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
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

export default RoomManager;