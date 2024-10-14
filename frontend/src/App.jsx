import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/navbar/Navbar";

import Home from "./pages/home/Home";
import Cart from "./pages/cart/Cart";
import PlaceOrder from "./pages/place_order/PlaceOrder";
import Verify from "./pages/verify/Verify";
import Footer from "./components/footer/Footer";
import MoveUp from "./components/custom/move_up/MoveUp";
import LoginPopup from "./components/login_popup/LoginPopup";
import MyOrders from "./pages/my_orders/MyOrders";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="app-box">
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
      <MoveUp />
    </div>
  );
};

export default App;
