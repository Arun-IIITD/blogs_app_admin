import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./editpost.css"

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    summary: "",
    image: null,
    imageUrl: "",
    
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
     //const token = localStorage.getItem("token");
      if (!token) return alert("Please login with your accnt to edit. This is not your blog");
    // if (!token) {
    //   navigate("/");
    //   return;
    // }

    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/get-blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBlog({
          title: res?.data?.data?.title || "",
          content: res?.data?.data?.content || "",
          summary:res?.data?.data?.summary || "",
          image: null,
          imageUrl: res?.data?.data?.image || "",
        });

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setBlog({ ...blog, image: file });
      setPreview(URL.createObjectURL(file)); // preview new image
    } else {
      setBlog({ ...blog, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("content", blog.content);
    formData.append("summary",blog.summary);
    if (blog.image) formData.append("image", blog.image);

    setUpdating(true);
    try {
      await API.put(`/blogs/edit-blog/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Blog updated successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Failed to update blog");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading blog...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto" }}>
      <h1>Edit Blog</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      >
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>

           <label>
          Summary:
          <textarea
            name="summary"
            value={blog.summary}
            onChange={handleChange}
            rows={2}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          Content:
          <textarea
            name="content"
            value={blog.content}
            onChange={handleChange}
            rows={6}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>

         {blog.imageUrl && !preview && (
          <div>
            <p>Current Image</p>
            <img
              src={`http://localhost:2000/${blog.imageUrl}`}
              alt="Current"
              style={{ width: "100%", maxHeight: "220px", objectFit: "cover" }}
            />
          </div>
        )}

         {/* New image preview */}
        {preview && (
          <div>
            <p>New Image Preview</p>
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", maxHeight: "220px", objectFit: "cover" }}
            />
          </div>
        )}

         <label>
          Replace Image:
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </label>

      

        <button
          type="submit"
          disabled={updating}
          style={{
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {updating ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
