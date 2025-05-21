import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import API_BASE_URL from "../../components/Config";
import Swal from 'sweetalert2';

const EditBanner = () => {
  const location = useLocation();
    const id = location.state?.bannerId; // Get the banner ID from the route parameters
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [image, setImage] = useState(null); // For new image upload
  const [preview, setPreview] = useState(null); // For new image preview
  const [existingImage, setExistingImage] = useState(''); // To display the current image
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchBannerDetails = async () => {
      setFetchLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/banner/singlebanner/${id}`);
        const bannerData = response.data;
        setTitle(bannerData.title);
        setDescription(bannerData.description);
        setStatus(bannerData.status);
        setExistingImage(`${API_BASE_URL}/${bannerData.image}`); // Adjust path as needed
        setFetchLoading(false);
      } catch (error) {
        setFetchError('Failed to fetch banner details.');
        setFetchLoading(false);
      }
    };

    fetchBannerDetails();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    if (image) {
      formData.append('image', image); // Only append new image if selected
    }

    try {
    const response=  await axios.put(`${API_BASE_URL}/api/banner/updatebanner/${id}`, formData);
console.log(response)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Offer Banner updated successfully!',
      });

      navigate(-1); // Go back to the previous page
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update Offer Banner. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">Loading banner details...</div>;
  }

  if (fetchError) {
    return <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-red-500">{fetchError}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Banner</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* You can add more fields here if needed */}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload New Banner Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     dark:bg-gray-700 dark:text-white"
          />
        </div>

        {preview && (
          <div className="flex justify-center">
            <img src={preview} alt="New Banner Preview" className="w-40 h-auto rounded" />
          </div>
        )}

        {existingImage && !preview && (
          <div className="flex ">
            <img src={existingImage} alt="Current Banner" className="w-40 h-auto rounded" />
          </div>
        )}

        <button type="submit" disabled={loading} className="w-40 bg-primary text-white py-2 rounded ">
          {loading ? 'Updating...' : 'Update Banner'}
        </button>
      </form>
    </div>
  );
};

export default EditBanner;