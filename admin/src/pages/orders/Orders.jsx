import React from "react";
import "./Orders.css";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = () => {
  const server_url = import.meta.env.VITE_SERVER_URL;

  const [orders, setOrders] = useState([]);
  const fetAllOrders = async () => {
    try {
      const response = await axios.get(`${server_url}/api/order/list`);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Error in fetching data");
      console.log(error);
    }
  };

  const statusHandler = async (id, status) => {
    console.log(id, status);
    try {
      const response = await axios.put(`${server_url}/api/order/status`, {
        orderId: id,
        status,
      });
      toast.success("Status updated");
      await fetAllOrders();
    } catch (error) {
      toast.error("Error in updating status");
      console.log(error);
    }
  };

  useEffect(() => {
    fetAllOrders();
  }, []);

  return (
    <div className="orders add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order) => (
          <div className="order-item" key={order._id}>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ", "}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select
              onChange={(e) => statusHandler(order._id, e.target.value)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
