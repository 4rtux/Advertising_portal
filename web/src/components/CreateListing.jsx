import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CreateListing = () => {
  const [form, setForm] = useState({"name": "", "price":"", "category_id": "1", "type": "new", "description": ""});
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    setSelectedImages(files);
  };

  const handleFormChange = (event) => {
    setForm({ ...form, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();const formData = new FormData();

    // Append additional data
    const { name, category_id, price, type, description } = form;
    formData.append('type', type);
    formData.append('description', description);
    formData.append('name', name);
    formData.append('category_id', category_id);
    formData.append('price', price);

    // Append images
    selectedImages.forEach((file, index) => {
      formData.append(`photos`, file); // Use a key like "images[]" for multiple files
    });

    try {
      const response = await fetch('http://localhost:4000/v1/user/create-listing', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`,
        },
      });

      const data = await response.json();

      if (data.status) {
        alert(data.data.message);
        navigate(`/account/view-listing/${data.data.listing.id}`); 
      } else {
        alert(data.data.message || 'An error occurred while uploading the listing');
      }
    }
    catch (error) {
      alert('An error occurred while uploading the listing');
      console.error('Error uploading listing:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit} className="p-3 border rounded">
        <div className="row">
          <div className="mb-3 col-md-8">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={form.name} 
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="text"
              className="form-control"
              id="price"
              value={form.price} 
              onChange={handleFormChange}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            type="text"
            className="form-control"
            id="description"
            value={form.description}
            onChange={handleFormChange}
            required
          ></textarea>
        </div>
        <div className="row">
          <div className="mb-3 col-md-4">
            <label htmlFor="category_id" className="form-label">Category</label>
            <select className="form-control" 
            onChange={handleFormChange}
            id="category_id"
            >
              <option value="1">Phone</option>
              <option value="2">Computer</option>
            </select>
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="type" className="form-label">Listing Type</label>
            <select className="form-control" 
            onChange={handleFormChange}
            id="type"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="photo" className="form-label">Image</label>
            <input
              type="file"
              accept="image/*"
              className='form-control'
              multiple
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="row">
            <h2>Selected Images:</h2>
            {selectedImages.map((file, index) => (
                <div key={index} className="col-md-3">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        style={{ width: 100, height: 100, objectFit: 'cover', margin: 5 }}
                    />
                    <p>{file.name}</p>
                </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Post Listing</button>
      </form>
    </div>
  );
};

export default CreateListing;

