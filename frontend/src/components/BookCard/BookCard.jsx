import React from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const BookCard = ({ data, favourite, removeFromFavourites }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleRemoveBook = async () => {
    try {
      // Remove the book from favourites on the backend
      const response = await api.put("/del-fav", { bookid: data._id }, { headers });
      alert(response.data.message);

      // Call the removeFromFavourites function passed from the parent (Favourites component)
      removeFromFavourites(data._id);  // Remove only the clicked book
    } catch (error) {
      console.error("Error removing book from favourites:", error);
      alert("There was an error removing the book from your favourites.");
    }
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col relative">  
      {data.pdfUrl && (
        <a
          href={data.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 bg-white text-zinc-900 text-xs px-2 py-1 rounded shadow hover:bg-zinc-100 z-10"
        >
          Download PDF
        </a>
      )}
      <Link to={`/view-book-details/${data._id}`}>
        <div>
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={data.url} alt="/" className="h-[50vh]" />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold">{data.title}</h2>
          <p className="mt-2 text-zinc-400 font-semibold">by {data.author}</p>
          <p className="mt-2 text-zinc-200 font-semibold text-xl">
            ₹ {data.price}
          </p>
        </div>
      </Link>

      {favourite && (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded border border-blue-500 mt-4 transition-all duration-300"
          onClick={handleRemoveBook}
        >
          Remove from Favourites
        </button>
      )}
    </div>
  );
};

export default BookCard;

