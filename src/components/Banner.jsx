import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { Autoplay, EffectFade } from 'swiper/modules';
import { slide } from '../constant/data';

const Banner = () => {
const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
			<Swiper
				style={{
					'--swiper-pagination-color': '#ffff',
				}}
				spaceBetween={30}
				effect={'fade'}
				autoplay={{
					delay: 4500,
					disableOnInteraction: false,
				}}
				modules={[EffectFade, Autoplay]}
				onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
				className="mySwiper w-full cursor-grab"
			>
				{slide.map((item, index) => (
					<SwiperSlide key={index} className=" lg:relative min-h-screen">
                    <img src={item.image} className="w-full h-full object-cover" />
                    <div className="xl:absolute lg:top-0 xl:bg-gradient-to-b lg:from-orange-100 xl:w-[100%] xl:h-full">
                    </div>
                  </SwiperSlide>
				))}
			</Swiper>
		</div>
  )
}

export default Banner