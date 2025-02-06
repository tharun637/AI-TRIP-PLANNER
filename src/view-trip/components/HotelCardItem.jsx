import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ item }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (item) getPlaceImg();
  }, [item]);

  const getPlaceImg = async () => {
    const data = {
      textQuery: item?.hotelName,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      if (resp.data.places[0].photos) {
        const PhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          resp.data.places[0].photos[0].name // Use the first photo for a better chance of finding a suitable one
        );
        setPhotoUrl(PhotoUrl);
      }
    });
  };

  return (
    <div className="max-w-sm mx-auto">
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item?.hotelName)},${encodeURIComponent(item?.hotelAddress)}`}
        target="_blank"
      >
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
          <img
            src={photoUrl ? photoUrl : '/public/road-trip-vacation.jpg'}
            alt={item?.hotelName}
            className="w-full h-40 object-cover" // Image styling for uniformity
          />
          <div className="p-4">
            <h2 className="font-bold text-lg text-gray-800">{item?.hotelName}</h2>
            <h3 className="text-sm text-gray-500">📍 {item?.hotelAddress}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-semibold text-gray-600">💵 {item?.price}</span> {/* Smaller size and grey color */}
              <span className="text-lg text-yellow-500">⭐ {item?.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItem;
