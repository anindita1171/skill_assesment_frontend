import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const NewsAndSchemes = () => {
  const newsItems = [
    
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          News and <span className="text-blue-600">Schemes</span>
        </h2>
        <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          We're proud to collaborate with leading organizations in the education
          sector to drive innovation and excellence in assessment.
        </p>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="py-8"
        >
          {newsItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="px-2 p-2">
                <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                  <img
                    src={item.image}
                    alt={`News ${index + 1}`}
                    className="w-full rounded-md mb-4"
                  />
                  <p className="text-gray-700 text-center font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </Swiper>
      </div>
    </section>
  );
};

export default NewsAndSchemes;
