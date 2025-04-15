import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';

function AdminApplicationPanel() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/applications/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setMessage('No applications found');
        }
      })
      .catch(err => {
        console.error(err);
        setMessage('Error fetching applications');
      });
  }, []);

  const handleStatusUpdate = (appId, status) => {
    fetch(`${API_BASE}/api/applications/${appId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        alert('Error updating application');
      });
  };

  return (
    <div className="container my-5">
      <h2>Admin Scheme Application Panel</h2>
      {message && <div className="alert alert-warning">{message}</div>}
      {applications.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Scheme Name</th>
              <th>User Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.schemeName}</td>
                <td>{app.userName }</td>
                <td>{app.status}</td>
                <td>
                  <button className="btn btn-success btn-sm mx-1" onClick={() => handleStatusUpdate(app.id, 'Approved')}>Approve</button>
                  <button className="btn btn-danger btn-sm mx-1" onClick={() => handleStatusUpdate(app.id, 'Rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminApplicationPanel;
