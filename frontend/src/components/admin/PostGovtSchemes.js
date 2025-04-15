import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostGovtSchemes() {
  const [schemeName, setSchemeName] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [error, setError] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [editingSchemeId, setEditingSchemeId] = useState(null); // for update mode

  // Fetch all schemes
  const fetchSchemes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schemes');
      setSchemes(response.data);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // Handle Add or Update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schemeName || !description || !eligibility) {
      setError('All fields are required!');
      return;
    }

    const schemeData = { schemeName, description, eligibility };

    try {
      if (editingSchemeId) {
        // Update mode
        const response = await axios.put(`http://localhost:5000/api/schemes/${editingSchemeId}`, schemeData);
        const updatedSchemes = schemes.map((scheme) =>
          scheme.id === editingSchemeId ? response.data : scheme
        );
        setSchemes(updatedSchemes);
        setEditingSchemeId(null); // reset update mode
      } else {
        // Add mode
        const response = await axios.post('http://localhost:5000/api/schemes', schemeData);
        setSchemes([...schemes, response.data]);
      }

      // Clear form
      setSchemeName('');
      setDescription('');
      setEligibility('');
      setError('');
    } catch (err) {
      console.error('Error submitting scheme:', err);
    }
  };

  // Start editing: fill form with scheme data
  const startEditing = (scheme) => {
    setSchemeName(scheme.schemeName);
    setDescription(scheme.description);
    setEligibility(scheme.eligibility);
    setEditingSchemeId(scheme.id);
  };

  // Delete scheme
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schemes/${id}`);
      setSchemes(schemes.filter((scheme) => scheme.id !== id));
    } catch (err) {
      console.error('Error deleting scheme:', err);
    }
  };

  return (
    <div className="container">
      <h2 className="my-5">{editingSchemeId ? 'Update Scheme' : 'Post Govt Schemes'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="schemeName" className="form-label">Scheme Name</label>
          <input
            type="text"
            className="form-control"
            id="schemeName"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="eligibility" className="form-label">Eligibility Criteria</label>
          <textarea
            className="form-control"
            id="eligibility"
            rows="4"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success w-100">
          {editingSchemeId ? 'Update Scheme' : 'Post Scheme'}
        </button>
      </form>

      <h3 className="my-5">Posted Schemes</h3>
      <ul className="list-group">
        {schemes.map((scheme) => (
          <li key={scheme.id} className="list-group-item">
            <h5>{scheme.schemeName}</h5>
            <p><strong>Description:</strong> {scheme.description}</p>
            <p><strong>Eligibility:</strong> {scheme.eligibility}</p>
            <button
              onClick={() => startEditing(scheme)}
              className="btn btn-warning me-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(scheme.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostGovtSchemes;
