import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/images/assets";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For Better Experience Download <br /> FMedium App
      </p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="" />
        <img src={assets.app_store} alt="" />
      </div>
    </div>
  );
};

export default AppDownload;
