// ============ CHECK ADMIN SESSION ============
function checkAdminSession() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const expiry = localStorage.getItem('adminSessionExpiry');
    
    if (!isLoggedIn || !expiry || Date.now() > parseInt(expiry)) {
        if (!window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-login.html';
        }
    }
}
checkAdminSession();

// ============ DETECT WHICH ADMIN PAGE WE'RE ON ============
const isRestaurantAdmin = window.location.pathname.includes('admin-restaurant.html');
const isMedicalAdmin = window.location.pathname.includes('admin-medical.html');

// ============ INITIALIZE DATABASES ============
function initRestaurantDatabase() {
    if (!localStorage.getItem('restaurantMenu')) {
        const defaultMenu = [
            { id: 1, name: "Grilled Lamb Chops", category: "Main Courses", price: 15000, description: "Herb-marinated lamb chops with mint sauce", image: "images/menu/lamb-chops.jpg", available: true, featured: true },
            { id: 2, name: "Royal Seafood Platter", category: "Main Courses", price: 25000, description: "Fresh lobster, prawns, calamari", image: "images/menu/seafood.jpg", available: true, featured: true },
            { id: 3, name: "Truffle Mushroom Pasta", category: "Pasta", price: 12000, description: "Handmade pasta with black truffle", image: "images/menu/pasta.jpg", available: true, featured: true },
            { id: 4, name: "Chocolate Lava Cake", category: "Desserts", price: 4000, description: "Warm chocolate cake with molten center", image: "images/menu/lava-cake.jpg", available: true, featured: false }
        ];
        localStorage.setItem('restaurantMenu', JSON.stringify(defaultMenu));
    }
    
    if (!localStorage.getItem('restaurantCategories')) {
        const defaultCategories = [
            { id: 1, name: "Appetizers", icon: "fa-utensils", itemCount: 0 },
            { id: 2, name: "Main Courses", icon: "fa-hamburger", itemCount: 0 },
            { id: 3, name: "Pasta", icon: "fa-utensil-spoon", itemCount: 0 },
            { id: 4, name: "Desserts", icon: "fa-ice-cream", itemCount: 0 },
            { id: 5, name: "Drinks", icon: "fa-wine-bottle", itemCount: 0 }
        ];
        localStorage.setItem('restaurantCategories', JSON.stringify(defaultCategories));
    }
    
    if (!localStorage.getItem('restaurantReservations')) {
        localStorage.setItem('restaurantReservations', JSON.stringify([]));
    }
}

function initMedicalDatabase() {
    if (!localStorage.getItem('medicalProducts')) {
        const defaultProducts = [
            { id: 1, name: "Patient Monitor", category: "Diagnostic Equipment", price: 850000, description: "Multi-parameter patient monitor", brand: "Mindray", stock: 10, warranty: 12, image: "images/medical/patient-monitor.jpg", specs: "7-inch touchscreen, ECG, SpO2, NIBP" },
            { id: 2, name: "Portable Ultrasound", category: "Diagnostic Equipment", price: 2500000, description: "Color doppler ultrasound", brand: "SonoScape", stock: 5, warranty: 24, image: "images/medical/ultrasound.jpg", specs: "15-inch LCD, 4D imaging" },
            { id: 3, name: "Surgical LED Light", category: "Surgical Equipment", price: 1200000, description: "Shadowless surgical light", brand: "Shanghai", stock: 8, warranty: 12, image: "images/medical/surgical-light.jpg", specs: "500W LED, adjustable intensity" }
        ];
        localStorage.setItem('medicalProducts', JSON.stringify(defaultProducts));
    }
    
    if (!localStorage.getItem('medicalCategories')) {
        const defaultCategories = [
            { id: 1, name: "Diagnostic Equipment", icon: "fa-stethoscope", itemCount: 0 },
            { id: 2, name: "Surgical Equipment", icon: "fa-syringe", itemCount: 0 },
            { id: 3, name: "Mobility Aids", icon: "fa-wheelchair", itemCount: 0 },
            { id: 4, name: "Lab Equipment", icon: "fa-microscope", itemCount: 0 },
            { id: 5, name: "PPE & Supplies", icon: "fa-shield-alt", itemCount: 0 },
            { id: 6, name: "Hospital Furniture", icon: "fa-bed", itemCount: 0 }
        ];
        localStorage.setItem('medicalCategories', JSON.stringify(defaultCategories));
    }
    
    if (!localStorage.getItem('medicalInquiries')) {
        localStorage.setItem('medicalInquiries', JSON.stringify([]));
    }
}

// Initialize appropriate database
if (isRestaurantAdmin) initRestaurantDatabase();
if (isMedicalAdmin) initMedicalDatabase();

// ============ RESTAURANT FUNCTIONS ============
if (isRestaurantAdmin) {
    function loadRestaurantDashboard() {
        const menu = JSON.parse(localStorage.getItem('restaurantMenu') || '[]');
        const categories = JSON.parse(localStorage.getItem('restaurantCategories') || '[]');
        const reservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]');
        
        document.getElementById('totalMenuItems').innerText = menu.length;
        document.getElementById('totalCategories').innerText = categories.length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayReservations = reservations.filter(r => r.date === today && r.status !== 'cancelled');
        document.getElementById('todayReservations').innerText = todayReservations.length;
        
        // Recent reservations
        const recent = reservations.slice(-5).reverse();
        const recentHtml = recent.map(r => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span><strong>${r.name}</strong> - ${r.guests} guests</span>
                <span>${r.date} at ${r.time}</span>
                <span class="status-badge status-${r.status}">${r.status}</span>
            </div>
        `).join('');
        document.getElementById('recentReservations').innerHTML = recent || '<p>No recent reservations</p>';
    }
    
    function loadMenuItems() {
        const menu = JSON.parse(localStorage.getItem('restaurantMenu') || '[]');
        const categories = JSON.parse(localStorage.getItem('restaurantCategories') || '[]');
        const filterCat = document.getElementById('categoryFilter')?.value || 'all';
        const searchTerm = document.getElementById('searchMenu')?.value.toLowerCase() || '';
        
        let filtered = menu;
        if (filterCat !== 'all') filtered = filtered.filter(item => item.category === filterCat);
        if (searchTerm) filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm));
        
        const container = document.getElementById('menuItemsGrid');
        if (!container) return;
        
        container.innerHTML = filtered.map(item => {
            const category = categories.find(c => c.name === item.category);
            return `
                <div class="item-card">
                    <div class="item-image">
                        <img src="${item.image}" onerror="this.src='https://placehold.co/400x300/1a1a2e/c9a03d?text=${item.name}'">
                    </div>
                    <div class="item-info">
                        <span class="item-category">${item.category}</span>
                        <h3>${item.name}</h3>
                        <p style="font-size:0.8rem; color:#ccc;">${item.description.substring(0, 60)}...</p>
                        <div class="item-price">${item.price.toLocaleString()} CFA</div>
                        <div>${item.featured ? '⭐ Featured' : ''} ${!item.available ? '❌ Out of Stock' : '✅ Available'}</div>
                    </div>
                    <div class="item-actions">
                        <button class="btn-secondary" onclick="editMenuItem(${item.id})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-danger" onclick="deleteMenuItem(${item.id})"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function loadRestaurantCategories() {
        const categories = JSON.parse(localStorage.getItem('restaurantCategories') || '[]');
        const menu = JSON.parse(localStorage.getItem('restaurantMenu') || '[]');
        
        // Update item counts
        categories.forEach(cat => {
            cat.itemCount = menu.filter(item => item.category === cat.name).length;
        });
        localStorage.setItem('restaurantCategories', JSON.stringify(categories));
        
        const container = document.getElementById('categoriesGrid');
        if (!container) return;
        
        container.innerHTML = categories.map(cat => `
            <div class="category-card">
                <div class="category-info">
                    <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
                    <div class="category-name">
                        <h3>${cat.name}</h3>
                        <p>${cat.itemCount} items</p>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn-secondary" onclick="editCategory(${cat.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteCategory(${cat.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        
        // Update filter dropdown
        const filterSelect = document.getElementById('categoryFilter');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="all">All Categories</option>' + 
                categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
        }
    }
    
    function loadReservations() {
        const reservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]');
        const statusFilter = document.getElementById('reservationStatusFilter')?.value || 'all';
        
        let filtered = reservations;
        if (statusFilter !== 'all') filtered = filtered.filter(r => r.status === statusFilter);
        
        const tbody = document.getElementById('reservationsTable');
        if (!tbody) return;
        
        tbody.innerHTML = filtered.map(res => `
            <tr>
                <td>${res.name}</td>
                <td>${res.phone}</td>
                <td>${res.date}</td>
                <td>${res.time}</td>
                <td>${res.guests}</td>
                <td><span class="status-badge status-${res.status}">${res.status}</span></td>
                <td>
                    <button class="btn-success" onclick="updateReservationStatus(${res.id}, 'confirmed')"><i class="fas fa-check"></i></button>
                    <button class="btn-danger" onclick="updateReservationStatus(${res.id}, 'cancelled')"><i class="fas fa-times"></i></button>
                </td>
            </tr>
        `).join('');
    }
    
    // Menu Item CRUD
    let currentMenuItemId = null;
    let tempMenuItemImage = null;
    
    window.openMenuModal = function() {
        currentMenuItemId = null;
        tempMenuItemImage = null;
        document.getElementById('menuModalTitle').innerText = 'Add Menu Item';
        document.getElementById('menuItemForm').reset();
        document.getElementById('itemImagePreview').innerHTML = '';
        
        // Load categories into dropdown
        const categories = JSON.parse(localStorage.getItem('restaurantCategories') || '[]');
        const categorySelect = document.getElementById('itemCategory');
        categorySelect.innerHTML = categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
        
        document.getElementById('menuModal').classList.add('active');
    };
    
    window.editMenuItem = function(id) {
        const menu = JSON.parse(localStorage.getItem('restaurantMenu') || '[]');
        const item = menu.find(i => i.id === id);
        if (!item) return;
        
        currentMenuItemId = id;
        document.getElementById('menuModalTitle').innerText = 'Edit Menu Item';
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemAvailable').value = item.available ? 'true' : 'false';
        document.getElementById('itemFeatured').value = item.featured ? 'true' : 'false';
        if (item.image) {
            document.getElementById('itemImagePreview').innerHTML = `<img src="${item.image}">`;
            tempMenuItemImage = item.image;
        }
        document.getElementById('menuModal').classList.add('active');
    };
    
    window.deleteMenuItem = function(id) {
        if (confirm('Delete this menu item?')) {
            let menu = JSON.parse(localStorage.getItem('restaurantMenu') || '[]');
            menu = menu.filter(i => i.id !== id);
            localStorage.setItem('restaurantMenu', JSON.stringify(menu));
            loadMenuItems();
            loadRestaurantCategories();
            showNotification('Item deleted successfully');
        }
    };
    
    document.getElementById('menuItemForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let menu = JSON.parse(localStorage.getItem('restaurantMenu') || '[]');
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const price = parseInt(document.getElementById('itemPrice').value);
        const description = document.getElementById('itemDescription').value;
        const available = document.getElementById('itemAvailable').value === 'true';
        const featured = document.getElementById('itemFeatured').value === 'true';
        const image = tempMenuItemImage || `images/menu/${name.toLowerCase().replace(/ /g, '-')}.jpg`;
        
        if (currentMenuItemId) {
            const index = menu.findIndex(i => i.id === currentMenuItemId);
            menu[index] = { ...menu[index], name, category, price, description, available, featured, image };
        } else {
            const newId = Date.now();
            menu.push({ id: newId, name, category, price, description, available, featured, image, createdAt: new Date().toISOString() });
        }
        
        localStorage.setItem('restaurantMenu', JSON.stringify(menu));
        closeMenuModal();
        loadMenuItems();
        loadRestaurantCategories();
        showNotification('Menu item saved successfully');
    });
    
    window.closeMenuModal = function() {
        document.getElementById('menuModal').classList.remove('active');
    };
    
    // Category CRUD
    window.openCategoryModal = function() {
        document.getElementById('categoryModalTitle').innerText = 'Add Category';
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        document.getElementById('categoryModal').classList.add('active');
    };
    
    window.editCategory = function(id) {
        const categories = JSON.parse(localStorage.getItem('restaurantCategories') || '[]');
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        
        document.getElementById('categoryModalTitle').innerText = 'Edit Category';
        document.getElementById('categoryId').value = cat.id;
        document.getElementById('categoryName').value = cat.name;
        document.getElementById('categoryIcon').value = cat.icon;
        document.getElementById('categoryModal').classList.add('active');
    };
    
    window.deleteCategory = function(id) {
        if (confirm('Delete this category? Items in this category will remain but become uncategorized.')) {
            let categories = JSON.parse(localStorage.getItem('restaurantCategories') || '[]');
            categories = categories.filter(c => c.id !== id);
            localStorage.setItem('restaurantCategories', JSON.stringify(categories));
            loadRestaurantCategories();
            showNotification('Category deleted');
        }
    };
    
    document.getElementById('categoryForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        let categories = JSON.parse(localStorage.getItem('restaurantCategories') || '[]');
        const id = parseInt(document.getElementById('categoryId').value) || Date.now();
        const name = document.getElementById('categoryName').value;
        const icon = document.getElementById('categoryIcon').value;
        
        if (document.getElementById('categoryId').value) {
            const index = categories.findIndex(c => c.id === id);
            categories[index] = { ...categories[index], name, icon };
        } else {
            categories.push({ id, name, icon, itemCount: 0 });
        }
        
        localStorage.setItem('restaurantCategories', JSON.stringify(categories));
        closeCategoryModal();
        loadRestaurantCategories();
        showNotification('Category saved');
    });
    
    window.closeCategoryModal = function() {
        document.getElementById('categoryModal').classList.remove('active');
    };
    
    // Image upload
    document.getElementById('itemImageInput')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                tempMenuItemImage = event.target.result;
                document.getElementById('itemImagePreview').innerHTML = `<img src="${tempMenuItemImage}">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('productImageInput')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                tempProductImage = event.target.result;
                document.getElementById('productImagePreview').innerHTML = `<img src="${tempProductImage}">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    window.updateReservationStatus = function(id, status) {
        let reservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]');
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            reservations[index].status = status;
            localStorage.setItem('restaurantReservations', JSON.stringify(reservations));
            loadReservations();
            showNotification(`Reservation ${status}`);
        }
    };
    
    window.saveRestaurantSettings = function() {
        const taxRate = document.getElementById('taxRate').value;
        const serviceCharge = document.getElementById('serviceCharge').value;
        localStorage.setItem('restaurantTaxRate', taxRate);
        localStorage.setItem('restaurantServiceCharge', serviceCharge);
        showNotification('Settings saved');
    };
    
    window.saveBusinessHours = function() {
        const openTime = document.getElementById('openTime').value;
        const closeTime = document.getElementById('closeTime').value;
        localStorage.setItem('restaurantOpenTime', openTime);
        localStorage.setItem('restaurantCloseTime', closeTime);
        showNotification('Business hours saved');
    };
}

// ============ MEDICAL FUNCTIONS ============
if (isMedicalAdmin) {
    function loadMedicalDashboard() {
        const products = JSON.parse(localStorage.getItem('medicalProducts') || '[]');
        const categories = JSON.parse(localStorage.getItem('medicalCategories') || '[]');
        const inquiries = JSON.parse(localStorage.getItem('medicalInquiries') || '[]');
        
        document.getElementById('totalProducts').innerText = products.length;
        document.getElementById('totalCategories').innerText = categories.length;
        document.getElementById('pendingInquiries').innerText = inquiries.filter(i => i.status === 'pending').length;
        
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
        document.getElementById('totalValue').innerText = totalValue.toLocaleString() + ' CFA';
        
        // Low stock alerts
        const lowStockThreshold = parseInt(localStorage.getItem('lowStockThreshold') || '5');
        const lowStock = products.filter(p => p.stock <= lowStockThreshold);
        const lowStockHtml = lowStock.map(p => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span><strong>${p.name}</strong></span>
                <span>Stock: ${p.stock} units</span>
                <span class="status-badge status-pending">Reorder soon</span>
            </div>
        `).join('');
        document.getElementById('lowStockAlerts').innerHTML = lowStockHtml || '<p>No low stock items</p>';
    }
    
    function loadMedicalProducts() {
        const products = JSON.parse(localStorage.getItem('medicalProducts') || '[]');
        const categories = JSON.parse(localStorage.getItem('medicalCategories') || '[]');
        const filterCat = document.getElementById('categoryFilter')?.value || 'all';
        const searchTerm = document.getElementById('searchProduct')?.value.toLowerCase() || '';
        
        let filtered = products;
        if (filterCat !== 'all') filtered = filtered.filter(p => p.category === filterCat);
        if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
        
        const container = document.getElementById('productsGrid');
        if (!container) return;
        
        container.innerHTML = filtered.map(product => {
            const category = categories.find(c => c.name === product.category);
            const lowStock = product.stock <= (parseInt(localStorage.getItem('lowStockThreshold') || '5'));
            return `
                <div class="item-card">
                    <div class="item-image">
                        <img src="${product.image}" onerror="this.src='https://placehold.co/400x300/1a1a2e/c9a03d?text=${product.name}'">
                    </div>
                    <div class="item-info">
                        <span class="item-category">${product.category}</span>
                        <h3>${product.name}</h3>
                        <p style="font-size:0.8rem; color:#ccc;">${product.description.substring(0, 60)}...</p>
                        <div class="item-price">${product.price.toLocaleString()} CFA</div>
                        <div>Stock: ${product.stock} units ${lowStock ? '⚠️ Low stock' : ''}</div>
                        <div>Warranty: ${product.warranty} months</div>
                    </div>
                    <div class="item-actions">
                        <button class="btn-secondary" onclick="editMedicalProduct(${product.id})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-danger" onclick="deleteMedicalProduct(${product.id})"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function loadMedicalCategories() {
        const categories = JSON.parse(localStorage.getItem('medicalCategories') || '[]');
        const products = JSON.parse(localStorage.getItem('medicalProducts') || '[]');
        
        categories.forEach(cat => {
            cat.itemCount = products.filter(p => p.category === cat.name).length;
        });
        localStorage.setItem('medicalCategories', JSON.stringify(categories));
        
        const container = document.getElementById('categoriesGrid');
        if (!container) return;
        
        container.innerHTML = categories.map(cat => `
            <div class="category-card">
                <div class="category-info">
                    <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
                    <div class="category-name">
                        <h3>${cat.name}</h3>
                        <p>${cat.itemCount} products</p>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn-secondary" onclick="editMedicalCategory(${cat.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteMedicalCategory(${cat.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        
        const filterSelect = document.getElementById('categoryFilter');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="all">All Categories</option>' + 
                categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
        }
    }
    
    function loadInquiries() {
        const inquiries = JSON.parse(localStorage.getItem('medicalInquiries') || '[]');
        const statusFilter = document.getElementById('inquiryStatusFilter')?.value || 'all';
        
        let filtered = inquiries;
        if (statusFilter !== 'all') filtered = filtered.filter(i => i.status === statusFilter);
        
        const tbody = document.getElementById('inquiriesTable');
        if (!tbody) return;
        
        tbody.innerHTML = filtered.map(inq => `
            <tr>
                <td>${inq.name}</td>
                <td>${inq.institution || '-'}</td>
                <td>${inq.phone}</td>
                <td>${inq.products?.substring(0, 50) || '-'}...</td>
                <td><span class="status-badge status-${inq.status}">${inq.status || 'pending'}</span></td>
                <td>
                    <button class="btn-success" onclick="updateInquiryStatus(${inq.id}, 'responded')"><i class="fas fa-reply"></i> Respond</button>
                    <button class="btn-secondary" onclick="updateInquiryStatus(${inq.id}, 'closed')"><i class="fas fa-check"></i> Close</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Product CRUD
    let currentProductId = null;
    let tempProductImage = null;
    
    window.openProductModal = function() {
        currentProductId = null;
        tempProductImage = null;
        document.getElementById('productModalTitle').innerText = 'Add Product';
        document.getElementById('productForm').reset();
        document.getElementById('productImagePreview').innerHTML = '';
        
        const categories = JSON.parse(localStorage.getItem('medicalCategories') || '[]');
        const categorySelect = document.getElementById('productCategory');
        categorySelect.innerHTML = categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
        
        document.getElementById('productModal').classList.add('active');
    };
    
    window.editMedicalProduct = function(id) {
        const products = JSON.parse(localStorage.getItem('medicalProducts') || '[]');
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        currentProductId = id;
        document.getElementById('productModalTitle').innerText = 'Edit Product';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productBrand').value = product.brand || '';
        document.getElementById('productSpecs').value = product.specs || '';
        document.getElementById('productWarranty').value = product.warranty || 12;
        if (product.image) {
            document.getElementById('productImagePreview').innerHTML = `<img src="${product.image}">`;
            tempProductImage = product.image;
        }
        document.getElementById('productModal').classList.add('active');
    };
    
    window.deleteMedicalProduct = function(id) {
        if (confirm('Delete this product?')) {
            let products = JSON.parse(localStorage.getItem('medicalProducts') || '[]');
            products = products.filter(p => p.id !== id);
            localStorage.setItem('medicalProducts', JSON.stringify(products));
            loadMedicalProducts();
            loadMedicalCategories();
            showNotification('Product deleted');
        }
    };
    
    document.getElementById('productForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let products = JSON.parse(localStorage.getItem('medicalProducts') || '[]');
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const price = parseInt(document.getElementById('productPrice').value);
        const description = document.getElementById('productDescription').value;
        const stock = parseInt(document.getElementById('productStock').value);
        const brand = document.getElementById('productBrand').value;
        const specs = document.getElementById('productSpecs').value;
        const warranty = parseInt(document.getElementById('productWarranty').value);
        const image = tempProductImage || `images/medical/${name.toLowerCase().replace(/ /g, '-')}.jpg`;
        
        if (currentProductId) {
            const index = products.findIndex(p => p.id === currentProductId);
            products[index] = { ...products[index], name, category, price, description, stock, brand, specs, warranty, image };
        } else {
            const newId = Date.now();
            products.push({ id: newId, name, category, price, description, stock, brand, specs, warranty, image, createdAt: new Date().toISOString() });
        }
        
        localStorage.setItem('medicalProducts', JSON.stringify(products));
        closeProductModal();
        loadMedicalProducts();
        loadMedicalCategories();
        showNotification('Product saved');
    });
    
    window.closeProductModal = function() {
        document.getElementById('productModal').classList.remove('active');
    };
    
    window.editMedicalCategory = function(id) {
        const categories = JSON.parse(localStorage.getItem('medicalCategories') || '[]');
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        
        document.getElementById('categoryModalTitle').innerText = 'Edit Category';
        document.getElementById('categoryId').value = cat.id;
        document.getElementById('categoryName').value = cat.name;
        document.getElementById('categoryIcon').value = cat.icon;
        document.getElementById('categoryModal').classList.add('active');
    };
    
    window.deleteMedicalCategory = function(id) {
        if (confirm('Delete this category?')) {
            let categories = JSON.parse(localStorage.getItem('medicalCategories') || '[]');
            categories = categories.filter(c => c.id !== id);
            localStorage.setItem('medicalCategories', JSON.stringify(categories));
            loadMedicalCategories();
            showNotification('Category deleted');
        }
    };
    
    window.updateInquiryStatus = function(id, status) {
        let inquiries = JSON.parse(localStorage.getItem('medicalInquiries') || '[]');
        const index = inquiries.findIndex(i => i.id === id);
        if (index !== -1) {
            inquiries[index].status = status;
            localStorage.setItem('medicalInquiries', JSON.stringify(inquiries));
            loadInquiries();
            showNotification(`Inquiry marked as ${status}`);
        }
    };
    
    document.getElementById('categoryForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        let categories = JSON.parse(localStorage.getItem('medicalCategories') || '[]');
        const id = parseInt(document.getElementById('categoryId').value) || Date.now();
        const name = document.getElementById('categoryName').value;
        const icon = document.getElementById('categoryIcon').value;
        
        if (document.getElementById('categoryId').value) {
            const index = categories.findIndex(c => c.id === id);
            categories[index] = { ...categories[index], name, icon };
        } else {
            categories.push({ id, name, icon, itemCount: 0 });
        }
        
        localStorage.setItem('medicalCategories', JSON.stringify(categories));
        closeCategoryModal();
        loadMedicalCategories();
        showNotification('Category saved');
    });
    
    window.closeCategoryModal = function() {
        document.getElementById('categoryModal').classList.remove('active');
    };
    
    window.saveShippingSettings = function() {
        const standard = document.getElementById('standardShipping').value;
        const express = document.getElementById('expressShipping').value;
        const freeThreshold = document.getElementById('freeShippingThreshold').value;
        localStorage.setItem('medicalStandardShipping', standard);
        localStorage.setItem('medicalExpressShipping', express);
        localStorage.setItem('medicalFreeShippingThreshold', freeThreshold);
        showNotification('Shipping settings saved');
    };
    
    window.saveStockSettings = function() {
        const threshold = document.getElementById('lowStockThreshold').value;
        localStorage.setItem('lowStockThreshold', threshold);
        showNotification('Stock alert settings saved');
    };
}

// ============ COMMON FUNCTIONS ============
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Page navigation
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');
        
        const titles = {
            dashboard: 'Dashboard',
            menu: 'Menu Management',
            categories: 'Categories',
            reservations: 'Reservations',
            orders: 'Orders',
            settings: 'Settings',
            products: 'Products',
            inquiries: 'Inquiries'
        };
        
        document.getElementById('pageTitle').innerText = titles[page] || page;
        
        // Load data based on page
        if (isRestaurantAdmin) {
            if (page === 'dashboard') loadRestaurantDashboard();
            if (page === 'menu') loadMenuItems();
            if (page === 'categories') loadRestaurantCategories();
            if (page === 'reservations') loadReservations();
        }
        if (isMedicalAdmin) {
            if (page === 'dashboard') loadMedicalDashboard();
            if (page === 'products') loadMedicalProducts();
            if (page === 'categories') loadMedicalCategories();
            if (page === 'inquiries') loadInquiries();
        }
    });
});

// Search and filter listeners
if (isRestaurantAdmin) {
    document.getElementById('searchMenu')?.addEventListener('input', loadMenuItems);
    document.getElementById('categoryFilter')?.addEventListener('change', loadMenuItems);
    document.getElementById('reservationStatusFilter')?.addEventListener('change', loadReservations);
}

if (isMedicalAdmin) {
    document.getElementById('searchProduct')?.addEventListener('input', loadMedicalProducts);
    document.getElementById('categoryFilter')?.addEventListener('change', loadMedicalProducts);
    document.getElementById('inquiryStatusFilter')?.addEventListener('change', loadInquiries);
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminSessionExpiry');
    window.location.href = 'admin-login.html';
});

// Initial load
if (isRestaurantAdmin) {
    document.addEventListener('DOMContentLoaded', () => {
        loadRestaurantDashboard();
        loadMenuItems();
        loadRestaurantCategories();
        loadReservations();
    });
}

if (isMedicalAdmin) {
    document.addEventListener('DOMContentLoaded', () => {
        loadMedicalDashboard();
        loadMedicalProducts();
        loadMedicalCategories();
        loadInquiries();
    });
}