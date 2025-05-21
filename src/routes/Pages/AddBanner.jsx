import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../components/Config";
import Swal from 'sweetalert2';

const AddBanner = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('image', image);
   

    try {
      await axios.post(`${API_BASE_URL}/api/banner/addbanner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Offer Banner Created successfully!',
      });

      setTitle('');
      setDescription('');
      setStatus('active');
      setImage(null);
      setPreview(null);
      navigate(-1);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create Offer Banner. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
         <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Banner</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div  className="grid grid-cols-2 gap-4">
            <div>
          <label className="block text-gray-700 dark:text-gray-300">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required   className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"/>
          </div>
          <div>
          <label className="block text-gray-700 dark:text-gray-300">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        </div>
        <div  className="grid grid-cols-2 gap-4">
       
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Banner Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange}  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white" />
        </div>

        {preview && (
          <div className="flex ">
            <img src={preview} alt="Banner Preview" className="w-40 h-auto rounded" />
          </div>
        )}

        <button type="submit" disabled={loading} className="w-40 bg-primary text-white py-2 rounded ">
          {loading ? 'Loading...' : 'Add Banner'}
        </button>
      </form>
    </div>
  );
};

export default AddBanner;
