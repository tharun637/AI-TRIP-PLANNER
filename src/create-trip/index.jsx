import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList, SelectTripCategories } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Make sure you're using a library that supports toast notifications
import { chatSession } from "@/service/AIModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const MAPTILER_API_KEY = 'uCBXEjePDis0WAcvUmjc'; // Replace with your MapTiler API key

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [formData, setFromData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFromData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!formData?.location || !formData?.budget || !formData?.traveler || !startDate || !endDate || !selectedCategory) {
      toast.error("Please complete all fields!", { position: "top-center" });
      return;
    }
    toast.success("Generating your personalized itinerary...", { position: "top-center" });
    setLoading(true);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData?.location)
      .replace("{totalDays}", totalDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{category}", selectedCategory);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });
    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: "Application/json",
      },
    }).then((resp) => {
      localStorage.setItem("user", JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    });
  };

  // New function to fetch suggestions from MapTiler API
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]); // Clear suggestions if query is too short
      return;
    }
    try {
      const response = await axios.get(`https://api.maptiler.com/geocoding/${query}.json`, {
        params: {
          key: MAPTILER_API_KEY,
        },
      });
      setSuggestions(response.data.features);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    }
  };

  const handlePlaceChange = (e) => {
    const value = e.target.value;
    setPlace(value);
    handleInputChange("location", value);
    fetchSuggestions(value); // Fetch suggestions as user types
  };

  const handleSuggestionClick = (suggestion) => {
    setPlace(suggestion.place_name); // Set input to selected suggestion
    handleInputChange("location", suggestion.place_name); // Update formData
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="container mx-auto p-6 md:p-12 lg:p-16 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-4xl font-bold text-teal-600 mb-6">Craft Your Dream Adventure! ✈️</h2>
      <p className="text-center text-lg text-gray-700 mb-8">
        Fill in your travel preferences below,!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="mb-6 relative">
          <label className="block text-lg font-semibold mb-2">Where to?</label>
          <Input
            placeholder="Enter your destination"
            value={place}
            onChange={handlePlaceChange} // Use the new handler
            className="border border-gray-300 rounded-lg p-3 shadow-sm focus:ring focus:ring-teal-200 transition duration-200"
          />
          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-teal-100"
                >
                  {suggestion.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Choose Your Dates</label>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                handleInputChange("startDate", date);
              }}
              placeholderText="Start Date"
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 md:mb-0 shadow-sm focus:ring focus:ring-teal-200 transition duration-200"
              dateFormat="MMMM d, yyyy"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                handleInputChange("endDate", date);
              }}
              placeholderText="End Date"
              className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:ring focus:ring-teal-200 transition duration-200"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Your Travel Budget</label>
        <p className="text-sm text-gray-500 mb-4">This budget is dedicated to activities and dining during your trip.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`cursor-pointer p-4 border rounded-lg text-center hover:shadow-lg transition duration-200 transform ${formData?.budget === item.title ? "border-teal-600 shadow-lg" : "border-gray-200"}`}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold text-xl">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Who is Traveling?</label>
        {SelectTravelList.map((item, index) => (
          <div
            key={index}
            onClick={() => handleInputChange("traveler", item.title)}
            className={`cursor-pointer p-4 border rounded-lg text-center hover:shadow-lg transition duration-200 transform ${formData?.traveler === item.title ? "border-teal-600 shadow-lg" : "border-gray-200"}`}
          >
            <h2 className="text-3xl">{item.icon}</h2>
            <h2 className="font-bold text-xl">{item.title}</h2>
            <h2 className="text-sm text-gray-500">{item.desc}</h2>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Trip Category</label>
        {SelectTripCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category.title)}
            className={`inline-flex items-center justify-center w-full p-3 border rounded-lg text-left transition duration-200 hover:bg-teal-200 ${selectedCategory === category.title ? "bg-teal-200" : "bg-white"}`}
          >
            <span className="font-semibold">{category.title}</span>
          </button>
        ))}
      </div>

      <Button
        className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition duration-200"
        onClick={OnGenerateTrip}
        disabled={loading}
      >
        {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Generate Trip"}
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              You need to log in to continue. Would you like to log in with Google?
              <br />
              <br />
              <Button variant="outline" onClick={() => login()} className="flex items-center mt-4">
                <FcGoogle className="mr-2" /> Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
