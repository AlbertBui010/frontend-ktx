import React, { useEffect, useState } from "react";

const TopicDescription = ({ post, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (post) {
      setTimeout(() => setShow(true), 10); // Delay nhỏ để kích hoạt transition
    } else {
      setShow(false);
    }
  }, [post]);

  if (!post) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 `}
      onClick={onClose}
    >
      <div
        className={`flex flex-row bg-white rounded-[25px] p-6 w-full max-w-7xl max-h-[90vh] shadow-2xl overflow-y-auto relative transform transition-all duration-300 ${
          show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[50%] h-full mr-6">
          <img
          src={post.hinh_nen}
          alt={post.tieu_de}
          className="w-full h-full object-cover rounded-md mb-4"
        />
        </div>
        <div className="w-[50%] h-full flex flex-col justify-between">
        <h2 className="text-2xl font-bold mb-2 text-center">{post.tieu_de}</h2>
        <p className="text-gray-700 mb-4 italic text-center">{post.mo_ta}</p>
        <p className="text-gray-800 whitespace-pre-line">{post.noi_dung}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
        >
          ✕
        </button>

      </div>
    </div>
  );
};

export default TopicDescription;
