// src/components/Room.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { roomService, roomTypeService } from '../services/room/room.service';

const Room = () => {
  const navigate = useNavigate();

  // State
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filters, setFilters] = useState({
    sl_max: '',
    trang_thai: '',
    gioi_tinh: '', // Đổi tên từ 'gender' sang 'gioi_tinh' để khớp với trường dữ liệu
    id_loai_phong: '',
  });

  // Fetch rooms & room types from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, typeRes] = await Promise.all([
          roomService.getAll({ limit: 100 }),
          roomTypeService.getAll(), // ✅ Gọi đúng hàm từ roomTypeService
        ]);
        // Lấy đúng trường từ API backend trả về
        setRooms(roomRes.data?.rooms || []);
        setRoomTypes(typeRes.data?.roomTypes || []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu phòng hoặc loại phòng:", err); // Log lỗi để dễ debug
        setRooms([]);
        setRoomTypes([]);
      }
    };
    fetchData();
  }, []);

  // Kết hợp thông tin loại phòng vào danh sách phòng và tính toán các trạng thái
  const roomsWithDetails = useMemo(() => {
    return rooms
      .filter(room => room.dang_hien) // chỉ lấy phòng đang hiển thị
      .map(room => {
        // Tìm loại phòng phù hợp. Ưu tiên room.RoomType nếu backend đã join sẵn
        const roomType = room.RoomType || roomTypes.find(type => type.id === room.id_loai_phong);

        // Tính toán số giường hiện tại đang "occupied"
        // Giả sử mỗi phòng có thể có nhiều giường và trường `trang_thai` của giường là 'occupied'
        const currentOccupiedBeds = Array.isArray(room.Beds) ? room.Beds.filter(bed => bed.trang_thai === "occupied").length : 0;

        // Kiểm tra xem phòng còn giường trống không (trạng thái 'available')
        const isAvailable = Array.isArray(room.Beds) ? room.Beds.some(bed => bed.trang_thai === "available") : false;

        return {
          ...room,
          ten_loai_phong: roomType?.ten_loai || 'Chưa xác định',
          gia_loai_phong: Number(roomType?.gia_thue) || 0,
          so_giuong_toi_da: roomType?.so_giuong || 0, // Đổi tên để rõ ràng hơn: sl_max -> so_giuong_toi_da
          so_giuong_hien_tai_da_chiem: currentOccupiedBeds, // Số giường đã có người
          con_cho_trong: isAvailable, // Trạng thái còn chỗ trống
          gioi_tinh_phong: room.gioi_tinh || 'Không giới hạn', // Đổi tên để rõ ràng hơn: gender -> gioi_tinh_phong
        };
      });
  }, [rooms, roomTypes]);

  // Lọc phòng theo filter
  const filteredRooms = useMemo(() => {
    let currentFilteredRooms = roomsWithDetails;

    if (filters.sl_max) {
      currentFilteredRooms = currentFilteredRooms.filter(room =>
        String(room.so_giuong_toi_da) === String(filters.sl_max)
      );
    }
    if (filters.trang_thai) {
      if (filters.trang_thai === "Còn chỗ") { // Thay đổi từ "Còn giường" sang "Còn chỗ" để khớp với logic `con_cho_trong`
        currentFilteredRooms = currentFilteredRooms.filter(room => room.con_cho_trong);
      } else if (filters.trang_thai === "Đầy") {
        currentFilteredRooms = currentFilteredRooms.filter(room => !room.con_cho_trong);
      }
    }
    if (filters.gioi_tinh) { // Sử dụng 'gioi_tinh' thay vì 'gender'
      currentFilteredRooms = currentFilteredRooms.filter(room => {
        if (filters.gioi_tinh === 'Không giới hạn') return true;
        return room.gioi_tinh_phong === filters.gioi_tinh || room.gioi_tinh_phong === 'Không giới hạn';
      });
    }
    if (filters.id_loai_phong) {
      currentFilteredRooms = currentFilteredRooms.filter(room =>
        String(room.id_loai_phong) === String(filters.id_loai_phong)
      );
    }
    return currentFilteredRooms;
  }, [filters, roomsWithDetails]);

  // Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Xử lý khi bấm "Đăng ký ngay"
  const handleRegisterClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className='container min-h-screen p-6 mx-auto relative mt-[100px]'>
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-6">Danh Sách Các Phòng</h1>
        <div className="w-[75px] h-1 bg-orange-500"></div>
      </div>

      {/* --- Filter Section --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Bộ lọc phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Lọc theo sức chứa */}
          <div>
            <label htmlFor="sl_max" className="block text-sm font-medium text-gray-700">Sức chứa:</label>
            <select
              id="sl_max"
              name="sl_max"
              value={filters.sl_max}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-black focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả</option>
              {/* Lấy các giá trị so_giuong_toi_da duy nhất từ roomsWithDetails */}
              {[...new Set(roomsWithDetails.map(r => r.so_giuong_toi_da))].sort((a, b) => a - b).map(val => (
                <option key={val} value={val}>{val} người</option>
              ))}
            </select>
          </div>
          {/* Lọc theo tình trạng */}
          <div>
            <label htmlFor="trang_thai" className="block text-sm font-medium text-gray-700">Tình trạng:</label>
            <select
              id="trang_thai"
              name="trang_thai"
              value={filters.trang_thai}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-black focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả</option>
              <option value="Còn chỗ">Còn chỗ</option> {/* Đổi tên hiển thị */}
              <option value="Đầy">Đầy</option>
            </select>
          </div>
          {/* Lọc theo giới tính */}
          <div>
            <label htmlFor="gioi_tinh" className="block text-sm font-medium text-gray-700">Giới tính:</label>
            <select
              id="gioi_tinh" // Sử dụng 'gioi_tinh'
              name="gioi_tinh" // Sử dụng 'gioi_tinh'
              value={filters.gioi_tinh}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-black focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Không giới hạn">Không giới hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Swiper Section --- */}
      {filteredRooms.length > 0 ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={false}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper !pb-12"
        >
          {filteredRooms.map((room) => (
            <SwiperSlide key={room.id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 transform">
                <img
                  src={room.hinh_anh || "/img/default-room.jpg"}
                  alt={room.ten_phong}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.ten_phong}</h3>
                  <p className="text-sm text-gray-600 mb-2">Loại phòng: <span className="font-medium text-orange-600">{room.ten_loai_phong}</span></p>
                  <p className="text-sm text-gray-600 mb-2">Sức chứa: {room.so_giuong_hien_tai_da_chiem}/{room.so_giuong_toi_da} người</p>
                  <p className="text-sm text-gray-600 mb-2">Giới tính: <span className="font-medium text-gray-700">{room.gioi_tinh_phong}</span></p>
                  <p className="text-sm text-gray-600 mb-4">Trạng thái:
                    <span className={`ml-1 font-semibold ${room.con_cho_trong ? 'text-green-600' : 'text-red-600'}`}>
                      {room.con_cho_trong ? 'Còn chỗ' : 'Hết chỗ'}
                    </span>
                  </p>
                  <p className="text-lg font-bold text-orange-700 mb-4">{room.gia_loai_phong.toLocaleString('vi-VN')} VNĐ/tháng</p>
                  <button
                    className={`w-full py-2 rounded-md font-semibold transition-colors duration-200 ${room.con_cho_trong
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                    disabled={!room.con_cho_trong}
                    onClick={() => handleRegisterClick(room.id)}
                  >
                    {room.con_cho_trong ? 'Đăng ký ngay' : 'Hết chỗ'}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center text-gray-600 text-lg py-10">
          Không tìm thấy phòng nào phù hợp với tiêu chí.
        </div>
      )}
    </div>
  );
};

export default Room;