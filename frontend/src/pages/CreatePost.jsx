//import ReactQuill from "react-quill";
//import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import "./createpost.css";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState(''); 
  const [content, setContent] = useState(null);
  //const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);
  

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.append('content', content);

    if (image) {
      data.append('image', image); 
    }

    const token = localStorage.getItem("token")

    const response = await fetch('http://localhost:2000/api/v1/blogs/post', {
      method: 'POST',
      body: data,
      headers : {
        Authorization: `Bearer ${token}`,
      }
      
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      alert("Failed to create post");
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (

  <form onSubmit={createNewPost} className="create-post-container">
  <h1>Create New BLOG</h1>
  
  <input 
    type="text"
    placeholder="Title"
    value={title}
    onChange={ev => setTitle(ev.target.value)}
  />

  <input 
    type="text"
    placeholder="Summary"
    value={summary}
    onChange={ev => setSummary(ev.target.value)}
  />

   <div className="editor">
    <Editor value={content} onChange={setContent} />
  </div>

    <input
        type="file"
        accept="image/*"
        onChange={(ev) => {
          const file = ev.target.files[0];
          setImage(file);
      setPreview(URL.createObjectURL(file));
        
        }}
      />

      {preview && (
        <div className="image-preview">
          <p>Image Preview</p>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        </div>
      )}

 

  <button type="submit">SUBMIT</button>
</form>

 
  );
}
