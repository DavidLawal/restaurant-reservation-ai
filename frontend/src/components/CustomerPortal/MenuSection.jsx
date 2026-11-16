import React from 'react';

const MenuSection = ({ menuItems, filters, onFilterChange, onAddToCart }) => {
  return (
    <div className="menu-section">
      <h2>Our Menu</h2>
      
      <div className="filters">
        <select 
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="starters">Starters</option>
          <option value="mains">Main Courses</option>
          <option value="desserts">Desserts</option>
          <option value="beverages">Beverages</option>
        </select>

        <select 
          value={filters.dietary}
          onChange={(e) => onFilterChange('dietary', e.target.value)}
        >
          <option value="all">All Dietary</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
        </select>

        <input
          type="text"
          placeholder="Search menu..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="menu-grid">
        {menuItems.map(item => (
          <div key={item.id} className="menu-item">
            <h4>{item.name}</h4>
            <div className="price">${item.price.toFixed(2)}</div>
            <p className="description">{item.description}</p>
            <div className="ingredients">
              {item.ingredients.join(', ')}
            </div>
            <div className="dietary-tags">
              {item.dietary.map(tag => (
                <span key={tag} className="dietary-tag">{tag}</span>
              ))}
            </div>
            <button 
              onClick={() => onAddToCart(item)}
              className="btn btn-primary"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;