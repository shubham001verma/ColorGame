import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import API_BASE_URL from "../../components/Config";

const EditContent = () => {
  const location = useLocation();
  const id = location.state?.contentId;
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [contentColor, setContentColor] = useState("#000000");

  const [contentData, setContentData] = useState({
    contentNumber: "",
    content: "",
    contentType:"",
    date:"",
    files: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/content/singlecontent/${id}`);
        setContentData(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    fetchContent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContentData({ ...contentData, [name]: value });
  };

  const handleQuillChange = (value, field, color) => {
    setContentData((prevData) => ({
      ...prevData,
      [field]: `<span style="color:${color};">${value}</span>`,
    }));
  };

  const handleContentColorChange = (e) => {
    const newColor = e.target.value;
    setContentColor(newColor);
    setContentData((prevData) => ({
      ...prevData,
      content: `<span style="color:${newColor};">${prevData.content.replace(/<span style="color:.*?">(.*?)<\/span>/g, "$1")}</span>`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("contentNumber", contentData.contentNumber);
    formData.append("content", contentData.content);
    formData.append("contentType", contentData.contentType);
    formData.append("date", contentData.date);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      await axios.put(`${API_BASE_URL}/content/updatecontent/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
console.log(formData)
      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Content has been updated!",
      });

      navigate(-1);
    } catch (error) {
      console.error("Error updating content:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Content</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Content Number:
          </label>
          <select
            value={contentData.contentNumber}
            onChange={handleChange}
            name="contentNumber"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              dark:bg-gray-700 dark:text-white"
          >
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={contentData.date}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Content Type:</label>
          <select
            value={contentData.contentType}
            onChange={handleChange}
            name="contentType"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Content Type</option>
            <option value="notice">Notice</option>
            <option value="warning">Warning</option>
            <option value="link">Link</option>
            <option value="banner">Banner</option>  
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Select Content Color:</label>
          <input
            type="color"
            value={contentColor}
            onChange={handleContentColorChange}
            className="w-16 h-5 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 dark:text-gray-300">Content:</label>
          <ReactQuill
            ref={editorRef}
            theme="snow"
            value={contentData.content.replace(/<span style="color:.*?">(.*?)<\/span>/g, "$1")}
            onChange={(value) => handleQuillChange(value, "content", contentColor)}
            className="min-h-[100px] max-h-[500px] overflow-y-auto bg-white dark:bg-gray-800 dark:text-white"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ["link", "image", "video"],
                ["clean"],
              ],
            }}
          />
        </div>
        <button
          type="submit"
          className="w-40 bg-primary text-white font-medium py-2 rounded-md transition duration-300"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditContent;