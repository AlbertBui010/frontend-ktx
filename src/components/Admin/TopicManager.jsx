import React, { useEffect, useState } from "react";
import { topicService } from "../../services/topic/topic.services";

const initialTopic = { ten_chu_de: "", mo_ta: "" };

const TopicManager = () => {
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(initialTopic);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await topicService.getAll();
      setTopics(res.data.topics || []);
    } catch {
      setMessage("Lỗi khi tải danh sách chủ đề");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await topicService.update(editing.id, currentTopic);
        setMessage("Cập nhật thành công");
      } else {
        await topicService.create(currentTopic);
        setMessage("Thêm thành công");
      }
      setCurrentTopic(initialTopic);
      setEditing(null);
      fetchTopics();
    } catch {
      setMessage("Lỗi khi lưu chủ đề");
    }
    setLoading(false);
  };

  const handleEdit = (topic) => {
    setEditing(topic);
    setCurrentTopic({ ten_chu_de: topic.ten_chu_de, mo_ta: topic.mo_ta });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa chủ đề này?")) {
      setLoading(true);
      try {
        await topicService.delete(id);
        setMessage("Đã xóa");
        fetchTopics();
      } catch {
        setMessage("Lỗi khi xóa");
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setCurrentTopic(initialTopic);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Quản Lý Chủ Đề</h1>

      {/* --- Add/Update Form --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {editing ? "Cập Nhật Chủ Đề" : "Thêm Chủ Đề Mới"}
        </h2>
        {message && (
          <div className="mb-4 text-center text-red-600 font-semibold">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label htmlFor="ten_chu_de" className="text-sm font-medium text-gray-700 mb-1">
              Tên Chủ Đề
            </label>
            <input
              type="text"
              id="ten_chu_de"
              name="ten_chu_de"
              value={currentTopic.ten_chu_de}
              onChange={(e) => setCurrentTopic({ ...currentTopic, ten_chu_de: e.target.value })}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="mo_ta" className="text-sm font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <textarea
              id="mo_ta"
              name="mo_ta"
              value={currentTopic.mo_ta}
              onChange={(e) => setCurrentTopic({ ...currentTopic, mo_ta: e.target.value })}
              rows="2"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
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

      {/* --- Topic List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Danh Sách Chủ Đề</h2>
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : topics.length === 0 ? (
          <p className="text-center text-gray-500">Không có chủ đề nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Chủ Đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{topic.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{topic.ten_chu_de}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{topic.mo_ta}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="w-[80px] h-[40px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-orange-500 mr-2 rounded-[50px]"
                        disabled={loading}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id)}
                        className="w-[80px] h-[40px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-red-500 rounded-[50px]"
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

export default TopicManager;