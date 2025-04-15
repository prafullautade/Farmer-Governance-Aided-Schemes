import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <Link to="/admin/post-crop" className="text-decoration-none">
            <div className="card text-bg-success h-100 text-center p-4 shadow rounded-4">
              <h4>Post Crop Details</h4>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/admin/post-scheme" className="text-decoration-none">
            <div className="card text-bg-primary h-100 text-center p-4 shadow rounded-4">
              <h4>Post Government Schemes</h4>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/admin/approve" className="text-decoration-none">
            <div className="card text-bg-warning h-100 text-center p-4 shadow rounded-4">
              <h4>Approve Applications</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
