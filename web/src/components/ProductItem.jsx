
import React from 'react';

const ProductItem = () => (
  <div className="col-md-9">
    <h2>Samsung Galaxy with SnapDragon 980</h2>
    <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img className="d-block w-100" src="https://via.placeholder.com/250" alt="First slide" />
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src="https://via.placeholder.com/250" alt="Second slide" />
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src="https://via.placeholder.com/250" alt="Third slide" />
    </div>
  </div>
  <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Next</span>
  </a>
</div>
    {/* <img src="https://via.placeholder.com/250" className="card-img-top" alt="Listing" /> */}
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim iure doloribus dolorum dolores velit. Aliquam dolore in facilis nulla! Id ratione eligendi saepe quidem reprehenderit voluptatibus mollitia non unde asperiores.
    </p>
    <strong>Views: 124</strong> <strong>Favorite: 124</strong><br/>
    <buttom className="btn btn-success">Favorite this</buttom> 
    <buttom className="btn btn-danger mx-5">Report Product</buttom> 
  </div>
);

export default ProductItem;
