// frontend-ktx/src/components/RoomPaymentDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentService } from "../services/payment/payment.service";
// import { currencyFormat } from "../utils/number.util"; // helper format VNĐ

const RoomPaymentDetails = () => {
  const { allocationId } = useParams();            // /payments/:allocationId
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError]   = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await paymentService.getDetails(allocationId);
        setDetail(data.data); // successResponse => { data: { ... } }
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [allocationId]);

  const handlePay = async () => {
    try {
      const { data } = await paymentService.createCheckout(allocationId);
      window.location.href = data.data.checkoutUrl; // redirect tới PayOS
    } catch (err) {
      alert(err.response?.data?.message || "Không tạo được phiên thanh toán");
    }
  };

  if (loading)  return <p>Đang tải...</p>;
  if (error)    return <p className="text-red-600">{error}</p>;
  if (!detail)  return null;

  const {
    allocation,
    pricePerMonth,
    soDonViThang,
    totalAmount,
  } = detail;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Chi tiết thanh toán KTX</h2>

      <div className="border rounded-lg p-4 space-y-2 shadow">
        <p>
          <span className="font-medium">Phòng:</span>{" "}
          {allocation?.Bed?.Room?.ten_phong}
        </p>
        <p>
          <span className="font-medium">Giường:</span>{" "}
          {allocation?.Bed?.ten_giuong}
        </p>
        <p>
          <span className="font-medium">Giá / tháng:</span>{" "}
          {currencyFormat(pricePerMonth)}
        </p>
        <p>
          <span className="font-medium">Số đơn vị tháng phải đóng:</span>{" "}
          {soDonViThang}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Tổng tiền:</span>{" "}
          {currencyFormat(totalAmount)}
        </p>

        {allocation.trang_thai_thanh_toan ? (
          <p className="text-green-600 font-semibold">Đã thanh toán</p>
        ) : (
          <button
            onClick={handlePay}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thanh toán ngay
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomPaymentDetails;
