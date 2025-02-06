import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import assets from '@/assets/assets';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    });
  };

  return (
    <div className='p-4 shadow-lg flex justify-between items-center bg-white sticky top-0 z-50'>
       <div className="logo flex gap-2 items-center justify-between">
          <div className="img inline-block h-5 w-5 md:h-10 md:w-10">
            <img src="/logo.svg" alt="" />
          </div>
      <a href="/" className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800">Thiva Tours</h1>
      </a>

      {/* User Action Section */}
      <div className="flex items-center gap-6">
        {user ? (
          <Popover>
            <PopoverTrigger>
              <img 
                src={user?.picture} 
                alt="User" 
                className='rounded-full w-10 h-10 border-2 border-gray-200 cursor-pointer hover:shadow-lg transition-all' 
              />
            </PopoverTrigger>
            <PopoverContent className="p-2 bg-white rounded-lg shadow-lg border w-48">
              <h3 className="text-gray-800 font-semibold text-center mb-2">Hello, {user?.name}</h3>
              <div className="flex flex-col gap-1">
                <a href="/create-trip">
                  <div className="text-[#ff7652] hover:bg-[#ff6a40] hover:text-white transition-all rounded px-3 py-1 text-center">
                    Create Trip
                  </div>
                </a>
                <a href="/my-trips">
                  <div className="text-[#ff7652] hover:bg-[#ff6a40] hover:text-white transition-all rounded px-3 py-1 text-center">
                    My Trips
                  </div>
                </a>
              </div>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 w-full mt-2"
                onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button 
            className="bg-[#ff7652] text-white px-6 py-2 rounded-full hover:bg-[#ff6a40] transition-all"
            onClick={() => setOpenDialog(true)}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg mx-auto rounded-lg bg-white p-8 shadow-xl">
          <DialogHeader>
            <DialogDescription className="text-center">
              <img src="/logo.svg" alt="Logo" className="h-12 mx-auto mb-4" />
              <h2 className="font-bold text-2xl text-gray-800 mb-4">Sign In with Google</h2>
              <p className="text-gray-600 mb-6">
                Access your personalized travel planner with ease.
              </p>
              <Button
                onClick={login}
                className="w-full bg-[#4285F4] text-white py-3 rounded-lg flex items-center justify-center gap-4 shadow hover:bg-[#357ae8] transition-all"
              >
                <FcGoogle className="h-6 w-6" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
