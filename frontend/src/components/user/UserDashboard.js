import React from 'react';
import { Link } from 'react-router-dom';

function UserDashboard() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">User Dashboard</h2>

      <div className="row justify-content-center g-4">
        <div className="col-sm-6 col-md-4">
          <Link to="/user/crops" className="text-decoration-none">
            <div className="card text-bg-info h-100 text-center p-4 shadow rounded-4">
              <h5 className="mb-0">View Crop Details</h5>
            </div>
          </Link>
        </div>

        <div className="col-sm-6 col-md-4">
          <Link to="/user/schemes" className="text-decoration-none">
            <div className="card text-bg-success h-100 text-center p-4 shadow rounded-4">
              <h5 className="mb-0">View Govt Schemes</h5>
            </div>
          </Link>
        </div>

        <div className="col-sm-6 col-md-4">
          <Link to="/user/status" className="text-decoration-none">
            <div className="card text-bg-warning h-100 text-center p-4 shadow rounded-4">
              <h5 className="mb-0">Check Application Status</h5>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
