import React from "react";

export default function Editor({ value, onChange }) {
  return (
    <textarea
      placeholder="Write your content here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={10}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        marginBottom: '15px',
        resize: 'vertical'
      }}
    />
  );
}
