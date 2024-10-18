import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Main from "./components/Main";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import Navbar from "./components/Navbar";
import "./components/NavbarStyles.css";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Navbar />
      <div className="content">
        {" "}
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/feed" /> : <Navigate to="/login" />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route
            path="/feed"
            element={token ? <Feed /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={token ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-post"
            element={token ? <CreatePost /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
