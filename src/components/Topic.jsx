import React, { useState } from 'react';
import { chuDeList, bangTinList } from '../constant/data';
import TopicDescription from './TopicDescription';

const Topic = () => {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredBangTin = selectedTopicId
    ? bangTinList.filter(bangtin => bangtin.id_chude === selectedTopicId)
    : bangTinList;

  return (
    <div className="p-6 w-[90%] min-h-screen mx-auto relative">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-6">Chủ Đề Thông Báo</h1>
        <div className="w-[75px] h-1 bg-orange-500"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8 mt-10">
        <button
          onClick={() => setSelectedTopicId(null)}
          className={`px-5 py-2 rounded-full border ${selectedTopicId === null ? 'bg-orange-500 text-white' : 'bg-white'} hover:bg-orange-500 hover:text-white transition`}
        >
          Tất cả
        </button>
        {chuDeList.map(topic => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopicId(topic.id)}
            className={`px-5 py-2 rounded-full border ${selectedTopicId === topic.id ? 'bg-orange-500 text-white' : 'bg-white'} hover:bg-orange-500 hover:text-white transition`}
          >
            {topic.ten_chu_de}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredBangTin.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedPost(item)}
            className="relative bg-white border rounded-xl shadow-lg overflow-hidden duration-300 transition transform group hover:cursor-pointer"
          >
            <div className="relative z-10">
              <img
                src={item.hinh_nen}
                alt={item.tieu_de}
                className="w-full h-[350px] object-cover"
              />
              <div className="p-4 bg-white">
                <h2 className="text-xl font-semibold mb-2">{item.tieu_de}</h2>
                
              </div>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 z-20 flex justify-center items-center">
              <div className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Xem Chi Tiết
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay component */}
      <TopicDescription post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
};

export default Topic;
