import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role); // Check user's role

  // Remove Cart link if the role is 'admin'
  if (role === "admin") {
    links.splice(2, 1); 
  }
  if (isLoggedIn === false) {
    links.splice(2, 2);
  }

  const [mobileNav, setMobileNav] = useState(false);

  const toggleMobileNav = () => setMobileNav(!mobileNav);

  return (
    <>
      <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://static.vecteezy.com/system/resources/previews/002/219/582/original/illustration-of-book-icon-free-vector.jpg"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">BookHeaven</h1>
        </Link>

        <div className="hidden md:flex gap-4 items-center">
          {links.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className="text-white text-xl font-semibold hover:text-blue-500 transition-all duration-300"
            >
              {item.title}
            </Link>
          ))}
          {/* Add Book link for admin */}
          {isLoggedIn && role === "admin" && (
            <Link
              to="/add-book"
              className="text-white text-xl font-semibold hover:text-blue-500 transition-all duration-300"
            >
              Add Book
            </Link>
          )}
        </div>

        {isLoggedIn === false && (
          <div className="hidden md:flex gap-4">
            <Link
              to="/login"
              className="px-6 text-xl font-semibold py-2 border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 text-xl font-semibold py-2 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}

        <button
          className="block md:hidden text-white text-2xl md:hidden hover:text-zinc-400"
          onClick={toggleMobileNav}
        >
          <FaGripLines />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileNav ? "block" : "hidden"
        } bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        {links.map((item, i) => (
          <Link
            to={item.link}
            key={i}
            className="text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300"
            onClick={toggleMobileNav}
          >
            {item.title}
          </Link>
        ))}
        {isLoggedIn && role === "admin" && (
          <Link
            to="/add-book"
            className="text-white text-4xl font-semibold hover:text-blue-500 transition-all duration-300"
            onClick={toggleMobileNav}
          >
            Add Book
          </Link>
        )}
        {isLoggedIn === false && (
          <>
            <Link
              to="/login"
              className="px-8 mb-8 text-3xl font-semibold py-2 border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-8 mb-8 text-3xl font-semibold py-2 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
