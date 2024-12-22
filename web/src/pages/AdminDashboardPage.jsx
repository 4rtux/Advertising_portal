import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const token = Cookies.get('userToken');
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/v1/administrator/create-category`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: category,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (!data.status) {
        alert(data.data.message);
        return;
      }
      else{
        alert('Category created successfully');
        setCategories([...categories, data.data]);
        setCategory('');
      }
    });
  }

  useEffect(() => {
    console.log("Hello world 2")
    // fetch data from API
    fetch(`http://localhost:4000/v1/administrator/dashboard`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      if (!data.status) {
        return;
      }    
      else{
        console.log(data.data);
        setCategories(data.data.categories);
        setUsers(data.data.users);
      }
    });
    // setMyListings(data)
  }, []);

  return (
    <div> 
      <AdminNavbar />      
      <div className="container mt-4">
        <div className='row'>
          <div className='col-md-8'>
          <h3>Users</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Full name</th>
                    <th scope="col">email</th>
                    <th scope="col">Location</th>
                    <th scope="col">Reports</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((listing) => (
                    <tr key={listing.id}>
                      <td>{listing.first_name} {listing.last_name}</td>
                      <td>{listing.email}</td>
                      <td>{listing.location}</td>
                      <td>{}</td>
                      <td>{listing.status}</td>
                      <td><Link to={`/admin/user/${listing.id}`} className="btn btn-success"> View</Link> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          <div className='col-md-4'>
          <h3>Create category</h3>
          <form onSubmit={handleSubmit} className='mb-5'>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input type="text" className="form-control" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
            <h3>Categories</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default AdminDashboardPage;
