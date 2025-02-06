import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (trip) GetPlaceImg();
  }, [trip]);

  const GetPlaceImg = async () => {
    const data = {
      textQuery: trip?.userSelection?.location,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      if (resp.data.places[0].photos) {
        const PhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          resp.data.places[0].photos[0].name // Use the first photo for better results
        );
        setPhotoUrl(PhotoUrl);
      }
    });
  };

  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
      <img
        src={photoUrl ? photoUrl : '/public/road-trip-vacation.jpg'}
        alt={trip?.userSelection?.location}
        className="h-[250px] w-full object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h2 className="font-bold text-3xl mb-4 text-gray-800 text-center">
          {trip?.userSelection?.location}
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="bg-white rounded-full p-2 px-4 shadow-lg text-center">
            <h3 className="font-medium text-gray-600">
              🗓️ {trip?.userSelection?.totalDays} Days
            </h3>
          </div>
          <div className="bg-white rounded-full p-2 px-4 shadow-lg text-center">
            <h3 className="font-medium text-gray-600">
              👩‍👧‍👦 {trip?.userSelection?.traveler} Travelers
            </h3>
          </div>
          <div className="bg-white rounded-full p-2 px-4 shadow-lg text-center">
            <h3 className="font-medium text-gray-600">
              💵 ₹{trip?.userSelection?.budget} Budget
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
