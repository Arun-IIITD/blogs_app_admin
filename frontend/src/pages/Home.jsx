import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./home.css";

import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { AiOutlineDislike, AiFillDislike } from "react-icons/ai";

const Home = () => {
  const navigate = useNavigate();
  const menuRefs = useRef({});

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  /* =========================
     CLICK OUTSIDE MENU
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInside = Object.values(menuRefs.current).some(
        (ref) => ref && ref.contains(e.target)
      );
      if (!clickedInside) setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     FETCH BLOGS
  ========================= */
  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs/public");
      setBlogs(res.data.data);
    } catch (err) {
      console.error("Error fetching blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchBlogs();
  }, []);

  /* =========================
     LIKE BLOG
  ========================= */
  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to like");

      const res = await API.post(
        `/blogs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? res.data.data : b))
      );
    } catch (err) {
      console.error("Like error", err);
    }
  };

  /* =========================
     DISLIKE BLOG
  ========================= */
  const handleDislike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to dislike");

      const res = await API.post(
        `/blogs/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? res.data.data : b))
      );
    } catch (err) {
      console.error("Dislike error", err);
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    fetchBlogs();
    navigate("/", { replace: true });
  };

  /* =========================
     DELETE BLOG
  ========================= */
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Delete this blog?")) return;

    try {
      await API.delete(`/blogs/delete-blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="home-container">
      {/* HEADER */}
      <div className="user-profile">
        <h1>BLOGS APP</h1>

        <div className="button-group">
          {user ? (
            <>
              <button
                className="create-post-btn"
                onClick={() => navigate("/post-blog")}
              >
                Create Blog
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="create-post-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="logout-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {user && <h2 className="welcome-text">Welcome, {user.name}</h2>}
      {!user && (
        <h2 className="login-message">
          Kindly login to add, edit and delete blogs.
        </h2>
      )}

      {/* BLOG LIST */}
      {loading ? (
        <p className="loading-text">Loading blogs...</p>
      ) : (
        <div className="blog-list">
          {blogs.length === 0 ? (
            <p>No blogs available.</p>
          ) : (
            blogs.map((blog) => {
              const isLiked = user && blog.likedBy?.includes(user._id);
              const isDisliked = user && blog.dislikedBy?.includes(user._id);

              return (
                <div className="blog-card" key={blog._id}>
                  {blog.image && (
                    <div className="image-wrapper">
                      <img
                        src={`https://blogs-app-admin.onrender.com/${blog.image}`}
                        alt={blog.title}
                      />
                    </div>
                  )}

                  <div className="blog-content">
                    <h1>{blog.title}</h1>
                    <p>{blog.content}</p>

                    {/* LIKE / DISLIKE */}
                    <div className="like-dislike-bar">
                      <button
                        className={`like-btn ${
                          isLiked ? "active-like" : ""
                        }`}
                        onClick={() => handleLike(blog._id)}
                      >
                        {isLiked ? <AiFillLike size={22} /> : <AiOutlineLike size={22} />}
                        <span>{blog.likes}</span>
                      </button>

                      <button
                        className={`dislike-btn ${
                          isDisliked ? "active-dislike" : ""
                        }`}
                        onClick={() => handleDislike(blog._id)}
                      >
                        {isDisliked ? (
                          <AiFillDislike size={22} />
                        ) : (
                          <AiOutlineDislike size={22} />
                        )}
                        <span>{blog.dislikes}</span>
                      </button>
                    </div>
                  </div>

                  {/* MENU (VISIBLE TO ALL) */}
                  <div
                    className="menu-container"
                    ref={(el) => (menuRefs.current[blog._id] = el)}
                  >
                    <button
                      className="menu-btn"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === blog._id ? null : blog._id
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openMenuId === blog._id && (
                      <div className="menu-dropdown">
                        <button
                          className="menu-item"
                          onClick={() => {
                            if (!user) {
                              alert("Please login to edit blogs");
                              // navigate("/login");
                              return;
                            }
                            if (blog.author !== user._id) {
                              alert("You can edit only your own blogs");
                              return;
                            }
                             alert("are u sure want to edit blog?")
                            navigate(`/edit-blog/${blog._id}`);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="menu-item delete"
                          onClick={() => {
                            if (!user) {
                              alert("Please login to delete blogs");
                              // navigate("/login");
                              return;
                            }
                            if (blog.author !== user._id) {
                              alert("You can delete only your own blogs");
                              return;
                            }
                           
                            handleDelete(blog._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
