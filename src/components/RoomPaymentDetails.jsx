import React, { useState, useEffect } from 'react';
import { invoiceService } from '../services/payment/invoices.service'; // Adjust path based on your project structure

const RoomPaymentDetails = () => {
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 10; // Number of invoices per page

  const fetchInvoices = async (page = 1) => {
    setLoading(true);
    try {
      const response = await invoiceService.getAll({ page, limit });
      setInvoices(response.invoices);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load invoices. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchInvoices(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Invoice Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Invoice ID</th>
                <th className="py-3 px-6 text-left">Student</th>
                <th className="py-3 px-6 text-left">Room</th>
                <th className="py-3 px-6 text-left">Bed</th>
                <th className="py-3 px-6 text-right">Amount (VND)</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Created At</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 px-6 text-center">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6">{invoice.id}</td>
                    <td className="py-3 px-6">
                      {invoice.Allocation.Student?.ten || 'N/A'} ({invoice.Allocation.Student?.mssv || 'N/A'})
                    </td>
                    <td className="py-3 px-6">
                      {invoice.Allocation.Bed.Room?.ten_phong || 'N/A'}
                    </td>
                    <td className="py-3 px-6">
                      {invoice.Allocation.Bed?.ten_giuong || 'N/A'}
                    </td>
                    <td className="py-3 px-6 text-right">
                      {parseFloat(invoice.so_tien_thanh_toan).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          invoice.Allocation.trang_thai_thanh_toan
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {invoice.Allocation.trang_thai_thanh_toan ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {new Date(invoice.ngay_tao).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomPaymentDetails;