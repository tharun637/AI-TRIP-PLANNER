import React from 'react';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  return (
    <div className="container mx-auto px-4">
      <h2 className='font-bold text-2xl my-7 text-center'>Hotel Recommendations</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {trip?.tripData?.hotelOptions?.length > 0 ? (
          trip.tripData.hotelOptions.map((item, index) => (
            <HotelCardItem key={index} item={item} />
          ))
        ) : (
          <div className="text-center col-span-4">
            <p className="text-gray-600">No hotels available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotels;
