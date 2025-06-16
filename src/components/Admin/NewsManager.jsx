import React, { useEffect, useState } from "react";
// Đảm bảo import cả newsService và topicService
import { newsService, topicService } from "../../services/topic/topic.services";

// Định nghĩa trạng thái ban đầu cho một bản tin mới
const initialNewsState = {
  tieu_de: "",
  mo_ta: "",
  noi_dung: "",
  hinh_nen: "", // Thêm trường hình nền nếu có
  id_chu_de: "", // Thêm ID chủ đề vì mỗi bản tin thuộc một chủ đề
};

const NewsManager = () => {
  const [news, setNews] = useState([]); // State để lưu danh sách bản tin
  const [topics, setTopics] = useState([]); // State để lưu danh sách chủ đề (dùng cho dropdown)
  const [currentNews, setCurrentNews] = useState(initialNewsState); // State cho bản tin đang được thêm/sửa
  const [editing, setEditing] = useState(null); // State để kiểm tra xem có đang chỉnh sửa bản tin nào không
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái tải
  const [message, setMessage] = useState({ type: "", text: "" }); // State cho thông báo (success/error)

  // Hàm tải danh sách bản tin từ API
  const fetchNews = async () => {
    setLoading(true); // Bắt đầu tải, hiển thị loading indicator
    try {
      const res = await newsService.getAll();
      // Điều chỉnh cách lấy data tùy thuộc vào cấu trúc successResponse của backend:
      // Nếu backend trả về { success: true, data: { news: [...] } }
      const newsData = res.data?.news || [];
      // Hoặc nếu backend trả về { success: true, news: [...] }
      // const newsData = res.news || [];
      setNews(newsData);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bản tin:", err);
      // Hiển thị thông báo lỗi chi tiết từ interceptor
      setMessage({ type: "error", text: err.message || "Không thể tải danh sách bản tin." });
      setNews([]); // Xóa danh sách nếu có lỗi
    }
    setLoading(false); // Kết thúc tải
  };

  // Hàm tải danh sách chủ đề từ API
  const fetchTopics = async () => {
    try {
      const res = await topicService.getAll();
      // Điều chỉnh cách lấy data tùy thuộc vào cấu trúc successResponse của backend:
      // Nếu backend trả về { success: true, data: { topics: [...] } }
      const topicsData = res.data?.topics || [];
      // Hoặc nếu backend trả về { success: true, topics: [...] }
      // const topicsData = res.topics || [];
      setTopics(topicsData);
    } catch (err) {
      console.error("Lỗi khi tải danh sách chủ đề:", err);
      // Thông báo lỗi này không cần hiển thị quá nổi bật nếu nó chỉ ảnh hưởng dropdown
      // setMessage({ type: "error", text: err.message || "Không thể tải danh sách chủ đề." });
    }
  };

  // useEffect để tải dữ liệu khi component được render lần đầu
  useEffect(() => {
    fetchNews();
    fetchTopics(); // Tải danh sách chủ đề ngay khi component mount
  }, []);

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý gửi form (thêm mới hoặc cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form
    setLoading(true); // Bắt đầu tải
    setMessage({ type: "", text: "" }); // Xóa thông báo cũ

    try {
      // Dữ liệu bản tin để gửi đi
      const dataToSend = {
        tieu_de: currentNews.tieu_de,
        mo_ta: currentNews.mo_ta,
        noi_dung: currentNews.noi_dung,
        hinh_nen: currentNews.hinh_nen, // Đảm bảo trường này được gửi đi
        id_chu_de: currentNews.id_chu_de, // Gửi ID chủ đề
      };

      if (editing) {
        // Nếu đang chỉnh sửa, gọi API update
        await newsService.update(editing.id, dataToSend);
        setMessage({ type: "success", text: "Cập nhật bản tin thành công!" });
      } else {
        // Nếu không, gọi API create
        await newsService.create(dataToSend);
        setMessage({ type: "success", text: "Thêm bản tin thành công!" });
      }

      // Sau khi thành công: reset form, tắt chế độ chỉnh sửa, và tải lại danh sách
      setCurrentNews(initialNewsState);
      setEditing(null);
      fetchNews(); // Tải lại danh sách bản tin để hiển thị thay đổi
    } catch (err) {
      console.error("Lỗi khi lưu bản tin:", err);
      setMessage({ type: "error", text: err.message || "Có lỗi xảy ra khi lưu bản tin! Vui lòng thử lại." });
    }
    setLoading(false); // Kết thúc tải
  };

  // Xử lý khi nhấn nút "Sửa"
  const handleEdit = (item) => {
    setEditing(item); // Đặt bản tin này vào trạng thái chỉnh sửa
    // Điền dữ liệu của bản tin vào form để chỉnh sửa
    setCurrentNews({
      tieu_de: item.tieu_de,
      mo_ta: item.mo_ta,
      noi_dung: item.noi_dung,
      hinh_nen: item.hinh_nen || "", // Đảm bảo có giá trị mặc định nếu null
      id_chu_de: item.id_chu_de || "", // Điền ID chủ đề
    });
    setMessage({ type: "", text: "" }); // Xóa thông báo cũ khi mở form sửa
  };

  // Xử lý khi nhấn nút "Xóa"
  const handleDelete = async (id) => {
    // Sử dụng window.confirm, nhưng trong ứng dụng thực tế nên dùng custom modal
    if (window.confirm("Bạn có chắc chắn muốn xóa bản tin này?")) {
      setLoading(true); // Bắt đầu tải
      setMessage({ type: "", text: "" }); // Xóa thông báo cũ

      try {
        await newsService.delete(id);
        setMessage({ type: "success", text: "Xóa bản tin thành công!" });
        fetchNews(); // Tải lại danh sách bản tin
      } catch (err) {
        console.error("Lỗi khi xóa bản tin:", err);
        setMessage({ type: "error", text: err.message || "Xóa bản tin thất bại!" });
      }
      setLoading(false); // Kết thúc tải
    }
  };

  // Xử lý khi nhấn nút "Hủy" trong form
  const handleCancel = () => {
    setEditing(null); // Tắt chế độ chỉnh sửa
    setCurrentNews(initialNewsState); // Reset form
    setMessage({ type: "", text: "" }); // Xóa thông báo
  };

  // Helper để lấy tên chủ đề từ ID (dùng để hiển thị trong bảng)
  const getTopicName = (topicId) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic ? topic.ten_chu_de : "Chưa có chủ đề";
  };

  return (
    <div className="container mx-auto p-4">
      {/* Khu vực hiển thị thông báo */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-md shadow-sm text-center font-medium ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
          <button
            className="float-right font-bold text-lg leading-none"
            onClick={() => setMessage({ type: "", text: "" })}
          >
            &times; {/* Dấu 'x' để đóng thông báo */}
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Quản Lý Bản Tin</h1>

      {/* --- Form Thêm/Cập nhật Bản tin --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {editing ? "Cập Nhật Bản Tin" : "Thêm Bản Tin Mới"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label htmlFor="tieu_de" className="text-sm font-medium text-gray-700 mb-1">
              Tiêu Đề
            </label>
            <input
              type="text"
              id="tieu_de"
              name="tieu_de"
              value={currentNews.tieu_de}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading} // Vô hiệu hóa khi đang tải
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="mo_ta" className="text-sm font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <input
              type="text"
              id="mo_ta"
              name="mo_ta"
              value={currentNews.mo_ta}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="noi_dung" className="text-sm font-medium text-gray-700 mb-1">
              Nội Dung
            </label>
            <textarea
              id="noi_dung"
              name="noi_dung"
              value={currentNews.noi_dung}
              onChange={handleInputChange}
              rows="4"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            ></textarea>
          </div>
          {/* Input cho hình nền */}
          <div className="flex flex-col">
            <label htmlFor="hinh_nen" className="text-sm font-medium text-gray-700 mb-1">
              URL Hình Nền
            </label>
            <input
              type="text"
              id="hinh_nen"
              name="hinh_nen"
              value={currentNews.hinh_nen}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          {/* Dropdown chọn Chủ đề */}
          <div className="flex flex-col">
            <label htmlFor="id_chu_de" className="text-sm font-medium text-gray-700 mb-1">
              Chủ Đề
            </label>
            <select
              id="id_chu_de"
              name="id_chu_de"
              value={currentNews.id_chu_de}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading || topics.length === 0} // Vô hiệu hóa nếu đang tải hoặc không có chủ đề
            >
              <option value="">-- Chọn Chủ đề --</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.ten_chu_de}
                </option>
              ))}
            </select>
            {topics.length === 0 && !loading && (
              <p className="text-red-500 text-xs mt-1">Chưa có chủ đề nào. Vui lòng tạo chủ đề trước.</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition duration-300"
              disabled={loading}
            >
              {editing ? "Cập Nhật" : "Thêm Mới"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- Danh Sách Bản Tin --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Danh Sách Bản Tin</h2>
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : news.length === 0 ? (
          <p className="text-center text-gray-500">Không có bản tin nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu Đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội Dung</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ Đề</th> {/* Thêm cột Chủ đề */}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tieu_de}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mo_ta}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.noi_dung}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getTopicName(item.id_chu_de)}</td> {/* Hiển thị tên chủ đề */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-[80px] h-[40px] bg-blue-600 text-white transition transform duration-100 hover:scale-105 hover:bg-blue-700 mr-2 rounded-md"
                        disabled={loading}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-[80px] h-[40px] bg-red-600 text-white transition transform duration-100 hover:scale-105 hover:bg-red-700 rounded-md"
                        disabled={loading}
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

export default NewsManager;
