
import React from 'react';

const ProductItem = () => (
  <div className="col-md-9">
    <h2>Samsung Galaxy with SnapDragon 980</h2>
    
    <img src="https://via.placeholder.com/250" className="card-img-top" alt="Listing" />
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim iure doloribus dolorum dolores velit. Aliquam dolore in facilis nulla! Id ratione eligendi saepe quidem reprehenderit voluptatibus mollitia non unde asperiores.
    </p>
    <strong>Views: 124</strong> <strong>Favorite: 124</strong><br/>
    <buttom className="btn btn-success">Favorite this</buttom> 
    <buttom className="btn btn-danger mx-5">Report Product</buttom> 
  </div>
);

export default ProductItem;
