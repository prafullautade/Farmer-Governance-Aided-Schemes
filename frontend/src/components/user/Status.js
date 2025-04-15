import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import API_BASE from '../../api';

function Status() {
  const [applicationStatuses, setApplicationStatuses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage('User not logged in');
      return;
    }

    user.getIdToken().then(token => {
      fetch(`${API_BASE}/api/applications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setApplicationStatuses(data);
          } else {
            setMessage('No application status found.');
          }
        })
        .catch(err => {
          console.error('Error fetching application status:', err);
          setMessage('Failed to fetch application status from backend.');
        });
    });
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Application Status</h2>
      {message && <div className="alert alert-warning">{message}</div>}

      {!message && applicationStatuses.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-success">
              <tr>
                <th>No</th>
                <th>Scheme Name</th>
                <th>Status</th>
                <th>Applied At</th>
              </tr>
            </thead>
            <tbody>
              {applicationStatuses.map((app, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{app.schemeName}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(app.status)} p-2`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{new Date(app.appliedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !message && <div className="alert alert-info">No applications found.</div>
      )}
    </div>
  );
}

// Helper to style status badges
function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-success text-white';
    case 'pending':
      return 'bg-warning text-dark';
    case 'rejected':
      return 'bg-danger text-white';
    default:
      return 'bg-secondary text-white';
  }
}

export default Status;
