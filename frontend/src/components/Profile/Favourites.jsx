// Favourites.jsx
import React, { useEffect, useState } from "react";
import api from "../../api";
import BookCard from "../BookCard/BookCard"; // Assuming BookCard is still being used

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);
  const [userData, setUserData] = useState(null); // State to store the user data

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/get-user", { headers });
        if (response.data) {
          setUserData(response.data); // Set user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Fetch user data once when the component mounts

  // Fetch favourite books only if the user is not an admin
  useEffect(() => {
    if (userData && userData.role !== "admin") {
      const fetch = async () => {
        try {
          const response = await api.get("/get-fav", { headers });
          if (response.data && Array.isArray(response.data.data)) {
            setFavouriteBooks(response.data.data); // Set favourite books
          } else {
            setFavouriteBooks([]); // If not an array, set empty array
          }
        } catch (error) {
          console.error("Error fetching favourite books:", error);
          setFavouriteBooks([]); // Set empty array if there's an error
        }
      };
      fetch();
    }
  }, [userData]); // Fetch favourites when user data is available and it's not admin

  const removeFromFavourites = (bookId) => {
    // Filter out the specific book by its ID and update the state
    setFavouriteBooks(FavouriteBooks.filter(book => book._id !== bookId));
  };

  return (
    <>
      {userData && userData.role === "admin" ? (
        <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center w-full">
          Hello Admin
        </div>
      ) : Array.isArray(FavouriteBooks) && FavouriteBooks.length === 0 ? (
        <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center w-full">
          No Favourite Books
          <img
            src="https://th.bing.com/th/id/R.c9d2609368b34fe6808eddbfc20e0e75?rik=X1yyrJg1SJBKPQ&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2fwhite-star-png-transparent-background%2fwhite-star-png-transparent-background-13.png&ehk=XqxR0dI%2bjhGZUUTtCusdOtQoXLzidHsdICRo1Tx8COE%3d&risl=&pid=ImgRaw&r=0"
            alt="star"
            className="h-[20vh] my-8"
          />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {FavouriteBooks.map((item, i) => (
            <div key={i}>
              {/* Pass removeFromFavourites to each BookCard */}
              <BookCard 
                data={item} 
                favourite={true} 
                removeFromFavourites={removeFromFavourites} 
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Favourites;
