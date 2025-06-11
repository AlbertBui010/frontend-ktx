import React, { useState, useEffect } from 'react';

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRole, setSearchTermRole] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const initialStaffState = {
    id: '', ma_nv: '', ten: '', mat_khau: '', role: '', sdt: '', email: '',
    cmnd: '', phai: '', phong_ban: '', ngay_vao_lam: '', trang_thai: '',
    dang_hien: true, ngay_tao: '', ngay_cap_nhat: '', nguoi_tao: '', nguoi_cap_nhat: ''
  };
  const [currentStaff, setCurrentStaff] = useState(initialStaffState);

  // Load initial data
  useEffect(() => {
    const mockStaff = [
      { id: '1', ma_nv: 'NV001', ten: 'Nguyễn Thị Hương', mat_khau: 'hashedpass1', role: 'Quản Lý', sdt: '0912345678', email: 'huong@example.com', cmnd: '123456789012', phai: 'Nữ', phong_ban: 'Quản lý', ngay_vao_lam: '2020-01-01', trang_thai: 'Đang làm', dang_hien: true, ngay_tao: '2020-01-01', ngay_cap_nhat: '2023-01-01', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: '2', ma_nv: 'NV002', ten: 'Trần Văn Long', mat_khau: 'hashedpass2', role: 'Nhân Viên', sdt: '0987654321', email: 'long@example.com', cmnd: '234567890123', phai: 'Nam', phong_ban: 'Bảo trì', ngay_vao_lam: '2021-03-15', trang_thai: 'Đang làm', dang_hien: true, ngay_tao: '2021-03-15', ngay_cap_nhat: '2023-01-01', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
      { id: '3', ma_nv: 'NV003', ten: 'Phạm Thanh Thảo', mat_khau: 'hashedpass3', role: 'Kế Toán', sdt: '0909112233', email: 'thao@example.com', cmnd: '345678901234', phai: 'Nữ', phong_ban: 'Kế toán', ngay_vao_lam: '2022-06-20', trang_thai: 'Đang làm', dang_hien: true, ngay_tao: '2022-06-20', ngay_cap_nhat: '2023-01-01', nguoi_tao: 'admin', nguoi_cap_nhat: 'admin' },
    ];
    setStaff(mockStaff);
    setFilteredStaff(mockStaff);
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = staff;

    if (searchTermName) {
      results = results.filter(member =>
        member.ten.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermRole) {
      results = results.filter(member =>
        member.role.toLowerCase().includes(searchTermRole.toLowerCase())
      );
    }
    setFilteredStaff(results);
  }, [searchTermName, searchTermRole, staff]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentStaff(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddStaff = () => {
    setIsAdding(true);
    setEditingStaff(null);
    setCurrentStaff({
      ...initialStaffState,
      id: Date.now().toString(), // Simple ID generation
      ma_nv: `NV${Date.now().toString().slice(-4)}`, // Simple Staff ID generation
      ngay_tao: new Date().toISOString().slice(0, 10),
      nguoi_tao: 'current_admin', // Replace with actual user
      dang_hien: true,
      trang_thai: 'Đang làm'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      setStaff(staff.map(s => (s.id === currentStaff.id ? {
        ...currentStaff,
        ngay_cap_nhat: new Date().toISOString().slice(0, 10),
        nguoi_cap_nhat: 'current_admin' // Replace with actual user
      } : s)));
      setEditingStaff(null);
    } else {
      setStaff([...staff, currentStaff]);
    }
    setCurrentStaff(initialStaffState);
    setIsAdding(false);
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setCurrentStaff(member);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setStaff(staff.filter(member => member.id !== id));
      if (editingStaff && editingStaff.id === id) {
        setEditingStaff(null);
        setIsAdding(false);
        setCurrentStaff(initialStaffState);
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
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-700">Quản Lý Nhân Viên</h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lọc Nhân Viên</h2>
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
            {editingStaff ? 'Cập Nhật Thông Tin Nhân Viên' : 'Thêm Nhân Viên Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="ten" className="text-sm font-medium text-gray-700 capitalize mb-1">Tên Nhân Viên</label>
              <input
                type="text"
                id="ten"
                name="ten"
                value={currentStaff.ten}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="ma_nv" className="text-sm font-medium text-gray-700 capitalize mb-1">Mã NV</label>
              <input
                type="text"
                id="ma_nv"
                name="ma_nv"
                value={currentStaff.ma_nv}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                disabled={!!editingStaff} // Disable if editing
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 capitalize mb-1">Chức Vụ (Role)</label>
              <select
                id="role"
                name="role"
                value={currentStaff.role}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Chọn chức vụ</option>
                <option value="Quản Lý">Quản Lý</option>
                <option value="Nhân Viên">Nhân Viên</option>
                <option value="Bảo Vệ">Bảo Vệ</option>
                <option value="Kế Toán">Kế Toán</option>
                <option value="Lao Công">Lao Công</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="sdt" className="text-sm font-medium text-gray-700 capitalize mb-1">Số Điện Thoại</label>
              <input
                type="tel"
                id="sdt"
                name="sdt"
                value={currentStaff.sdt}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 capitalize mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={currentStaff.email}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="cmnd" className="text-sm font-medium text-gray-700 capitalize mb-1">CMND/CCCD</label>
              <input
                type="text"
                id="cmnd"
                name="cmnd"
                value={currentStaff.cmnd}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phai" className="text-sm font-medium text-gray-700 capitalize mb-1">Giới tính</label>
              <select
                id="phai"
                name="phai"
                value={currentStaff.phai}
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
            <div className="flex flex-col">
              <label htmlFor="phong_ban" className="text-sm font-medium text-gray-700 capitalize mb-1">Phòng Ban</label>
              <input
                type="text"
                id="phong_ban"
                name="phong_ban"
                value={currentStaff.phong_ban}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="ngay_vao_lam" className="text-sm font-medium text-gray-700 capitalize mb-1">Ngày Vào Làm</label>
              <input
                type="date"
                id="ngay_vao_lam"
                name="ngay_vao_lam"
                value={currentStaff.ngay_vao_lam}
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
                value={currentStaff.trang_thai}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Chọn trạng thái</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Nghỉ việc">Nghỉ việc</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </select>
            </div>
            {/* Password field only for adding, not for editing directly without a proper password change flow */}
            {!editingStaff && (
              <div className="flex flex-col">
                <label htmlFor="mat_khau" className="text-sm font-medium text-gray-700 capitalize mb-1">Mật Khẩu</label>
                <input
                  type="password"
                  id="mat_khau"
                  name="mat_khau"
                  value={currentStaff.mat_khau}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required={!editingStaff} // Required only when adding
                />
              </div>
            )}
            <div className="flex items-center col-span-full">
              <input
                type="checkbox"
                id="dang_hien"
                name="dang_hien"
                checked={currentStaff.dang_hien}
                onChange={handleInputChange}
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="dang_hien" className="ml-2 text-sm font-medium text-gray-700">Đang hiển thị</label>
            </div>

            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
              >
                {editingStaff ? 'Cập Nhật' : 'Thêm Mới'}
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
          <h2 className="text-2xl font-semibold text-gray-800">Danh Sách Nhân Viên</h2>
          <button
            onClick={handleAddStaff}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
          >
            Thêm Nhân Viên
          </button>
        </div>

        {filteredStaff.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy nhân viên nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã NV</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên NV</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức Vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng Ban</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.ma_nv}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.phong_ban}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.sdt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.trang_thai === 'Đang làm' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
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