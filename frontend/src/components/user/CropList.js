import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../../api';



function CropList() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/crops`)
      .then(res => res.json())
      .then(data => setCrops(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-5">
      <h2>Available Crops</h2>
      <div className="row">
        {crops.map(crop => (
          <div className="col-md-4" key={crop.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{crop.cropName}</h5>
                <p className="card-text">Season: {crop.season}</p>
                <p className="card-text">Type: {crop.cropType}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CropList;
