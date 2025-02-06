import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import assets from '@/assets/assets';

function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="absolute inset-0 bg-black opacity-30"></div> {/* Background overlay */}
      
      <h1 className="relative z-10 text-white font-extrabold text-[56px] leading-tight sm:text-[48px] md:text-[64px] lg:text-[72px] mt-10">
        <span className='block'>Discover Your Next Adventure</span> 
        <span className="text-[#ff7652]">with AI</span>
      </h1>
      
      <p className="relative z-10 mt-6 text-white text-lg sm:text-xl md:text-2xl max-w-2xl">
        Your personal trip planner, creating custom itineraries tailored to your interests and budget.
      </p>
      
      <Link to={'/create-trip'} className="relative z-10 mt-8">
        <Button className="bg-[#ff7652] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
          Get Started, It's Free
        </Button>
      </Link>
      
      <img src={assets.landing} className='relative z-10 mt-12 w-1/2 sm:w-1/3 md:w-[70%] lg:w-[80%] transition-transform hover:scale-110' alt="Trip Planner" />
    </div>
  );
}

export default Hero;
