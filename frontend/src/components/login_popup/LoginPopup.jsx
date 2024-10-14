import React, { useContext } from "react";
import { useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./LoginPopup.css";
import { assets } from "../../assets/images/assets";

import { toast } from "react-toastify";

import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const LoginPopup = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { token, setToken } = useContext(StoreContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUrl =
      server_url +
      (currentState === "Sign Up" ? "/api/user/register" : "/api/user/login");

    console.log(newUrl);

    await axios
      .post(newUrl, data)
      .then((res) => {
        if (currentState === "Sign Up") {
          toast.success(res.data.message);
        } else {
          toast.success(res.data.message);
        }

        document.cookie = `token=${res.data.token};  path=/; secure=${
          process.env.NODE_ENV === "production"
        }; SameSite=Strict`;

        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);

        setCurrentState("Sign Up");
        setShowLogin(false);
        setData({
          name: "",
          email: "",
          password: "",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={submitHandler}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <input
              type="text"
              name="name"
              value={data.name}
              placeholder="Your name"
              required
              onChange={onChangeHandler}
            />
          )}
          <input
            type="email"
            name="email"
            value={data.email}
            placeholder="Your email"
            required
            onChange={onChangeHandler}
          />
          <input
            type="password"
            name="password"
            value={data.password}
            placeholder="Password"
            required
            onChange={onChangeHandler}
          />
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" name="" id="" required />
          <p>
            By continuing, I agree to FMedium's Terms of Service and Privacy
            Policy
          </p>
        </div>
        {currentState === "Sign Up" && (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
        {currentState === "Login" && (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
