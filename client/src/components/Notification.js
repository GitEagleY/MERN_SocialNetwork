import React from "react";
import "./NotificationStyles.css";

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      {message}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;
