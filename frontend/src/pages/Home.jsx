import React, { useEffect, useState } from "react";
import Hero from "../components/Home/Hero";
import RecentlyAdded from "../components/Home/RecentlyAdded";
import { useSelector } from "react-redux";
import api from "../api";
import { Link } from "react-router-dom";

const Home = () => {
  const role = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [adminDetails, setAdminDetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) return;
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const res = await api.get("/get-user", { headers });
        setAdminDetails(res.data);
      } catch (e) {
        // no-op
      }
    };
    fetchUser();
  }, [isLoggedIn]);
  return (
    <div className="bg-zinc-900 text-white px-10 py-8">
      {isLoggedIn && role === "admin" && (
        <div className="mb-6 bg-zinc-800 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Admin Panel</h2>
              {adminDetails && (
                <p className="text-zinc-400 mt-1">
                  Signed in as <span className="text-zinc-200 font-medium">{adminDetails.username}</span> ({adminDetails.email}) • role: <span className="text-green-400">{adminDetails.role}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link to="/add-book" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">Add Book</Link>
              <Link to="/all-books" className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600">View All</Link>
            </div>
          </div>
        </div>
      )}
      <Hero />
      <RecentlyAdded />
    </div>
  );
};

export default Home;
