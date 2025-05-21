import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Trash, PencilLine } from "lucide-react";
import Swal from 'sweetalert2';
import API_BASE_URL from '../../components/Config';
import { Link } from 'react-router-dom';

const ManageBanner = () => {
  const [banners, setBanners] = useState([]);


  useEffect(() => {
    fetchBanners();
  }, []);

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/banner/allbanners`);
      console.log(response.data)
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/banner/deleteBanner/${id}`);
          setBanners(banners.filter((banner) => banner._id !== id));
          Swal.fire('Deleted!', 'Your banner has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete banner.', 'error');
        }
      }
    });
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Content</h2>
        <Link
          to="/addbanner"
          className="border px-4 py-2 rounded-md flex items-center gap-2
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     text-gray-800 dark:text-white"
        >
          <PlusCircle size={20} className="text-gray-800 dark:text-white" />
          Add Banner
        </Link>
      </div>
      <div className="card-body p-0">
        <div className="relative h-auto w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">#</th>
                <th className="table-head">Title</th>
                <th className="table-head">Description</th>
                <th className="table-head">Image</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, index) => {
                const imageUrl = banner.image ? `${API_BASE_URL}/${banner.image.replace(/\\/g, '/')}` : "";
                console.log("Image URL:", imageUrl); // <--- ADD THIS LINE
                return (
                  <tr key={banner._id} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{banner.title}</td>
                    <td className="table-cell">{banner.description}</td>
                    <td className="table-cell">
                      {banner.image ? (
                        <img
                          src={imageUrl}
                          alt={banner.title}
                          className=" h-auto max-h-10 "
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <span
                        style={{
                          backgroundColor: `${getStatusBackgroundColor(banner.status)}20`,
                          color: getStatusBackgroundColor(banner.status),
                          padding: "5px 10px",
                          borderRadius: "5px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >{banner.status}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <Link to={`/editbanner/${banner.title}`} state={{ bannerId: banner._id }}>
                          <PencilLine size={20} color="#3b82f5" />
                        </Link>
                        <button className="text-red-500 p-2" onClick={() => handleDelete(banner._id)}>
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBanner;