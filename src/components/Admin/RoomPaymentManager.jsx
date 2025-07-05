// RoomPaymentManager.jsx – Quản lý hóa đơn phòng KTX (phiên bản làm mới)
// --------------------------------------------------------------
// Lưu ý:
// 1. Đảm bảo invoiceService đã triển khai đầy đủ các hàm:
//    - getAll, create, update, delete, checkout
// 2. Thành phần này ưu tiên đơn giản –‑ tập trung vào tải & hiển thị dữ liệu.
//    Các thao tác thêm / sửa / xoá giữ nguyên, nhưng có thêm kiểm tra lỗi rõ ràng.
// 3. TailwindCSS v3 được dùng cho styling. Có thể tuỳ chỉnh theo hệ thống màu của bạn.
// --------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { invoiceService } from "../../services/payment/invoices.service";

// Định dạng tiền tệ VNĐ
const currencyFormat = (num) =>
  Number(num).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const statusColor = {
  pending: "text-yellow-500",
  paid: "text-green-600",
  overdue: "text-red-600",
};

const statusLabel = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
};

export default function RoomPaymentManager() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await invoiceService.getAll();
        setInvoices(res?.data?.invoices || []);
        console.log(res?.data?.invoices)
      } catch (err) {
        setError(
          err?.response?.data?.message || "Lỗi tải dữ liệu hóa đơn. Vui lòng thử lại."
        );
      }
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  // if (loading)
  //   return (
  //     <div className="text-center text-lg mt-8">Đang tải danh sách hóa đơn...</div>
  //   );

  // if (error)
  //   return (
  //     <div className="text-center text-red-600 text-lg mt-8">{error}</div>
  //   );

  // if (!invoices.length)
  //   return (
  //     <div className="text-center text-gray-500 text-lg mt-8">
  //       Không có hóa đơn nào trong hệ thống.
  //     </div>
  //   );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-xl my-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Danh sách hóa đơn phòng KTX
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Mã HĐ</th>
              <th className="p-3 border">Phòng</th>
              <th className="p-3 border">Giường</th>
              <th className="p-3 border">Sinh viên</th>
              <th className="p-3 border">Từ ngày</th>
              <th className="p-3 border">Đến ngày</th>
              <th className="p-3 border">Thành tiền</th>
              <th className="p-3 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map((inv) => (
              <tr key={inv.id} className="border-t text-center">
                <td className="p-3 border">{inv.id}</td>
                <td className="p-3 border">
                  {inv.Allocation?.Bed?.Room?.ten_phong || "Không có"}
                </td>
                <td className="p-3 border">
                  {inv.Allocation?.Bed?.ten_giuong || "Không có"}
                </td>
                <td className="p-3 border">
                  {inv.Allocation?.Student?.ten || "Không có"}
                </td>
                <td className="p-3 border">
                  {inv.Allocation?.ngay_bat_dau
                    ? inv.Allocation.ngay_bat_dau.slice(0, 10)
                    : ""}
                </td>
                <td className="p-3 border">
                  {inv.Allocation?.ngay_ket_thuc
                    ? inv.Allocation.ngay_ket_thuc.slice(0, 10)
                    : ""}
                </td>
                <td className="p-3 border">
                  {currencyFormat(inv.so_tien_thanh_toan)}
                </td>
                <td className={`p-3 border text-center font-semibold ${statusColor[inv.status || (inv.trang_thai_thanh_toan ? "paid" : "pending")]}`}>
                  {statusLabel[inv.status] ||
                    (inv.trang_thai_thanh_toan ? "Đã thanh toán" : "Chờ thanh toán")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
