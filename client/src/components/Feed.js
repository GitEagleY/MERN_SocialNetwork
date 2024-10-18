import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeedStyles.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please log in.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("Failed to fetch posts. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = async (post) => {
    const token = localStorage.getItem("token");
    const newText = prompt("Enter new text:", post.text);

    if (newText !== null && token) {
      try {
        await axios.put(
          `http://localhost:5000/api/posts/${post._id}`,
          { text: newText },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, text: newText } : p
        );
        setPosts(updatedPosts);
        alert("Post updated successfully!");
      } catch (error) {
        console.error("Error editing post:", error);
        alert("Failed to edit post. Please try again.");
      }
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");

    if (token) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `http://localhost:5000/api/posts/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Delete response:", response.data); // Log response data

        const updatedPosts = posts.filter((p) => p._id !== postId);
        setPosts(updatedPosts);
        alert("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-posts">
        {posts.map((post) => {
          const token = localStorage.getItem("token");
          const userId = token
            ? JSON.parse(atob(token.split(".")[1])).userId
            : null;

          return (
            <div key={post._id} className="post">
              <div className="user-info">
                <img
                  src={post.userId?.avatar || "/default-avatar.png"} // Optional chaining
                  alt={`${post.userId?.username || "Unknown user"}'s avatar`} // Optional chaining
                  className="post-avatar"
                />
                <div className="user-details">
                  <span className="username">
                    {post.userId?.username || "User not found"}{" "}
                  </span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="post-content">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post content"
                    className="post-image"
                  />
                )}
                <p>{post.text}</p>
              </div>

              {post.userId && userId && post.userId._id === userId && (
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
