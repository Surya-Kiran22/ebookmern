import React from "react";
import { useNavigate,Link } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa'; // Sign-out icon
import { useDispatch } from "react-redux"; // Import useDispatch
import { authActions } from "../../store/auth"; // Import the authActions

const Sidebar = ({ data }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // For navigation after logout

  const handleLogout = () => {
    // Clear localStorage (for id and token)
    localStorage.removeItem("id");
    localStorage.removeItem("token");

    // Dispatch the logout action
    dispatch(authActions.logout());

    // Navigate the user to the login page (or home page)
    navigate("/"); // Assuming your login route is '/'
  };

  // Check if the user is an admin based on the `role` in `data`
  const isAdmin = data.role === "admin"; // Check if the user is admin

  return (
    <div className="bg-zinc-800 p-6 rounded-xl flex flex-col items-center justify-between h-full shadow-lg">
      <div className="flex flex-col items-center justify-center">
        <img src={data.avatar} alt="User Avatar" className="w-24 h-24 rounded-full border-2 border-zinc-500 mb-4" />
        <p className="text-2xl text-zinc-100 font-semibold">{data.username}</p>
        <p className="mt-1 text-normal text-zinc-400">{data.email}</p>
        <div className="w-full mt-4 h-[1px] bg-zinc-500 hidden lg:block"></div>
      </div>

      <div className="w-full flex-col items-center justify-center mt-6">
        {/* For Normal Users: Show the Favourites Button */}
        {!isAdmin && (
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300 mb-2 w-full flex justify-center"
          >
            Favourites
          </Link>
        )}

        {/* For Admins: Show external admin resource link */}
        {isAdmin && (
          <a
            href="https://share.google/thrqiK9YPgjOWVuCj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-100 font-semibold py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300 mb-2 w-full flex justify-center"
          >
            Admin Resource
          </a>
        )}

      </div>

      <button
        onClick={handleLogout} // Add the click handler
        className="bg-zinc-900 w-full mt-6 text-white font-semibold flex items-center justify-center py-2 rounded hover:bg-white hover:text-black transition-all duration-300"
      >
        Log Out
        <FaSignOutAlt className="ms-4" />
      </button>
    </div>
  );
};

export default Sidebar;
