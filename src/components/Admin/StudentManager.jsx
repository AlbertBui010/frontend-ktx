import React, { useState, useEffect } from 'react';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermMSSV, setSearchTermMSSV] = useState('');
  const [searchTermPhone, setSearchTermPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // Holds the student being edited

  // Form state for adding/editing
  const initialStudentState = {
    id: '', mssv: '', ten: '', dia_chi: '', phai: '', ngay_sinh: '',
    noi_sinh: '', dan_toc: '', ton_giao: '', khoa: '', sdt: '', cmnd: '',
    ngay_cap_cmnd: '', noi_cap_cmnd: '', ho_khau: '', dia_chi_lien_he: '',
    dang_hien: '', ngay_tao: '', ngay_cap_nhat: '', nguoi_tao: '',
    nguoi_cap_nhat: '', mat_khau: '', trang_thai: ''
  };
  const [currentStudent, setCurrentStudent] = useState(initialStudentState);

  // Load initial student data (can be from an API or mock data)
  useEffect(() => {
    // Mock data for demonstration
    const mockStudents = [
      {
        id: '1', mssv: 'SV001', ten: 'Pham Quoc Thai', dia_chi: '123 Le Loi', phai: 'Nam', ngay_sinh: '2000-01-15',
        noi_sinh: 'TP.HCM', dan_toc: 'Kinh', ton_giao: 'Khong', khoa: 'CNTT', sdt: '0901234567', cmnd: '123456789',
        ngay_cap_cmnd: '2018-03-20', noi_cap_cmnd: 'TP.HCM', ho_khau: '123 Le Loi', dia_chi_lien_he: '123 Le Loi',
        dang_hien: 'true', ngay_tao: '2022-09-01', ngay_cap_nhat: '2023-01-01', nguoi_tao: 'admin',
        nguoi_cap_nhat: 'admin', mat_khau: 'hashedpass', trang_thai: 'Đã Đăng Ký'
      },
      {
        id: '2', mssv: 'SV002', ten: 'Bui Quang Quy', dia_chi: '456 Tran Hung Dao', phai: 'Nu', ngay_sinh: '2001-05-20',
        noi_sinh: 'Ha Noi', dan_toc: 'Kinh', ton_giao: 'Phat Giao', khoa: 'Kinh Te', sdt: '0917654321', cmnd: '987654321',
        ngay_cap_cmnd: '2019-07-10', noi_cap_cmnd: 'Ha Noi', ho_khau: '456 Tran Hung Dao', dia_chi_lien_he: '456 Tran Hung Dao',
        dang_hien: 'true', ngay_tao: '2022-09-01', ngay_cap_nhat: '2023-01-01', nguoi_tao: 'admin',
        nguoi_cap_nhat: 'admin', mat_khau: 'hashedpass', trang_thai: 'Đã Đăng Ký'
      },
      {
        id: '3', mssv: 'SV003', ten: 'Pham Bui Quy Thai', dia_chi: '789 Nguyen Thi Minh Khai', phai: 'Nam', ngay_sinh: '1999-11-01',
        noi_sinh: 'Da Nang', dan_toc: 'Tay', ton_giao: 'Thien Chua', khoa: 'Luat', sdt: '0987123456', cmnd: '112233445',
        ngay_cap_cmnd: '2017-01-05', noi_cap_cmnd: 'Da Nang', ho_khau: '789 Nguyen Thi Minh Khai', dia_chi_lien_he: '789 Nguyen Thi Minh Khai',
        dang_hien: 'true', ngay_tao: '2022-09-01', ngay_cap_nhat: '2023-01-01', nguoi_tao: 'admin',
        nguoi_cap_nhat: 'admin', mat_khau: 'hashedpass', trang_thai: 'Đã Đăng Ký'
      }
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = students;

    if (searchTermName) {
      results = results.filter(student =>
        student.ten.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermMSSV) {
      results = results.filter(student =>
        student.mssv.toLowerCase().includes(searchTermMSSV.toLowerCase())
      );
    }
    if (searchTermPhone) {
      results = results.filter(student =>
        student.sdt.includes(searchTermPhone)
      );
    }
    setFilteredStudents(results);
  }, [searchTermName, searchTermMSSV, searchTermPhone, students]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    setIsAdding(true);
    setEditingStudent(null);
    setCurrentStudent({ ...initialStudentState, id: Date.now().toString() }); // Generate a unique ID
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      // Update existing student
      setStudents(students.map(s => (s.id === currentStudent.id ? currentStudent : s)));
      setEditingStudent(null);
    } else {
      // Add new student
      setStudents([...students, currentStudent]);
    }
    setCurrentStudent(initialStudentState);
    setIsAdding(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setCurrentStudent(student);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      setStudents(students.filter(student => student.id !== id));
      if (editingStudent && editingStudent.id === id) {
        setEditingStudent(null);
        setIsAdding(false);
        setCurrentStudent(initialStudentState);
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
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Quản Lý Sinh Viên</h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lọc Sinh Viên</h2>
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
            {editingStudent ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(initialStudentState).map((key) => {
              if (['id', 'ngay_tao', 'ngay_cap_nhat', 'nguoi_tao', 'nguoi_cap_nhat', 'mat_khau'].includes(key)) {
                return null;
              }

              let inputType = 'text';
              if (key === 'ngay_sinh' || key === 'ngay_cap_cmnd') inputType = 'date';
              if (key === 'sdt' || key === 'cmnd') inputType = 'number';
              if (key === 'phai') {
                return (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="text-sm font-medium text-gray-700 capitalize mb-1">
                      {key.replace(/_/g, ' ')}
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
              if (key === 'trang_thai') {
                return (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="text-sm font-medium text-gray-700 capitalize mb-1">
                      {key.replace(/_/g, ' ')}
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
                      <option value="Active">Đã Đăng Ký</option>
                      <option value="Inactive">Chưa Đăng Ký</option>
                      <option value="Pending">Đang Đăng Ký</option>
                    </select>
                  </div>
                );
              }

              return (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="text-sm font-medium text-gray-700 capitalize mb-1">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type={inputType}
                    id={key}
                    name={key}
                    value={currentStudent[key]}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder={`Nhập ${key.replace(/_/g, ' ')}`}
                    required={!['id', 'ngay_cap_nhat', 'nguoi_cap_nhat', 'dang_hien', 'mat_khau'].includes(key)}
                  />
                </div>
              );
            })}

            <div className="col-span-full flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-black hover:bg-green-600 hover:scale-105 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition transform duration-100"
              >
                {editingStudent ? 'Cập Nhật' : 'Thêm Mới'}
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
          <h2 className="text-2xl font-semibold text-gray-800">Danh Sách Sinh Viên</h2>
          <button
            onClick={handleAddStudent}
            className="bg-black hover:bg-green-600 hover:scale-105 text-white font-bold py-3 px-6 rounded-[100px] shadow-md transition transform duration-100"
          >
            Thêm Sinh Viên
          </button>
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy sinh viên nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới Tính</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Sinh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.mssv}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.ngay_sinh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.sdt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.khoa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.trang_thai}</td>
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