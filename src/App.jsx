import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function ProductForm() {
  const url = 'https://3ae136ae-a5de-4351-85cc-4b56963af724-00-1bhn45hk2nnyl.sisko.replit.dev:3001';
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    origin: '',
    category: '', 
    hasSizes: false,
    sizes: [],
    stock:true
  });

  // List of product categories
  const categories = [
    'ادوات احتياطية مولدات',
    'ادوات احتياطية 5 كي في',
    'ادوات احتياطية كامة',
    'ادوات احتياطية زراعي',
    'ادوات احتياطية حاشوشة',
    'ادوات احتياطية ميشار',
    'ماطور غساللة',
    'ماطور ماء',
    'أخرى'
  ];

  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts(){
      const response = await axios.get(`${url}/api/products`);
      setProducts(response.data);
    }
    fetchProducts();
    
  } , [])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      handleImageChange(e);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSize = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, ''] });
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('الرجاء إدخال اسم المنتج');
      return false;
    }
    if (!formData.price) {
      alert('الرجاء إدخال سعر المنتج');
      return false;
    }
    if (!formData.description.trim()) {
      alert('الرجاء إدخال وصف المنتج');
      return false;
    }
    if (!formData.image) {
      alert('الرجاء تحميل صورة للمنتج');
      return false;
    }
    if (!formData.category) {
      alert('الرجاء اختيار فئة المنتج');
      return false;
    }

    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const response = await axios.post(`${url}/add/product`, formData);
      console.log(response.data);
      alert('تمت إضافة المنتج بنجاح!');
      // Reset form after successful submission
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        origin: '',
        category: '',
        hasSizes: false,
        sizes: [],
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة المنتج. الرجاء المحاولة مرة أخرى.');
    }
  }

  console.log(products)
  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="heading">إضافة منتج</h2>

        <div>
          <label className="label">اسم المنتج:</label>
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label">السعر (دينار عراقي):</label>
          <input
            className="input"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label">الوصف:</label>
          <textarea
            className="input"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">الصورة:</label>
          <input
            className="input"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">بلد المنشأ:</label>
          <input
            className="input"
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">الفئة:</label>
          <select
            className="input"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">اختر فئة المنتج</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <input
              type="checkbox"
              name="hasSizes"
              checked={formData.hasSizes}
              onChange={handleChange}
            />
            &nbsp;هل يحتوي على مقاسات؟
          </label>
        </div>

        {formData.hasSizes && (
          <div>
            <label className="label">المقاسات (بالبوصة):</label>
            {formData.sizes.map((size, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  className="size-input"
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  placeholder="مثال: 10x20"
                />
                <button
                  type="button"
                  className="size-button"
                  onClick={() => removeSize(index)}
                >
                  حذف
                </button>
              </div>
            ))}
            <button type="button" className="size-button" onClick={addSize}>
              إضافة مقاس
            </button>
          </div>
        )}
      </form>

      <hr />
      <h2>معاينة المنتج</h2>
      <div dir='rtl' className="product-container">
        <div className="product">
          {formData.image && <img src={formData.image} alt="Product" />}
          <hr />
          <p className="product-name">{formData.name || 'اسم المنتج'}</p>
          <p className="product-price">السعر: {formData.price || '0'} دينار عراقي</p>
          <p className="product-description">{formData.description || 'لا يوجد وصف'}</p>
          <p className="product-origin">بلد المنشأ: {formData.origin || 'غير محدد'}</p>
          <p className="product-category">الفئة: {formData.category || 'غير محددة'}</p>
          {formData.hasSizes && formData.sizes.length > 0 && (
            <div>
              <h4>المقاسات:</h4>
              <ul>
                {formData.sizes.map((size, i) => (
                  <li key={i}>{size}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button onClick={handleSubmit} className="button" type="button">
          إضافة المنتج
        </button>
      </div>
      <div className='products'>
        <h1>المنتجات</h1>
        {products.map((product, index) => (
          <div key={index} dir='rtl' className="product-container">
            <div className="product">
              {product.image && <img src={product.image} alt={product.name} />}
              <hr />
              <p className="product-name">{product.name || 'اسم المنتج'}</p>
              <p className="product-price">السعر: {product.price || '0'} دينار عراقي</p>
              <p className="product-description">{product.description || 'لا يوجد وصف'}</p>
              <p className="product-origin">بلد المنشأ: {product.origin || 'غير محدد'}</p>
              <p className="product-category">الفئة: {product.category || 'غير محددة'}</p>
              {product.hasSizes && product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4>المقاسات:</h4>
                  <ul>
                    {product.sizes.map((size, i) => (
                      <li key={i}>{size}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
       
      </div>
    </>
  );
}

export default ProductForm;