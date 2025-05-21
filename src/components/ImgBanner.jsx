import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import API_BASE_URL from "../components/Config"; // Assuming your config file path

const ImgBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/banner/activebanners`);
                console.log("Banner Data:", response.data); // Log banner data for inspection
                setBanners(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to fetch banners');
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

const settings = {
  dots: false,
  arrows: false,
  infinite: banners.length > 1,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: banners.length > 1,
  autoplaySpeed: 1500,
};

    if (loading) {
        return <div className="bg-gray-100 py-8 px-4 text-center ">Loading banners...</div>;
    }

    if (error) {
        return <div className="bg-gray-100 py-8 px-4 text-center text-primary">Error loading banners: {error}</div>;
    }

    const firstThreeBanners = banners.slice(0, 3);

    return (
      
 
 
    <div className="w-full max-w-[500px] px-4">
      {firstThreeBanners.length > 0 ? (
        <Slider {...settings}>
          {firstThreeBanners.map((banner) => (
            <div key={banner._id}>
              <img
                src={`${API_BASE_URL}/${banner.image}`}
                alt={banner.title}
                className="w-full object-cover rounded-xl"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div>No active banners available.</div>
      )}
    </div>

);



 
};

export default ImgBanner;