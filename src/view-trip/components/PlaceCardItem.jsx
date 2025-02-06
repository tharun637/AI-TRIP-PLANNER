import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        place && GetPlaceImg();
    }, [place]);

    const GetPlaceImg = async () => {
        const data = {
            textQuery: place.placeName,
        };
        const result = await GetPlaceDetails(data).then(resp => {
            if (resp.data.places.length > 0 && resp.data.places[0].photos.length > 4) {
                const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[4].name);
                setPhotoUrl(PhotoUrl);
            }
        });
    };

    return (
        <div className="max-w-sm mx-auto">
            <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName + "," + place?.geoCoordinates} target='_blank'>
                <div className='bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl'>
                    <div className='relative'>
                        <img
                            src={photoUrl || '/public/road-trip-vacation.jpg'}
                            className='w-full h-40 object-cover rounded-t-lg'
                            alt={place.placeName}
                        />
                        <div className='absolute top-2 left-2 bg-orange-600 text-white px-2 py-1 text-xs rounded-md'>
                            ⭐ {place.rating}
                        </div>
                    </div>
                    <div className='p-4 pb-2'> {/* Adjusted padding here */}
                        <h2 className='font-bold text-lg text-gray-800'>{place.placeName}</h2>
                        <p className='text-sm text-gray-500'>{place.placeDetails}</p>
                        <h2 className='text-blue-700 text-sm font-semibold'>💵{place.ticketPricing}</h2>
                        <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                    </div>
                    <div className='flex justify-end p-4 pt-0'> {/* Removed bottom padding */}
                        <Button className="bg-orange-500 text-white hover:bg-orange-600 transition duration-200">
                            <FaLocationDot />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PlaceCardItem;
