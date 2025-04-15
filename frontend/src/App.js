import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import './App.css'

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';

import PostCropDetails from './components/admin/PostCropDetails';
import PostGovtSchemes from './components/admin/PostGovtSchemes';
import ApproveSchemeRequests from './components/admin/ApproveSchemeRequests';

import CropList from './components/user/CropList';
import SchemeList from './components/user/SchemeList';
// import ApplyScheme from './components/user/ApplyScheme';
import Status from './components/user/Status';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />

          <Route path="/user/crops" element={<CropList />} />
          <Route path="/user/schemes" element={<SchemeList />} />
          <Route path="/user/status" element={<Status />} />
          
          <Route path="/admin/post-crop" element={<PostCropDetails />} />
          <Route path="/admin/post-scheme" element={<PostGovtSchemes />} />
          <Route path="/admin/approve" element={<ApproveSchemeRequests />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
