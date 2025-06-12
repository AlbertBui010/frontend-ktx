// src/components/Room.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import the static data
import { phongList, loaiPhongList } from '../constant/data'; // Adjust the path if needed

const Room = () => {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  // State để quản lý các tiêu chí lọc
  const [filters, setFilters] = useState({
    sl_max: '',
    trang_thai: '',
    gender: '',
    id_loai_phong: '',
  });

  // Kết hợp thông tin loại phòng vào danh sách phòng ban đầu
  const initialRoomsWithDetails = useMemo(() =>
    phongList.map(room => {
      const roomType = loaiPhongList.find(type => type.id === room.id_loai_phong);
      return {
        ...room,
        ten_loai_phong: roomType ? roomType.ten : 'Chưa xác định',
        gia_loai_phong: roomType ? roomType.gia : 0,
        isAvailable: room.sl_hien_tai < room.sl_max,
      };
    })
    , [phongList, loaiPhongList]);

  // State chứa danh sách phòng đã được lọc
  const [filteredRooms, setFilteredRooms] = useState(initialRoomsWithDetails);

  // useEffect để lọc phòng khi filters thay đổi
  useEffect(() => {
    let currentFilteredRooms = initialRoomsWithDetails;

    if (filters.sl_max) {
      currentFilteredRooms = currentFilteredRooms.filter(room =>
        room.sl_max === parseInt(filters.sl_max)
      );
    }

    if (filters.trang_thai) {
      currentFilteredRooms = currentFilteredRooms.filter(room =>
        room.trang_thai === filters.trang_thai
      );
    }

    if (filters.gender) {
      currentFilteredRooms = currentFilteredRooms.filter(room => {
        if (filters.gender === 'Không giới hạn') {
          return true;
        }
        return room.gender === filters.gender || room.gender === 'Không giới hạn';
      });
    }

    if (filters.id_loai_phong) {
      currentFilteredRooms = currentFilteredRooms.filter(room =>
        room.id_loai_phong === parseInt(filters.id_loai_phong)
      );
    }

    setFilteredRooms(currentFilteredRooms);
  }, [filters, initialRoomsWithDetails]);

  // Hàm xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Hàm xử lý khi bấm nút "Đăng ký ngay"
  const handleRegisterClick = (roomId) => {
    navigate(`/room/${roomId}`); // Chuyển hướng đến trang RoomDetails với ID phòng
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lọc theo sức chứa */}
          <div>
            <label htmlFor="sl_max" className="block text-sm font-medium text-gray-700">Sức chứa:</label>
            <select
              id="sl_max"
              name="sl_max"
              value={filters.sl_max}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả</option>
              <option value="2">2 người</option>
              <option value="3">3 người</option>
              <option value="4">4 người</option>
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
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả</option>
              <option value="Còn giường">Còn giường</option>
              <option value="Đầy">Đầy</option>
            </select>
          </div>

          {/* Lọc theo giới tính */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính:</label>
            <select
              id="gender"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Không giới hạn">Không giới hạn</option>
            </select>
          </div>

          {/* Lọc theo loại phòng */}
          <div>
            <label htmlFor="id_loai_phong" className="block text-sm font-medium text-gray-700">Loại phòng:</label>
            <select
              id="id_loai_phong"
              name="id_loai_phong"
              value={filters.id_loai_phong}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả</option>
              {loaiPhongList.map(type => (
                <option key={type.id} value={type.id}>{type.ten}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- Swiper Section --- */}
      {filteredRooms.length > 0 ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={false} // Thường không loop khi có bộ lọc để tránh nhảy qua phòng không liên quan
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
          className="mySwiper !pb-12" // Add padding bottom for pagination dots
        >
          {filteredRooms.map((room) => (
            <SwiperSlide key={room.id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 transform">
                <img
                  src={room.hinh_anh || "/img/default-room.jpg"} // Fallback image
                  alt={room.ten}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.ten}</h3>
                  <p className="text-sm text-gray-600 mb-2">Loại phòng: <span className="font-medium text-orange-600">{room.ten_loai_phong}</span></p>
                  <p className="text-sm text-gray-600 mb-2">Sức chứa: {room.sl_hien_tai}/{room.sl_max} người</p>
                  <p className="text-sm text-gray-600 mb-2">Giới tính: <span className="font-medium text-gray-700">{room.gender}</span></p>
                  <p className="text-sm text-gray-600 mb-4">Trạng thái:
                    <span className={`ml-1 font-semibold ${room.isAvailable ? 'text-green-600' : 'text-red-600'
                      }`}>                      {room.isAvailable ? 'Còn chỗ' : 'Hết chỗ'}
                    </span>
                  </p>
                  <p className="text-lg font-bold text-orange-700 mb-4">{room.gia_loai_phong.toLocaleString('vi-VN')} VNĐ/tháng</p>
                  <button
                    className={`w-full py-2 rounded-md font-semibold transition-colors duration-200 ${room.isAvailable
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`} disabled={!room.isAvailable}
                    onClick={() => handleRegisterClick(room.id)} // Thêm onClick handler
                  >
                    {room.isAvailable ? 'Đăng ký ngay' : 'Hết chỗ'}
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