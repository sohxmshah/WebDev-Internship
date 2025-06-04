let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
          
// DOM Loaded
document.addEventListener('DOMContentLoaded', function() {
              renderProducts();
              updateDashboard();
});
          
// Modal Functions
function openModal() {
              document.getElementById('productModal').style.display = 'flex';
}
          
function closeModal() {
              document.getElementById('productModal').style.display = 'none';
              resetForm();
}
          
// Product Functions
function addProduct() {
            const product = {
                  id: Date.now(),
                  name: document.getElementById('product-name').value,
                  description: document.getElementById('product-desc').value,
                  price: parseFloat(document.getElementById('product-price').value),
                  quantity: parseInt(document.getElementById('product-quantity').value),
                  minStock: parseInt(document.getElementById('product-min').value)
            };
              
            inventory.push(product);
            saveInventory();
            renderProducts();
            closeModal();
            updateDashboard();
        }
          
function saveInventory() {
              localStorage.setItem('inventory', JSON.stringify(inventory));
}
          
function renderProducts() {
              const container = document.getElementById('product-list');
              
              if (inventory.length === 0) {
                  container.innerHTML = `
                      <div class="empty-state">
                          <h3>No Products Found</h3>
                          <p>Add your first product to get started</p>
                          <button class="btn btn-primary" onclick="openModal()">Add Product</button>
                      </div>
                  `;
                  return;
              }
              
              container.innerHTML = '<div class="products-grid" id="products-container"></div>';
              const productsContainer = document.getElementById('products-container');
              
              inventory.forEach(product => {
                  const isLowStock = product.quantity < product.minStock;
                  const minStockClass = isLowStock ? 'warning' : '';
                  
                  const card = document.createElement('div');
                  card.className = `product-card ${isLowStock ? 'low-stock' : ''}`;
                  card.innerHTML = `
                      <h3>${product.name}</h3>
                      <p class="description">${product.description || 'No description'}</p>
                      <p class="price">$${product.price.toFixed(2)}</p>
                      <div class="quantity">
                          <button class="qty-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                          <span>${product.quantity}</span>
                          <button class="qty-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                      </div>
                      <p class="min-stock ${minStockClass}">Min Stock: ${product.minStock}</p>
                      <div class="product-actions">
                          <button class="btn btn-primary" onclick="updateQuantity(${product.id}, 10)">+10</button>
                          <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                      </div>
                  `;
                  productsContainer.appendChild(card);
              });
        }
          
function updateQuantity(id, change) {
              const product = inventory.find(p => p.id === id);
              if (product) {
                  product.quantity += change;
                  if (product.quantity < 0) product.quantity = 0;
                  saveInventory();
                  renderProducts();
                  updateDashboard();
              }
}
          
function deleteProduct(id) {
              if (confirm('Are you sure you want to delete this product?')) {
                  inventory = inventory.filter(p => p.id !== id);
                  saveInventory();
                  renderProducts();
                  updateDashboard();
              }
}
          
function updateDashboard() {
              document.getElementById('total-products').textContent = inventory.length;
              
              const lowStockCount = inventory.filter(p => p.quantity < p.minStock).length;
              document.getElementById('low-stock').textContent = lowStockCount;
              
              const totalValue = inventory.reduce((sum, p) => sum + (p.price * p.quantity), 0);
              document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
}
          
function resetForm() {
              document.getElementById('product-name').value = '';
              document.getElementById('product-desc').value = '';
              document.getElementById('product-price').value = '';
              document.getElementById('product-quantity').value = '';
              document.getElementById('product-min').value = '';
}
