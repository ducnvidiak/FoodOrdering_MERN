import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./List.css";

const server_url = import.meta.env.VITE_SERVER_URL;

const List = () => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    try {
      const response = await axios.get(`${server_url}/api/food/list`);
      const data = response.data;
      console.log(data.food);
      setList(data.food);
    } catch (error) {
      console.log(error);
      toast.error("Error in fetching data");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeItem = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(`${server_url}/api/food/remove`, {
        data: { id },
      });
      await fetchList();

      toast.success(response.data.message);
      fetchList();
    } catch (error) {
      toast.error("Error in deleting data");
    }
  };

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div className="list-table-format" key={item._id}>
            <img src={`${server_url}/images/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <p className="cursor" onClick={() => removeItem(item._id)}>
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
