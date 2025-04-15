import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand">Agro Services</Link>

        {isAuthenticated && role && (
          <div className="d-flex align-items-center ms-auto">
            {role === 'user' && (
               <>
               <Link to="/user/dashboard" className="btn btn-outline-light btn-sm me-2">Dashboard</Link>
               <Link to="/user/crops" className="btn btn-outline-light btn-sm me-2">Crops</Link>
               <Link to="/user/schemes" className="btn btn-outline-light btn-sm me-2">Schemes</Link>
               <Link to="/user/status" className="btn btn-outline-light btn-sm me-2">Application Status</Link>
             </>
            )}

            {role === 'admin' && (
              <>
              <Link to="/admin/dashboard" className="btn btn-outline-light btn-sm me-2">Dashboard</Link>
              <Link to="/admin/post-crop" className="btn btn-outline-light btn-sm me-2">Add Crops</Link>
              <Link to="/admin/post-scheme" className="btn btn-outline-light btn-sm me-2">Add Scheme</Link>
              <Link to="/admin/approve" className="btn btn-outline-light btn-sm me-2">Manage Requests</Link>
            </>
            )}

            <span className="navbar-text me-3 text-white">Hello, {userName}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
