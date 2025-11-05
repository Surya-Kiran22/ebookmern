import { React, useState, useEffect } from "react";
import Loader from "../components/Loader/Loader";
import api from "../api";
import { AiFillDelete } from "react-icons/ai";


const Cart = () => {
  const [Cart, setCart] = useState();
  const [Total, setTotal] = useState(0);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(
        "/get-cart",
        { headers }
      );
      setCart(res.data.data);
    };
    fetch();
  }, [Cart]);
  const deleteItem = async (bookid) => {
    const response = await api.put(
      `/del-cart/${bookid}`,
      {},
      { headers }
    );
    alert(response.data.message);
  };
  useEffect(() => {
    if(Cart && Cart.length>0) {
      let total=0;
      Cart.map((items)=>{
        total+=items.price;
      });
      setTotal(total);
      total=0;
    }
    
  }, [Cart]);

  return (
    <div className="bg-zinc-900 px-12 h-screen py-8">
      {!Cart && <Loader />}
      {Cart && Cart.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
              Empty Cart
            </h1>
            <img
              src="https://cdn.iconscout.com/icon/premium/png-256-thumb/empty-cart-2685174-2232751.png"
              alt="empty-cart"
              className="lg:h-[50vh]"
            />
          </div>
        </div>
      )}
      {Cart && Cart.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
            Your Cart
          </h1>
          {Cart.map((items, i) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
              key={i}
            >
              <img
                src={items.url}
                alt="/"
                className="h-[20vh] md:h-[10vh] object-cover"
              />
              <div className="w-ull md:w-auto">
                <h1 className="text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                  {items.title}
                </h1>
                <p className="text-normal text-zinc-300 mt-2 hidden lg:block">
                  {items.desc.slice(0, 100)}...
                </p>
                <p className="text-normal text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {items.desc.slice(0, 65)}...
                </p>
                <p className="text-normal text-zinc-300 mt-2 block md:hidden">
                  {items.desc.slice(0, 100)}...
                </p>
              </div>
              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 text-3xl font-semibold flex">
                  ₹ {items.price}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 ms-12"
                  onClick={() => deleteItem(items._id)}
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Cart;
