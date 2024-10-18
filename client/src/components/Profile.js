import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AuthStyles.css";

const Profile = () => {
  const [user, setUser] = useState({ name: "", username: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setNewName(response.data.name);
        setNewAvatar(response.data.avatar || "");
        setLoading(false);
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/me",
        {
          name: newName,
          password: newPassword,
          avatar: newAvatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setNewPassword("");
      setError(null);
    } catch (error) {
      console.error("Error updating user data:", error.response.data);
      setError("Error updating profile");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <img
          className="avatar"
          src={user.avatar || "/default-avatar.png"}
          alt={`${user.username}'s avatar`}
        />

        <h2>{user.username}</h2>
        <p>Name: {user.name}</p>
      </div>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Name"
          required
        />
        <input
          type="text"
          value={newAvatar}
          onChange={(e) => setNewAvatar(e.target.value)}
          placeholder="Avatar URL"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password (optional)"
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
