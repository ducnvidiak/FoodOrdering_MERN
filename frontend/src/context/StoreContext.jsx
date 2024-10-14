import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const server_url = import.meta.env.VITE_SERVER_URL;

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      // document.cookie = `token=${token};  path=/; secure=${
      //   process.env.NODE_ENV === "production"
      // }; SameSite=Strict`;

      await axios.post(
        `${server_url}/api/cart/add`,
        {
          itemId,
        },
        {
          withCredentials: true,
        }
      );
    }
  };
  const removeFromCart = async (itemId) => {
    if (cartItems[itemId] > 1) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: 0 }));
    }
    if (token) {
      // document.cookie = `token=${token};  path=/; secure=${
      //   process.env.NODE_ENV === "production"
      // }; SameSite=Strict`;

      await axios.delete(`${server_url}/api/cart/remove`, {
        data: { itemId },
        withCredentials: true,
      });
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        total +=
          cartItems[item] * food_list.find((food) => food._id === item).price;
      }
    }
    return total;
  };
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${server_url}/api/food/list`);
      setFoodList(res.data.food);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCartItems = async () => {
    if (token) {
      // document.cookie = `token=${token};  path=/; secure=${
      //   process.env.NODE_ENV === "production"
      // }; SameSite=Strict`;
      try {
        const res = await axios.get(`${server_url}/api/cart/get`, {
          withCredentials: true,
        });
        console.log(res.data.cartData);

        setCartItems(res.data.cartData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        await fetchFoodList();
        if (localStorage.getItem("token")) {
          setToken(localStorage.getItem("token"));
        }
      } catch (error) {
        console.error("Failed to fetch food list:", error);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadCartData() {
      try {
        await loadCartItems();
      } catch (error) {
        console.error("Failed to load cart items:", error);
      }
    }
    loadCartData();
  }, [token]);

  // useEffect(() => {
  //   async function loadData() {
  //     await fetchFoodList();
  //     if (localStorage.getItem("token")) {
  //       setToken(localStorage.getItem("token"));
  //     }
  //     await loadCartItems();
  //   }
  //   loadData();
  //   console.log("load data");
  // }, [token]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
