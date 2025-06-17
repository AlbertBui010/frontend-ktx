import React from "react";

const SuccessRegisterAlert = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  const { student, registration, message } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-orange-500 mb-2 text-center">
          Đăng ký thành công!
        </h2>
        <p className="text-center text-gray-700 mb-6">
          {
            "Bạn đã đăng ký thành công. Vui lòng chờ duyệt từ quản trị viên."}
        </p>
        <div className="grid grid-cols-2 gap-4 text-base">
          <div>
            <div>
              <span className="font-semibold">MSSV:</span> {student.mssv}
            </div>
            <div>
              <span className="font-semibold">Tên:</span> {student.ten}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {student.email}
            </div>
            <div>
              <span className="font-semibold">Giới tính:</span> {student.phai}
            </div>
            <div>
              <span className="font-semibold">Ngày sinh:</span>{" "}
              {student.ngay_sinh}
            </div>
            <div>
              <span className="font-semibold">Nơi sinh:</span> {student.noi_sinh}
            </div>
            <div>
              <span className="font-semibold">Dân tộc:</span> {student.dan_toc}
            </div>
            <div>
              <span className="font-semibold">Tôn giáo:</span> {student.ton_giao}
            </div>
            <div>
              <span className="font-semibold">Khoa:</span> {student.khoa}
            </div>
            <div>
              <span className="font-semibold">Lớp:</span> {student.lop}
            </div>
          </div>
          <div>
            <div>
              <span className="font-semibold">SĐT:</span> {student.sdt}
            </div>
            <div>
              <span className="font-semibold">CMND:</span> {student.cmnd}
            </div>
            <div>
              <span className="font-semibold">Ngày cấp CMND:</span>{" "}
              {student.ngay_cap_cmnd}
            </div>
            <div>
              <span className="font-semibold">Nơi cấp CMND:</span>{" "}
              {student.noi_cap_cmnd}
            </div>
            <div>
              <span className="font-semibold">Hộ khẩu:</span> {student.ho_khau}
            </div>
            <div>
              <span className="font-semibold">Địa chỉ:</span> {student.dia_chi}
            </div>
            <div>
              <span className="font-semibold">Địa chỉ liên hệ:</span>{" "}
              {student.dia_chi_lien_he}
            </div>
            <div>
              <span className="font-semibold">Trạng thái:</span>{" "}
              {student.trang_thai}
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div>
          <h3 className="font-semibold mb-2">
            Thông tin phiếu đăng ký KTX:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                <span className="font-semibold">Ngày đăng ký:</span>{" "}
                {registration.ngay_dang_ky}
              </div>
              <div>
                <span className="font-semibold">Ngày bắt đầu ở:</span>{" "}
                {registration.ngay_bat_dau}
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span>{" "}
                {registration.trang_thai}
              </div>
            </div>
            <div>
              <div>
                <span className="font-semibold">Lý do đăng ký:</span>{" "}
                {registration.ly_do_dang_ky}
              </div>
              <div>
                <span className="font-semibold">Ghi chú:</span>{" "}
                {registration.ghi_chu}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessRegisterAlert;