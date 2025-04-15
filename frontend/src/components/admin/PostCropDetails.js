import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../../api'; // Your API base path

function PostCropDetails() {
  const [cropName, setCropName] = useState('');
  const [season, setSeason] = useState('');
  const [cropType, setCropType] = useState('');
  const [postedCrops, setPostedCrops] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null); // for editing

  // 🔁 Fetch crops on component mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/crops`);
      setPostedCrops(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch crops');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!cropName || !season || !cropType) {
      setError('All fields are required!');
      return;
    }

    try {
      if (editId) {
        // UPDATE
        await axios.put(`${API_BASE}/api/crops/${editId}`, {
          cropName,
          season,
          cropType,
        });
        setSuccess('Crop updated successfully!');
        setEditId(null);
      } else {
        // CREATE
        await axios.post(`${API_BASE}/api/crops`, {
          cropName,
          season,
          cropType,
        });
        setSuccess('Crop posted successfully!');
      }

      // Reset form
      setCropName('');
      setSeason('');
      setCropType('');

      fetchCrops(); // Refresh list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (crop) => {
    setCropName(crop.cropName);
    setSeason(crop.season);
    setCropType(crop.cropType);
    setEditId(crop.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/crops/${id}`);
      setSuccess('Crop deleted!');
      fetchCrops();
    } catch (err) {
      console.error(err);
      setError('Failed to delete crop');
    }
  };

  return (
    <div className="container">
      <h2 className="my-5">{editId ? 'Edit Crop Details' : 'Post Crop Details'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Crop Name</label>
          <input
            type="text"
            className="form-control"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Season</label>
          <input
            type="text"
            className="form-control"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Crop Type</label>
          <input
            type="text"
            className="form-control"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          {editId ? 'Update Crop' : 'Post Crop'}
        </button>
      </form>

      {postedCrops.length > 0 && (
        <div className="mt-5">
          <h4>Crop List</h4>
          <div className="row">
            {postedCrops.map((crop) => (
              <div className="col-md-4" key={crop.id}>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{crop.cropName}</h5>
                    <p className="card-text"><strong>Season:</strong> {crop.season}</p>
                    <p className="card-text"><strong>Type:</strong> {crop.cropType}</p>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(crop)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(crop.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCropDetails;
