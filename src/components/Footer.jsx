import React from 'react'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='w-full h-auto z-50 bg-white text-black shadow-2xl text-center mt-[200px] '>
      <div className="w-[80%] m-auto  grid grid-cols-3 gap-[100px] p-10">
        <div className="">
          <h1 className='text-3xl font-bold'>Dormanage</h1>
          <p className='text-[20px]'>Quản lý ký túc xá</p>
        </div>

        <div className="">
          <h1 className='text-2xl font-bold'>Liên hệ</h1>
          <p className='text-[20px]'>Email: DH52100604</p>
          <p className='text-[20px]'>SĐT: 0906834103</p>
          <p className='text-[20px]'>Địa chỉ: Cao Lỗ, Quận 8, TP.Hồ Chí Minh</p>
        </div>

        <div className="">
          <h1 className=" text-2xl font-bold">Social Account</h1>
          <div className=" mt-3 space-x-3 text-white text-2xl flex items-center">
          <FaFacebook className="hover:text-blue-500 cursor-pointer" />
          <FaInstagram className="hover:text-pink-500 cursor-pointer" />
          <FaTiktok className="hover:text-purple-600 cursor-pointer" />
          <FaYoutube className="hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="w-full h-[50px] bg-orange-500 text-white flex items-center justify-center p-0">
        <p className='text-lg font-bold text-white'>2025 Dormanage. LVTN. Life Long Learn</p>
      </div>
    </div>
  )
}

export default Footer