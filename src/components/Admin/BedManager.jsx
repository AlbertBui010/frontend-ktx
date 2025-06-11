import React, { useState, useEffect } from 'react';

const BedManager = () => {
  const [beds, setBeds] = useState([]);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRoom, setSearchTermRoom] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingBed, setEditingBed] = useState(null);

  // Mock Room data for dropdown (in a real app, fetch this from API)
  const mockRooms = [
    { id: 'P001', ten: 'Phòng A101' },
    { id: 'P002', ten: 'Phòng B203' },
    { id: 'P003', ten: 'Phòng A102' },
  ];

  const initialBedState = {
    id: '', id_phong: '', ten: '', dang_hien: true,
    ngay_tao: '', ngay_cap_nhat: '', nguoi_tao: '', nguoi_cap_nhat: ''
  };
  const [currentBed, setCurrentBed] = useState(initialBedState);

  // Load initial data
  useEffect(() => {
    const mockBeds = [
      { id: 'G001', id_phong: 'P001', ten: 'Giường 1A', dang_hien: true, ngay_tao: '2024-03-01', ngay_cap_nhat: '2024-03-01', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'G002', id_phong: 'P001', ten: 'Giường 1B', dang_hien: true, ngay_tao: '2024-03-01', ngay_cap_nhat: '2024-03-01', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'G003', id_phong: 'P002', ten: 'Giường 2A', dang_hien: false, ngay_tao: '2024-03-05', ngay_cap_nhat: '2024-03-05', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: 'G004', id_phong: 'P003', ten: 'Giường 3A', dang_hien: true, ngay_tao: '2024-03-10', ngay_cap_nhat: '2024-03-10', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
    ];
    setBeds(mockBeds);
    setFilteredBeds(mockBeds);
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = beds;

    if (searchTermName) {
      results = results.filter(bed =>
        bed.ten.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermRoom) {
      results = results.filter(bed =>
        bed.id_phong === searchTermRoom
      );
    }
    setFilteredBeds(results);
  }, [searchTermName, searchTermRoom, beds]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBed(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddBed = () => {
    setIsAdding(true);
    setEditingBed(null);
    setCurrentBed({
      ...initialBedState,
      id: `G${Date.now().toString().slice(-5)}`, // Simple ID generation
      ngay_tao: new Date().toISOString().slice(0, 10),
      nguoi_tao: 'current_user',
      dang_hien: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBed) {
      setBeds(beds.map(b => (b.id === currentBed.id ? {
        ...currentBed,
        ngay_cap_nhat: new Date().toISOString().slice(0, 10),
        nguoi_cap_nhat: 'current_user'
      } : b)));
      setEditingBed(null);
    } else {
      setBeds([...beds, currentBed]);
    }
    setCurrentBed(initialBedState);
    setIsAdding(false);
  };

  const handleEdit = (bed) => {
    setEditingBed(bed);
    setCurrentBed(bed);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giường này?')) {
      setBeds(beds.filter(bed => bed.id !== id));
      if (editingBed && editingBed.id === id) {
        setEditingBed(null);
        setIsAdding(false);
        setCurrentBed(initialBedState);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingBed(null);
    setCurrentBed(initialBedState);
  };

  // Helper to get room name
  const getRoomName = (id_phong) => {
    const room = mockRooms.find(r => r.id === id_phong);
    return room ? room.ten : 'N/A';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-cyan-700">Quản Lý Giường</h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lọc Giường</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Lọc theo Tên Giường"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchTermName}
            onChange={(e) => setSearchTermName(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={searchTermRoom}
            onChange={(e) => setSearchTermRoom(e.target.value)}
          >
            <option value="">Lọc theo Phòng</option>
            {mockRooms.map(room => (
              <option key={room.id} value={room.id}>{room.ten}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Add/Update Form --- */}
      {(isAdding || editingBed) && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingBed ? 'Cập Nhật Thông Tin Giường' : 'Thêm Giường Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="ten" className="text-sm font-medium text-gray-700 capitalize mb-1">Tên Giường</label>
              <input
                type="text"
                id="ten"
                name="ten"
                value={currentBed.ten}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="id_phong" className="text-sm font-medium text-gray-700 capitalize mb-1">Phòng</label>
              <select
                id="id_phong"
                name="id_phong"
                value={currentBed.id_phong}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="">Chọn phòng</option>
                {mockRooms.map(room => (
                  <option key={room.id} value={room.id}>{room.ten}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center col-span-full">
              <input
                type="checkbox"
                id="dang_hien"
                name="dang_hien"
                checked={currentBed.dang_hien}
                onChange={handleInputChange}
                className="h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label htmlFor="dang_hien" className="ml-2 text-sm font-medium text-gray-700">Đang hiển thị (khả dụng)</label>
            </div>

            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
              >
                {editingBed ? 'Cập Nhật' : 'Thêm Mới'}
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

      {/* --- Bed List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Danh Sách Giường</h2>
          <button
            onClick={handleAddBed}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
          >
            Thêm Giường
          </button>
        </div>

        {filteredBeds.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy giường nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Giường</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Giường</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Khả Dụng</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBeds.map((bed) => (
                  <tr key={bed.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bed.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bed.ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getRoomName(bed.id_phong)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {bed.dang_hien ? (
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
                        onClick={() => handleEdit(bed)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-300"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(bed.id)}
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

export default BedManager;