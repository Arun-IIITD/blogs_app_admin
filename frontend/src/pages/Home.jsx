import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const menuRefs = useRef({});
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  /* =========================
     CLOSE MENU ON OUTSIDE CLICK
  ========================= */
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     Object.values(menuRefs.current).forEach((ref) => {
  //       if (ref && ref.contains(e.target)) return;
  //     });
  //     setOpenMenuId(null);
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () =>
  //     document.removeEventListener("mousedown", handleClickOutside);
  // }, []);\


  useEffect(() => {
  const handleClickOutside = (e) => {
    const clickedInsideAnyMenu = Object.values(menuRefs.current).some(
      (ref) => ref && ref.contains(e.target)
    );
    if (!clickedInsideAnyMenu) {
      setOpenMenuId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);



   const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = token
          ? await API.get("/blogs/get-blogs", {
              headers: { Authorization: `Bearer ${token}` },
            })
          : await API.get("/blogs/public");

        setBlogs(res.data.data);
      } catch (err) {
        console.log("Error fetching blogs", err);
      } finally {
        setLoading(false);
      }
    };
  /* =========================
     FETCH BLOGS (PUBLIC + AUTH)
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

 

    fetchBlogs();
  }, []);

  /* =========================
     ACTIONS
  ========================= */
  const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);
    fetchBlogs();

  navigate("/", { replace: true });
  

   
  };

  

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      console.log("hi")
      await API.delete(`/blogs/delete-blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="home-container">
      {/* ================= HEADER ================= */}
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

              <button className="create-post-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="logout-btn" onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>
      </div>

      {user && <h2 className="welcome-text">Welcome, {user.name} </h2>}

      {/* ================= LOGIN MESSAGE ================= */}
{!user && (
  <h1 className="login-message">Kindly login to add, edit and delete blogs.</h1>
)}


      {/* ================= BLOG LIST ================= */}
      {loading ? (
        <p className="loading-text">Loading blogs...</p>
      ) : (
        <div className="blog-list">
      
          {blogs.length === 0 ? (
            <p>No blogs available.</p>
          ) : (
            blogs.map((blog) => (

             
              
              <div className="blog-card" key={blog._id}>
               
                  {blog.image && (
                    <div className="image-wrapper">
                      <img
                        src={`http://localhost:2000/${blog.image}`}
                        alt={blog.title}
                      />
                    </div>
                  )}

                  <div className="blog-content">
                    <h2>{blog.title}</h2>
                    <p>{blog.content}</p>
                  </div>

                


                {user && blog.author === user._id && (
                  
                    <div
                      className="menu-container"
                      ref={(el) => (menuRefs.current[blog._id] = el)}
                    >
                      <button
                        className="menu-btn"
                        onClick={() =>
                          setOpenMenuId(openMenuId == blog._id ? null : blog._id)
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId == blog._id && (
                        <div className="menu-dropdown">

                          <button
                            className="menu-item"
                            onClick= {() => navigate(`/edit-blog/${blog._id}`)}
                          >
                            Edit
                          </button>

                          <button
                            className="menu-item delete"
                            onClick={() => handleDelete(blog._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}


                </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
