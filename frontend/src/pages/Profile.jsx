import { React, useEffect, useState } from "react";
import Sidebar from "../components/Profile/SideBar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import api from "../api";

const Profile = () => {
  const [Profile, setProfile] = useState(null); // Initialize with null
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/get-user", { headers });
        setProfile(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Handle the error (e.g., show an error message)
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-auto py-8 gap-4 text-white">
      {/* Show loader while fetching profile */}
      {!Profile ? (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="w-full md:w-1/6 h-screen">
            <Sidebar data={Profile} />
          </div>
          <div className="w-full md:w-5/6">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
