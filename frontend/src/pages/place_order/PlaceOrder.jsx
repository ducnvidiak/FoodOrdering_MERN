import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const server_url = import.meta.env.VITE_SERVER_URL;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => {
        let itemInfo = item;
        itemInfo.quantity = cartItems[item._id];
        orderItems.push(itemInfo);
      });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + (getTotalCartAmount() > 0 ? 2 : 0),
    };

    let response = await axios.post(
      server_url + "/api/order/place",
      orderData,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert(response.data.message);
    }
  };

  useEffect(() => {
    if (!token || Object.keys(cartItems).length === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={submitHandler}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            placeholder="Last Name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            placeholder="Zip code"
            required
          />
          <input
            type="text"
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            placeholder="Country"
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() > 0 ? 2 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() + (getTotalCartAmount() > 0 ? 2 : 0)}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
