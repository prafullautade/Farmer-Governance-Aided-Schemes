import { getAuth } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../../api';

function SchemeList() {
  const [schemes, setSchemes] = useState([]);
  const [message, setMessage] = useState('');
  const [appliedSchemes, setAppliedSchemes] = useState([]); // Track applied schemes

  useEffect(() => {
    // Fetch available schemes
    fetch(`${API_BASE}/api/schemes`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setSchemes(data);
        } else {
          throw new Error("Invalid data format for schemes");
        }
      })
      .catch(err => {
        console.error(err);
        setMessage('Failed to load schemes.');
      });

    // Fetch applied schemes from localStorage first (so it's immediate)
    const storedAppliedSchemes = JSON.parse(localStorage.getItem('appliedSchemes') || '[]');
    setAppliedSchemes(storedAppliedSchemes);

    // Fetch applied schemes from backend after loading from localStorage
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      console.log('Fetching applied schemes for user:', user.uid); // Debugging line
      axios
        .get(`${API_BASE}/api/user-applications/${user.uid}`)
        .then((response) => {
          console.log('Backend response for applied schemes:', response); // Debugging line
          if (response.data && Array.isArray(response.data)) {
            const backendAppliedSchemes = response.data;
            // Merge backend data with localStorage, avoiding duplicates
            const updatedAppliedSchemes = [
              ...new Set([
                ...storedAppliedSchemes, // Existing applied schemes from localStorage
                ...backendAppliedSchemes // New applied schemes from the backend
              ])
            ];

            // Update state and localStorage
            setAppliedSchemes(updatedAppliedSchemes);
            localStorage.setItem('appliedSchemes', JSON.stringify(updatedAppliedSchemes));
          } else {
            throw new Error("Invalid response format for applied schemes");
          }
        })
        .catch((err) => {
          console.error('Error fetching applied schemes from backend:', err); // Debugging line
          // setMessage('Failed to fetch applied schemes from backend.');
        });
    }
  }, []);

  const handleApply = async (schemeId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage('User not logged in.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/api/applications`, {
        schemeId,
        userId: user.uid
      });

      setMessage(response.data.message || 'Successfully applied for scheme!');

      // After successful application, update the applied schemes
      setAppliedSchemes((prevApplied) => {
        const updatedAppliedSchemes = [...prevApplied, schemeId];
        localStorage.setItem('appliedSchemes', JSON.stringify(updatedAppliedSchemes)); // Persist the change
        return updatedAppliedSchemes;
      });

    } catch (error) {
      console.error('Error applying for scheme:', error); // Debugging line
      if (error.response && error.response.status === 409) {
        setMessage('You have already applied for this scheme.');
      } else {
        setMessage('Error applying for scheme.');
      }
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Available Government Schemes</h2>

      {message && (
        <div className="alert alert-info text-center">{message}</div>
      )}

      <div className="row">
        {schemes.length > 0 ? (
          schemes.map(scheme => (
            <div className="col-md-4" key={scheme.id}>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{scheme.schemeName}</h5>
                  <p className="card-text"><strong>Description:</strong> {scheme.description}</p>
                  <p className="card-text"><strong>Eligibility:</strong> {scheme.eligibility}</p>

                  <button
                    className={`btn w-100 ${appliedSchemes.includes(scheme.id) ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleApply(scheme.id)}
                    disabled={appliedSchemes.includes(scheme.id)} // Disable if already applied
                  >
                    {appliedSchemes.includes(scheme.id) ? 'Already Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning text-center">No schemes available at the moment.</div>
        )}
      </div>
    </div>
  );
}

export default SchemeList;
