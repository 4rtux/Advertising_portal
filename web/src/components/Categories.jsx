
import React from 'react';

const Categories = () => (
  <div className="row text-center mb-4">
    <h3 className="mb-4">Browse Categories</h3>
    <div className="col-md-3">
      <div className="card">
        <div className="card-body">
          <img src="./src/assets/electronics.png" alt="Category" className="mb-2" />
          <h5 className="card-title">Electronics</h5>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card">
        <div className="card-body">
          <img src="./src/assets/cars.png" alt="Category" className="mb-2" />
          <h5 className="card-title">Cars</h5>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card">
        <div className="card-body">
          <img src="./src/assets/furnitures.png" alt="Category" className="mb-2" />
          <h5 className="card-title">Furniture</h5>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card">
        <div className="card-body">
          <img src="./src/assets/jobs.png" alt="Category" className="mb-2" />
          <h5 className="card-title">Jobs</h5>
        </div>
      </div>
    </div>
  </div>
);

export default Categories;
