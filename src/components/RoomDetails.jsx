// src/components/RoomDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { phongList, loaiPhongList, noiQuyList, noiQuyPhongList } from '../constant/data'; // Adjust path

const RoomDetails = () => {
  const { id } = useParams(); // Lấy id phòng từ URL
  const roomId = parseInt(id); // Chuyển id thành số nguyên

  // Tìm thông tin phòng
  const room = phongList.find(r => r.id === roomId);
  console.log('RoomDetails render:', { id, roomId, room });

  if (!room) {
    return (
      <div className="container mx-auto p-8 text-center min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">Phòng không tồn tại.</h2>
      </div>
    );
  }

  // Kết hợp thông tin loại phòng
  const roomType = loaiPhongList.find(type => type.id === room.id_loai_phong);
  const tenLoaiPhong = roomType ? roomType.ten : 'Chưa xác định';
  const giaLoaiPhong = roomType ? roomType.gia : 0;
  const moTaLoaiPhong = roomType ? roomType.mo_ta : 'Không có mô tả.';

  // Lấy các nội quy áp dụng cho phòng này
  const roomNoiQuyIds = noiQuyPhongList
    .filter(nq => nq.id_phong === roomId && nq.dang_hien)
    .map(nq => nq.id_noi_quy);

  const relevantNoiQuy = noiQuyList.filter(nq => roomNoiQuyIds.includes(nq.id));

  return (
    <div className="container mx-auto p-8 mt-[100px] min-h-screen">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-8">{room.ten} - Chi Tiết</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex mb-8">
        <div className="md:w-1/2">
          <img
            src={room.hinh_anh || "/img/default-room.jpg"}
            alt={room.ten}
            className="w-full h-80 object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>
            <p className="text-lg text-gray-700 mb-2">
              **Loại phòng:** <span className="font-medium text-orange-700">{tenLoaiPhong}</span>
            </p>
            <p className="text-lg text-gray-700 mb-2">
              **Giá:** <span className="font-bold text-green-600">{giaLoaiPhong.toLocaleString('vi-VN')} VNĐ/tháng</span>
            </p>
            <p className="text-lg text-gray-700 mb-2">
              **Sức chứa:** {room.sl_hien_tai}/{room.sl_max} người
            </p>
            <p className="text-lg text-gray-700 mb-2">
              **Giới tính:** <span className="font-medium">{room.gender}</span>
            </p>
            <p className="text-lg text-gray-700 mb-2">
              **Trạng thái:**
              <span className={`ml-1 font-bold ${room.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {room.isAvailable ? 'Còn chỗ' : 'Hết chỗ'}
              </span>
            </p>
            <p className="text-gray-700 mt-4">
              **Mô tả phòng:** {room.mo_ta}
            </p>
            <p className="text-gray-700 mt-2">
              **Mô tả loại phòng:** {moTaLoaiPhong}
            </p>
          </div>
          <div className="mt-6">
            <Link to="/" className="inline-block bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200">
              Quay lại danh sách phòng
            </Link>
          </div>
        </div>
      </div>

      {relevantNoiQuy.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nội quy phòng</h2>
          <ul className="list-disc list-inside text-gray-700">
            {relevantNoiQuy.map((nq, index) => (
              <li key={nq.id} className="mb-2">
                {nq.noi_quy}
              </li>
            ))}
          </ul>
        </div>
      )}

      {relevantNoiQuy.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-600">
          <p>Không có nội quy cụ thể nào được liệt kê cho phòng này.</p>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;