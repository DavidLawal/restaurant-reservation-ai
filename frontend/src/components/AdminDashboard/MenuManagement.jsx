import React from 'react';

const MenuManagement = ({ 
  menuItems, 
  onEditItem, 
  onDeleteItem, 
  onShowAddForm 
}) => {
  return (
    <div className="admin-section">
      <div className="section-header">
        <h3>Menu Items</h3>
        <button 
          onClick={onShowAddForm}
          className="btn btn-primary"
        >
          Add New Item
        </button>
      </div>

      <div className="menu-items-admin">
        {menuItems.map(item => (
          <div key={item.id} className="admin-menu-item">
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)} • {item.category}</p>
              <p>{item.description}</p>
              <div className="dietary-tags">
                {item.dietary.map(tag => (
                  <span key={tag} className="dietary-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="item-actions">
              <button 
                onClick={() => onEditItem(item)}
                className="btn btn-secondary"
              >
                Edit
              </button>
              <button 
                onClick={() => onDeleteItem(item.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;