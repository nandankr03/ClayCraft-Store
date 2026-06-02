
    // ── Auth Guard ──
    if (localStorage.getItem('userRole') !== 'admin') {
      alert('Unauthorized! Admin access only.');
      window.location.href = 'admin-login.html';
    }

    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // ── Navigation Logic ──
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    let navHistory = ['dashboard'];

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navigateToSection(item.getAttribute('data-target'));
      });
    });

    function logout() {
      localStorage.removeItem('userRole');
      localStorage.removeItem('loggedInUser');
      window.location.href = 'index.html';
    }

    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    function navigateToSection(targetId, isBack = false) {
      // Update sidebar UI
      navItems.forEach(nav => nav.classList.remove('active'));
      const targetItem = Array.from(navItems).find(item => item.getAttribute('data-target') === targetId);
      if (targetItem) targetItem.classList.add('active');
      
      // Update content view
      viewSections.forEach(sec => sec.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
      if(window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
      
      // Handle History Tracking
      if (!isBack && navHistory[navHistory.length - 1] !== targetId) {
        navHistory.push(targetId);
      }
      
      // Update Back Arrow Visibility
      const backBtn = document.getElementById('adminBackBtn');
      if (targetId === 'dashboard') {
        backBtn.style.display = 'none';
        if (!isBack) navHistory = ['dashboard'];
      } else {
        backBtn.style.display = 'inline-flex';
      }

      // Auto-filter logic
      if (targetId === 'users') {
        document.getElementById('searchUser').value = '';
        renderUsers();
      } else if (targetId === 'products') {
        document.getElementById('searchProduct').value = '';
        renderProducts();
      } else if (targetId === 'pending-products') {
        renderPendingProducts();
      } else if (targetId === 'orders') {
        renderOrders();
      } else if (targetId === 'payments') {
        renderPayments();
      } else if (targetId === 'dashboard') {
        renderDashboard();
      }
    }

    function goBack() {
      if (navHistory.length > 1) {
        navHistory.pop(); // Remove current view
        const prev = navHistory[navHistory.length - 1];
        navigateToSection(prev, true);
      } else {
        navigateToSection('dashboard', true);
      }
    }

    // ── Mock Data Generation & Storage ──
    function initMockData() {
      // Users
      if (!localStorage.getItem('adminUsers')) {
        const users = [
          { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'Active' },
          { id: 'u2', name: 'Jane Smith', email: 'jane@artisans.com', role: 'artisan', status: 'Active' },
          { id: 'u3', name: 'Bob Wilson', email: 'bob@example.com', role: 'customer', status: 'Blocked' },
          { id: 'u4', name: 'Alice Brown', email: 'alice@claycraft.com', role: 'admin', status: 'Active' }
        ];
        localStorage.setItem('adminUsers', JSON.stringify(users));
      }
      
      // Orders
      if (!localStorage.getItem('adminOrders')) {
        const orders = [
          { id: 'ORD-1001', customer: 'John Doe', date: '2026-04-18', total: 4500, status: 'Pending' },
          { id: 'ORD-1002', customer: 'Emma Davis', date: '2026-04-17', total: 1250, status: 'Shipped' },
          { id: 'ORD-1003', customer: 'Michael Lee', date: '2026-04-16', total: 8900, status: 'Delivered' }
        ];
        localStorage.setItem('adminOrders', JSON.stringify(orders));
      }

      // Payments
      if (!localStorage.getItem('adminPayments')) {
        const payments = [
          { txnId: 'TXN-98213', orderId: 'ORD-1001', customer: 'John Doe', amount: 4500, method: 'Credit Card', status: 'Success' },
          { txnId: 'TXN-98214', orderId: 'ORD-1002', customer: 'Emma Davis', amount: 1250, method: 'UPI', status: 'Success' },
          { txnId: 'TXN-98215', orderId: 'ORD-1004', customer: 'Sarah Connor', amount: 3200, method: 'Net Banking', status: 'Failed' }
        ];
        localStorage.setItem('adminPayments', JSON.stringify(payments));
      }
      
      // Products (merge with existing customProducts if any)
      if (!localStorage.getItem('customProducts')) {
        const products = [
          { id: 'p1', name: 'Terracotta Vase', image: 'Images/DecorativeVase.jpg', price: 1299, stock: 15, status: 'Approved' },
          { id: 'p2', name: 'Sandstone Idol', image: 'Images/Sandstone Sculpture.jpg', price: 2499, stock: 5, status: 'Approved' }
        ];
        localStorage.setItem('customProducts', JSON.stringify(products));
      }
    }

    initMockData();

    // ── Render Functions ──

    function renderDashboard() {
      const users = JSON.parse(localStorage.getItem('adminUsers'));
      const orders = JSON.parse(localStorage.getItem('adminOrders'));
      const products = JSON.parse(localStorage.getItem('customProducts')).filter(p => p.status === 'Approved');
      
      const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total), 0);

      document.getElementById('statUsers').textContent = users.length;
      document.getElementById('statOrders').textContent = orders.length;
      document.getElementById('statRevenue').textContent = '₹ ' + revenue.toLocaleString('en-IN');
      document.getElementById('statProducts').textContent = products.length;

      // Activities
      const tbody = document.querySelector('#activitiesTable tbody');
      tbody.innerHTML = `
        <tr><td>Just now</td><td>New order #ORD-1004 placed</td><td><span class="badge badge-info">New</span></td></tr>
        <tr><td>2 hours ago</td><td>Payment TXN-98214 successful</td><td><span class="badge badge-success">Success</span></td></tr>
        <tr><td>5 hours ago</td><td>Jane Smith registered as Artisan</td><td><span class="badge badge-pending">Registered</span></td></tr>
      `;

      // Check for Pending Products Alert
      const allCustomProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
      const pendingCount = allCustomProducts.filter(p => p.status === 'Pending').length;
      if (pendingCount > 0) {
          // If a pending alert hasn't been shown recently, show it
          if (!sessionStorage.getItem('pendingAlertShown')) {
              setTimeout(() => {
                  alert(`There are ${pendingCount} new product(s) awaiting approval.`);
                  sessionStorage.setItem('pendingAlertShown', 'true');
              }, 500);
          }
      }
    }

    function renderUsers() {
      const users = JSON.parse(localStorage.getItem('adminUsers'));
      const query = document.getElementById('searchUser').value.toLowerCase();
      const filtered = users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
      
      const tbody = document.getElementById('usersTbody');
      tbody.innerHTML = filtered.map(u => `
        <tr>
          <td><strong>${u.name}</strong></td>
          <td>${u.email}</td>
          <td><span class="badge badge-info" style="text-transform:capitalize;">${u.role}</span></td>
          <td><span class="badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}">${u.status}</span></td>
          <td>
            <button class="btn-sm btn-edit" onclick="openUserEdit('${u.id}')">Edit</button>
            <button class="btn-sm btn-delete" onclick="toggleBlockUser('${u.id}')">${u.status === 'Active' ? 'Block' : 'Unblock'}</button>
            <button class="btn-sm btn-delete" onclick="deleteUser('${u.id}')" style="margin-left:5px;">Delete</button>
          </td>
        </tr>
      `).join('');
    }

    function renderProducts() {
      const products = JSON.parse(localStorage.getItem('customProducts')) || [];
      const query = document.getElementById('searchProduct').value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(query));
      
      const tbody = document.getElementById('productsTbody');
      tbody.innerHTML = filtered.map(p => `
        <tr>
          <td><img src="${p.image || 'Images/HandMadeClayPot.jpg'}" onerror="this.src='Images/HandMadeClayPot.jpg'" style="width:40px;height:40px;border-radius:6px;object-fit:cover;"></td>
          <td><strong>${p.name}</strong></td>
          <td>₹ ${Number(p.price).toLocaleString('en-IN')}</td>
          <td>${p.stock !== undefined ? p.stock : (p.quantity || 'N/A')}</td>
          <td><span class="badge ${p.status === 'Approved' ? 'badge-success' : (p.status === 'Pending' ? 'badge-pending' : 'badge-danger')}">${p.status === 'Approved' ? 'Approved' : (p.status === 'Pending' ? 'Pending' : 'Rejected')}</span></td>
          <td>${p.artisanName || p.artisan || 'Admin'}</td>
          <td>
            ${p.status === 'Pending' ? `
              <button class="btn-sm btn-edit" style="background: #dcfce7; color: #166534;" onclick="approveProduct('${p.id}')">Approve</button>
              <button class="btn-sm btn-delete" onclick="rejectProduct('${p.id}')" style="margin-left:5px;">Reject</button>
            ` : `
              <button class="btn-sm btn-edit" onclick="openProductEdit('${p.id}')">Edit</button>
              <button class="btn-sm btn-delete" onclick="deleteProduct('${p.id}')" style="margin-left:5px;">Delete</button>
            `}
          </td>
        </tr>
      `).join('');
    }

    function renderPendingProducts() {
      // Show only pending products
      const products = JSON.parse(localStorage.getItem('customProducts')) || [];
      const pending = products.filter(p => p.status && p.status.toLowerCase() === 'pending');
      
      const tbody = document.getElementById('pendingProductsTbody');
      if (pending.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">No pending products requiring approval.</td></tr>`;
        return;
      }
      tbody.innerHTML = pending.map(p => `
        <tr>
          <td><img src="${p.image || 'Images/HandMadeClayPot.jpg'}" onerror="this.src='Images/HandMadeClayPot.jpg'" style="width:40px;height:40px;border-radius:6px;object-fit:cover;"></td>
          <td><strong>${p.name}</strong></td>
          <td>₹ ${Number(p.price).toLocaleString('en-IN')}</td>
          <td>${p.stock !== undefined ? p.stock : (p.quantity || 'N/A')}</td>
          <td><span class="badge badge-pending">Pending</span></td>
          <td>${p.artisanName || p.artisan || 'Unknown Artisan'}</td>
          <td>
            <button class="btn-sm btn-edit" style="background: #dcfce7; color: #166534;" onclick="approveProduct('${p.id}')">Approve</button>
            <button class="btn-sm btn-delete" onclick="rejectProduct('${p.id}')" style="margin-left:5px;">Reject</button>
          </td>
        </tr>
      `).join('');
    }

    async function updateProductStatus(id, newStatus) {
      const products = JSON.parse(localStorage.getItem('customProducts')) || [];
      const idx = products.findIndex(p => String(p.id) === String(id));
      if (idx > -1) {
        products[idx].status = newStatus;
        localStorage.setItem('customProducts', JSON.stringify(products));

        // Create an in-app notification for the artisan
        const notifications = JSON.parse(localStorage.getItem('artisanNotifications')) || [];
        notifications.push({
            artisanEmail: products[idx].artisanEmail || products[idx].artisanName,
            message: `Your product '${products[idx].name}' has been ${newStatus} successfully!`,
            read: false,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('artisanNotifications', JSON.stringify(notifications));

        // Call Backend API
        try {
            await fetch('http://localhost:5000/api/notify-product-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    artisanEmail: products[idx].artisanEmail || products[idx].artisanName,
                    productName: products[idx].name,
                    status: newStatus
                })
            });
        } catch (e) {
            console.log("Backend notification failed", e);
        }

        renderProducts();
        renderPendingProducts();
        renderDashboard();
        alert(`Product ${newStatus} successfully.`);
      }
    }

    function approveProduct(id) {
        if(confirm('Are you sure you want to approve this product? It will be visible to customers.')) {
            updateProductStatus(id, 'Approved');
        }
    }

    function rejectProduct(id) {
        if(confirm('Are you sure you want to reject this product?')) {
            updateProductStatus(id, 'Rejected');
        }
    }

    function renderOrders() {
      const orders = JSON.parse(localStorage.getItem('adminOrders'));
      const tbody = document.getElementById('ordersTbody');
      tbody.innerHTML = orders.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.customer}</td>
          <td>${o.date}</td>
          <td>₹ ${o.total.toLocaleString('en-IN')}</td>
          <td>
            <select class="status-dropdown" onchange="updateOrderStatus('${o.id}', this.value)" ${o.status === 'Cancelled' ? 'disabled' : ''}>
              <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
              <option value="Shipped" ${o.status==='Shipped'?'selected':''}>Shipped</option>
              <option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option>
              <option value="Cancelled" ${o.status==='Cancelled'?'selected':''}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="btn-sm btn-delete" onclick="updateOrderStatus('${o.id}', 'Cancelled')" ${o.status === 'Cancelled' ? 'disabled' : ''}>Cancel</button>
          </td>
        </tr>
      `).join('');
    }

    function renderPayments() {
      const payments = JSON.parse(localStorage.getItem('adminPayments'));
      const tbody = document.getElementById('paymentsTbody');
      tbody.innerHTML = payments.map(p => `
        <tr>
          <td><strong>${p.txnId}</strong></td>
          <td>${p.orderId}</td>
          <td>${p.customer}</td>
          <td>₹ ${p.amount.toLocaleString('en-IN')}</td>
          <td>${p.method}</td>
          <td><span class="badge ${p.status === 'Success' ? 'badge-success' : 'badge-danger'}">${p.status}</span></td>
        </tr>
      `).join('');
    }

    // ── Action Handlers ──

    // Users
    function openUserEdit(id) {
      const users = JSON.parse(localStorage.getItem('adminUsers'));
      const user = users.find(u => u.id === id);
      document.getElementById('editUserId').value = id;
      document.getElementById('editUserName').value = user.name;
      document.getElementById('editUserRole').value = user.role;
      document.getElementById('userModal').classList.add('active');
    }
    function handleUserSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('editUserId').value;
      let users = JSON.parse(localStorage.getItem('adminUsers'));
      const index = users.findIndex(u => u.id === id);
      users[index].name = document.getElementById('editUserName').value;
      users[index].role = document.getElementById('editUserRole').value;
      localStorage.setItem('adminUsers', JSON.stringify(users));
      closeModal('userModal');
      renderUsers();
      renderDashboard();
    }
    function toggleBlockUser(id) {
      let users = JSON.parse(localStorage.getItem('adminUsers'));
      const index = users.findIndex(u => u.id === id);
      users[index].status = users[index].status === 'Active' ? 'Blocked' : 'Active';
      localStorage.setItem('adminUsers', JSON.stringify(users));
      renderUsers();
    }
    function deleteUser(id) {
      if(!confirm('Are you sure you want to delete this user?')) return;
      let users = JSON.parse(localStorage.getItem('adminUsers')).filter(u => u.id !== id);
      localStorage.setItem('adminUsers', JSON.stringify(users));
      renderUsers();
      renderDashboard();
    }

    // Products
    function openProductModal() {
      document.getElementById('productForm').reset();
      document.getElementById('prodId').value = '';
      document.getElementById('productModalTitle').textContent = 'Add New Product';
      document.getElementById('productModal').classList.add('active');
    }
    function openProductEdit(id) {
      const products = JSON.parse(localStorage.getItem('customProducts'));
      const product = products.find(p => String(p.id) === String(id));
      document.getElementById('prodId').value = product.id;
      document.getElementById('prodName').value = product.name;
      document.getElementById('prodArtisan').value = product.artisanName || product.artisan || 'Admin';
      document.getElementById('prodImage').value = product.image;
      document.getElementById('prodPrice').value = product.price;
      document.getElementById('prodStock').value = product.stock || product.quantity || 0;
      document.getElementById('prodDesc').value = product.description || '';
      document.getElementById('productModalTitle').textContent = 'Edit Product';
      document.getElementById('productModal').classList.add('active');
    }
    function handleProductSubmit(e) {
      e.preventDefault();
      let products = JSON.parse(localStorage.getItem('customProducts')) || [];
      const id = document.getElementById('prodId').value;
      const productData = {
        name: document.getElementById('prodName').value,
        artisanName: document.getElementById('prodArtisan').value,
        image: document.getElementById('prodImage').value,
        price: Number(document.getElementById('prodPrice').value),
        stock: Number(document.getElementById('prodStock').value),
        description: document.getElementById('prodDesc').value,
        status: 'approved'
      };

      if (id) {
        const idx = products.findIndex(p => String(p.id) === String(id));
        products[idx] = { ...products[idx], ...productData };
      } else {
        productData.id = 'prod-' + Date.now();
        productData.artisan = productData.artisanName;
        products.push(productData);
      }
      
      localStorage.setItem('customProducts', JSON.stringify(products));
      closeModal('productModal');
      renderProducts();
      renderDashboard();
    }
    function deleteProduct(id) {
      if(!confirm('Delete this product?')) return;
      let products = JSON.parse(localStorage.getItem('customProducts')).filter(p => String(p.id) !== String(id));
      localStorage.setItem('customProducts', JSON.stringify(products));
      renderProducts();
      renderDashboard();
    }

    // Orders
    function updateOrderStatus(id, newStatus) {
      let orders = JSON.parse(localStorage.getItem('adminOrders'));
      const index = orders.findIndex(o => o.id === id);
      orders[index].status = newStatus;
      localStorage.setItem('adminOrders', JSON.stringify(orders));
      renderOrders();
    }

    // Initialize ALL
    renderDashboard();
    renderUsers();
    renderProducts();
    renderOrders();
    renderPayments();

  