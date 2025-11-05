import React, { useState, useEffect } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import Loader from "../Loader/Loader";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Data, setData] = useState(null); // Initialize to null to handle loading state
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [editDetails, setEditDetails] = useState({}); // State to store updated book details
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await api.get(`/get-book-byid/${id}`);
      setData(response.data.data);
      setEditDetails(response.data.data); // Set initial values for edit form
    };
    fetch();
  }, [id]);

  const handleFavourite = async () => {
    const response = await api.put(
      "/fav",
      { bookid: Data._id },
      { headers }
    );
    alert(response.data.message);
  };

  const handleCart = async () => {
    try {
      const response = await api.put(
        "/add-to-cart",
        { bookid: id },
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding book to cart:", error);
    }
  };

  const handleDeleteBook = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await api.delete(`/delete-book/${id}`, {
          headers,
        });
        alert(response.data.message);
        navigate("/"); // Navigate back to homepage after deletion
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleEditButtonClick = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setEditDetails({ ...editDetails, [name]: value });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/update-book/${id}`,
        editDetails,
        { headers }
      );
      alert(response.data.message);
      setData(editDetails); // Update displayed data with the edited details
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <>
      {Data ? (
        <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col md:flex-row gap-8">
          <div className="w-full lg:w-3/6">
            <div className="relative bg-zinc-800 rounded px-4 py-12 h-[60vh] lg:h-[88vh] flex justify-around">
              {Data.pdfUrl && (
                <a
                  href={Data.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="absolute top-4 right-4 bg-white text-zinc-900 text-sm px-3 py-1 rounded shadow hover:bg-zinc-100"
                >
                  Download PDF
                </a>
              )}
              <img src={Data.url} alt="/" className="h-[50vh] lg:h-[70vh] rounded" />
              {isLoggedIn && role === "user" && (
                <div className="flex md:flex-col">
                  <button
                    className="bg-white rounded-full text-3xl p-3 text-red-500"
                    onClick={handleFavourite}
                  >
                    <FaHeart />
                  </button>
                  <button
                    className="bg-white rounded-full text-3xl p-3 mt-4 text-blue-500"
                    onClick={handleCart}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              )}
              {isLoggedIn && role === "admin" && (
                <div className="flex md:flex-col">
                  <button
                    className="bg-white rounded-full text-3xl p-3 text-red-500"
                    onClick={handleEditButtonClick}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-white rounded-full text-3xl p-3 mt-4 text-blue-500"
                    onClick={handleDeleteBook}
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 w-full lg:w-3/6">
            {editMode ? (
              <form onSubmit={handleUpdateBook} className="bg-zinc-800 p-4 rounded">
                <h2 className="text-2xl text-white">Edit Book Details</h2>
                <input
                  type="text"
                  name="title"
                  value={editDetails.title || ""}
                  onChange={handleUpdateChange}
                  placeholder="Title"
                  className="w-full my-2 p-2"
                />
                <input
                  type="text"
                  name="author"
                  value={editDetails.author || ""}
                  onChange={handleUpdateChange}
                  placeholder="Author"
                  className="w-full my-2 p-2"
                />
                <input
                  type="text"
                  name="description"
                  value={editDetails.desc || ""}
                  onChange={handleUpdateChange}
                  placeholder="Description"
                  className="w-full my-2 p-2"
                />
                <input
                  type="text"
                  name="price"
                  value={editDetails.price || ""}
                  onChange={handleUpdateChange}
                  placeholder="Price"
                  className="w-full my-2 p-2"
                />
                <input
                  type="text"
                  name="language"
                  value={editDetails.language || ""}
                  onChange={handleUpdateChange}
                  placeholder="Language"
                  className="w-full my-2 p-2"
                />
                <input
                  type="text"
                  name="url"
                  value={editDetails.url || ""}
                  onChange={handleUpdateChange}
                  placeholder="Image URL"
                  className="w-full my-2 p-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Update Book
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white p-2 rounded ml-4"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h1 className="text-4xl text-zinc-300 font-semibold">{Data.title}</h1>
                <p className="text-zinc-400 mt-1">by {Data.author}</p>
                <p className="text-zinc-500 mt-4 text-xl">{Data.desc}</p>
                <p className="flex mt-4 items-center justify-start text-zinc-400">
                  <GrLanguage className="me-3" /> {Data.language}
                </p>
                <p className="mt-4 text-zinc-100 text-3xl font-semibold">
                  Price : ₹ {Data.price}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
