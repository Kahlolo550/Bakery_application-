import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../../config/api';

function AddProduct({ token, showNotification }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const navigate = useNavigate();

  const uploadPhoto = async () => {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Photo upload failed');
    const data = await res.json();
    return data.url;
  };

  const submit = async () => {
    if (!name || !price || !category || !description || !photoFile) {
      showNotification('All fields including photo are required.', true);
      return;
    }

    try {
      const uploadedUrl = await uploadPhoto();

      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price,
          category,
          description,
          photo: uploadedUrl,
        }),
      });

      if (res.ok) {
        showNotification('✅ Product added successfully!');
        navigate('/retailer/products');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Failed to add product.', true);
      }
    } catch (err) {
      showNotification(err.message || 'Something went wrong.', true);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="text-success mb-4 text-center">
            <i className="fas fa-plus-circle me-2"></i>Add New Product
          </h4>

          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Chocolate Muffin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price (M)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 25.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Muffins, Bread, Cakes"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Brief description of the product"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Product Photo</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
          </div>

          <button className="btn btn-success w-100" onClick={submit}>
            <i className="fas fa-upload me-2"></i>Submit Product
          </button>

          <div className="text-center mt-3">
            <Link to="/retailer/products" className="text-decoration-none">
              <i className="fas fa-boxes me-2"></i>View My Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
