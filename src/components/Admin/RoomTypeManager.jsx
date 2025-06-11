import React, { useState, useEffect } from 'react';

const RoomTypeManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);

  const initialRoomTypeState = {
    id: '', ten: '', gia: '', mo_ta: '', dang_hien: true,
    ngay_tao: '', ngay_cap_nhat: '', nguoi_tao: '', nguoi_cap_nhat: ''
  };
  const [currentRoomType, setCurrentRoomType] = useState(initialRoomTypeState);

  // Load initial data
  useEffect(() => {
    const mockRoomTypes = [
      { id: 'LP001', ten: 'Phòng Tiêu Chuẩn', gia: 1500000, mo_ta: 'Phòng 4 người, có điều hòa', dang_hien: true, ngay_tao: '2024-01-01', ngay_cap_nhat: '2024-01-01', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'LP002', ten: 'Phòng Cao Cấp', gia: 2500000, mo_ta: 'Phòng 2 người, có điều hòa, tủ lạnh', dang_hien: true, ngay_tao: '2024-01-05', ngay_cap_nhat: '2024-01-05', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'LP003', ten: 'Phòng Đặc Biệt', gia: 3000000, mo_ta: 'Phòng VIP 1 người, full tiện nghi', dang_hien: false, ngay_tao: '2024-01-10', ngay_cap_nhat: '2024-01-10', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
    ];
    setRoomTypes(mockRoomTypes);
    setFilteredRoomTypes(mockRoomTypes);
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = roomTypes;
    if (searchTermName) {
      results = results.filter(type =>
        type.ten.toLowerCase().includes(searchTermName.toLowerCase())
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
      id: `LP${Date.now().toString().slice(-5)}`, // Simple ID generation
      ngay_tao: new Date().toISOString().slice(0, 10),
      nguoi_tao: 'current_user', // Replace with actual user
      dang_hien: true // Default to true for new entries
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRoomType) {
      setRoomTypes(roomTypes.map(rt => (rt.id === currentRoomType.id ? {
        ...currentRoomType,
        ngay_cap_nhat: new Date().toISOString().slice(0, 10),
        nguoi_cap_nhat: 'current_user' // Replace with actual user
      } : rt)));
      setEditingRoomType(null);
    } else {
      setRoomTypes([...roomTypes, currentRoomType]);
    }
    setCurrentRoomType(initialRoomTypeState);
    setIsAdding(false);
  };

  const handleEdit = (roomType) => {
    setEditingRoomType(roomType);
    setCurrentRoomType(roomType);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      setRoomTypes(roomTypes.filter(roomType => roomType.id !== id));
      if (editingRoomType && editingRoomType.id === id) {
        setEditingRoomType(null);
        setIsAdding(false);
        setCurrentRoomType(initialRoomTypeState);
      }
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
              <label htmlFor="ten" className="text-sm font-medium text-gray-700 capitalize mb-1">Tên Loại Phòng</label>
              <input
                type="text"
                id="ten"
                name="ten"
                value={currentRoomType.ten}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gia" className="text-sm font-medium text-gray-700 capitalize mb-1">Giá (VNĐ)</label>
              <input
                type="number"
                id="gia"
                name="gia"
                value={currentRoomType.gia}
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
              >
                {editingRoomType ? 'Cập Nhật' : 'Thêm Mới'}
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

        {filteredRoomTypes.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy loại phòng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Loại Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hiển Thị</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoomTypes.map((roomType) => (
                  <tr key={roomType.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roomType.gia.toLocaleString('vi-VN')} VNĐ</td>
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
                      >
                        Cập Nhật
                      </button>
                      <button
                        onClick={() => handleDelete(roomType.id)}
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

export default RoomTypeManager;