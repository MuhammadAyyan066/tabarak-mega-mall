const API_BASE = 'http://localhost:5000/api/products';
const AUTH_BASE = 'http://localhost:5000/api/auth';
const ORDERS_BASE = 'http://localhost:5000/api/orders';

let adminProducts = [];
let adminOrders = [];
let currentUploadedImageBase64 = "";

function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = "login.html";
}

function switchTab(tab) {
    if (tab === 'products') {
        document.getElementById('productsSection').classList.remove('hidden');
        document.getElementById('ordersSection').classList.add('hidden');
        document.getElementById('tabProductsBtn').className = "font-extrabold text-sm text-emerald-600 border-b-2 border-emerald-600 pb-2 flex items-center gap-2";
        document.getElementById('tabOrdersBtn').className = "font-bold text-sm text-slate-400 hover:text-slate-700 pb-2 flex items-center gap-2";
    } else {
        document.getElementById('productsSection').classList.add('hidden');
        document.getElementById('ordersSection').classList.remove('hidden');
        document.getElementById('tabOrdersBtn').className = "font-extrabold text-sm text-emerald-600 border-b-2 border-emerald-600 pb-2 flex items-center gap-2";
        document.getElementById('tabProductsBtn').className = "font-bold text-sm text-slate-400 hover:text-slate-700 pb-2 flex items-center gap-2";
        fetchOrders();
    }
}

async function fetchProducts() {
    try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        adminProducts = data;
        renderAdminTable(adminProducts);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

function renderAdminTable(items) {
    const tbody = document.getElementById('adminTableBody');
    document.getElementById('statTotalProducts').innerText = items.length;

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">No products found in inventory.</td></tr>`;
        return;
    }

    tbody.innerHTML = items.map(p => {
        const stockCount = p.stock !== undefined ? p.stock : 20;
        const stockBadge = stockCount <= 5 
            ? `<span class="bg-rose-100 text-rose-800 text-xs font-black px-2.5 py-1 rounded-md">🔴 Low Stock (${stockCount})</span>`
            : `<span class="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">🟢 ${stockCount} Units</span>`;

        return `
            <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
                <td class="py-3 px-6 flex items-center gap-3">
                    <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover bg-slate-100" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=150';">
                    <span class="font-bold text-slate-800">${p.name}</span>
                </td>
                <td class="py-3 px-6">
                    <span class="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">${p.category}</span>
                </td>
                <td class="py-3 px-6 font-bold text-emerald-800">Rs. ${p.price ? p.price.toLocaleString() : 0}</td>
                <td class="py-3 px-6 text-slate-400 line-through">${p.oldPrice ? 'Rs. ' + p.oldPrice.toLocaleString() : '-'}</td>
                <td class="py-3 px-6">${stockBadge}</td>
                <td class="py-3 px-6 text-right space-x-2">
                    <button onclick="editProduct('${p._id}')" class="p-2 text-slate-600 hover:text-emerald-600 transition"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct('${p._id}')" class="p-2 text-slate-600 hover:text-rose-600 transition"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

async function fetchOrders() {
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(ORDERS_BASE, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        adminOrders = await res.json();
        renderOrdersTable(adminOrders);
    } catch (err) {
        console.error("Order fetch error:", err);
    }
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    document.getElementById('statTotalOrders').innerText = orders.length;

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">No customer orders recorded yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => {
        const orderDate = new Date(o.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        const phoneClean = o.customerPhone ? o.customerPhone.replace(/[^0-9]/g, '') : '';
        const whatsappMsg = encodeURIComponent(`Assalam-o-Alaikum ${o.customerName || 'Customer'}, your Tabarak Mega Mall order #${o._id.slice(-6)} status is now: ${o.status.toUpperCase()}. Total Bill: Rs. ${o.totalAmount}. Thank you for shopping with us!`);

        return `
            <tr class="hover:bg-slate-50/80 transition border-b border-slate-100 text-xs">
                <td class="py-3 px-6">
                    <span class="font-mono font-bold text-slate-800">#${o._id.slice(-6)}</span>
                    <p class="text-[10px] text-slate-400 mt-0.5">${orderDate}</p>
                </td>
                <td class="py-3 px-6">
                    <p class="font-bold text-slate-800">${o.customerName || 'Guest'}</p>
                    <p class="text-slate-500">${o.customerPhone || '-'}</p>
                    <p class="text-[10px] text-slate-400 italic">${o.customerAddress || ''}, ${o.city || ''}</p>
                </td>
                <td class="py-3 px-6">
                    <div class="space-y-1">
                        ${o.items.map(i => `<p>• <strong>${i.name}</strong> x ${i.qty || i.quantity || 1}</p>`).join('')}
                    </div>
                </td>
                <td class="py-3 px-6 font-bold text-emerald-800 text-sm">Rs. ${o.totalAmount.toLocaleString()}</td>
                <td class="py-3 px-6">
                    <select onchange="updateOrderStatus('${o._id}', this.value)" class="px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase border ${
                        o.status === 'Delivered' || o.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        o.status === 'Dispatched' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                        o.status === 'Cancelled' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }">
                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>🟡 Pending</option>
                        <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>🔵 Dispatched</option>
                        <option value="Delivered" ${o.status === 'Delivered' || o.status === 'Completed' ? 'selected' : ''}>🟢 Delivered</option>
                        <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
                    </select>
                </td>
                <td class="py-3 px-6 text-right space-y-1">
                    <button onclick="printOrderInvoice('${o._id}')" class="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-bold px-2.5 py-1 rounded-lg transition text-[10px]">
                        <i class="fa-solid fa-print"></i> Print Receipt
                    </button>
                    ${phoneClean ? `
                        <a href="https://wa.me/92${phoneClean.startsWith('0') ? phoneClean.substring(1) : phoneClean}?text=${whatsappMsg}" target="_blank" class="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition text-[10px]">
                            <i class="fa-brands fa-whatsapp text-xs"></i> WhatsApp
                        </a>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}
async function updateOrderStatus(id, newStatus) {
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`${ORDERS_BASE}/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) fetchOrders();
    } catch (err) {
        alert("Failed to update status");
    }
}

function openProfileModal() {
    const user = JSON.parse(localStorage.getItem('adminUser')) || {};
    document.getElementById('profFullName').value = user.fullName || "Muhammad Ayyan";
    document.getElementById('profUsername').value = user.username || "admin";
    document.getElementById('profEmail').value = user.email || "admin@tabarak.com";
    document.getElementById('profPhone').value = user.phone || "03001234567";
    document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
}

async function saveProfileDetails(e) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const fullName = document.getElementById('profFullName').value.trim();
    const username = document.getElementById('profUsername').value.trim();
    const email = document.getElementById('profEmail').value.trim();
    const phone = document.getElementById('profPhone').value.trim();

    const btn = document.getElementById('profSaveBtn');
    btn.disabled = true;

    try {
        const res = await fetch(`${AUTH_BASE}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fullName, username, email, phone })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            alert("✅ Profile updated successfully!");
            closeProfileModal();
        } else {
            alert("❌ " + data.message);
        }
    } catch (err) {
        alert("❌ Server connection error!");
    } finally {
        btn.disabled = false;
    }
}

function toggleImageInputType() {
    const type = document.getElementById('imageSourceType').value;
    if (type === 'file') {
        document.getElementById('fileUploadContainer').classList.remove('hidden');
        document.getElementById('urlUploadContainer').classList.add('hidden');
    } else {
        document.getElementById('fileUploadContainer').classList.add('hidden');
        document.getElementById('urlUploadContainer').classList.remove('hidden');
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUploadedImageBase64 = e.target.result;
            document.getElementById('imagePreview').src = currentUploadedImageBase64;
        };
        reader.readAsDataURL(file);
    }
}

function openProductModal() {
    document.getElementById('modalTitle').innerText = "Add New Product";
    document.getElementById('productForm').reset();
    document.getElementById('editProductId').value = "";
    currentUploadedImageBase64 = "";
    document.getElementById('imagePreview').src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150";
    toggleImageInputType();
    document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

async function saveProduct(e) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const price = parseInt(document.getElementById('prodPrice').value);
    const rawOldPrice = document.getElementById('prodOldPrice').value;
    const oldPrice = rawOldPrice ? parseInt(rawOldPrice) : null;
    const sourceType = document.getElementById('imageSourceType').value;

    let finalImage = sourceType === 'file' 
        ? (currentUploadedImageBase64 || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500")
        : (document.getElementById('prodImg').value || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500");

    const payload = { name, category, price, oldPrice, stock: 20, image: finalImage };
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;

    try {
        let res = id 
            ? await fetch(`${API_BASE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) })
            : await fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });

        if (res.ok) {
            closeProductModal();
            fetchProducts();
        } else {
            const errData = await res.json();
            alert("❌ Error: " + errData.message);
        }
    } catch (err) {
        alert("❌ Failed to save product.");
    } finally {
        saveBtn.disabled = false;
    }
}

function editProduct(id) {
    const product = adminProducts.find(p => p._id === id);
    if (!product) return;

    document.getElementById('modalTitle').innerText = "Edit Product";
    document.getElementById('editProductId').value = product._id;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodOldPrice').value = product.oldPrice ? product.oldPrice : "";
    
    currentUploadedImageBase64 = product.image;
    document.getElementById('imagePreview').src = product.image;

    if (product.image && product.image.startsWith('data:image')) {
        document.getElementById('imageSourceType').value = 'file';
    } else {
        document.getElementById('imageSourceType').value = 'url';
        document.getElementById('prodImg').value = product.image;
    }

    toggleImageInputType();
    document.getElementById('productModal').classList.remove('hidden');
}

async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchProducts();
        } catch (err) {
            console.error("Delete Error:", err);
        }
    }
}

function filterAdminTable() {
    const query = document.getElementById('adminSearch').value.toLowerCase();
    const filtered = adminProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderAdminTable(filtered);
}
function printOrderInvoice(orderId) {
    const order = adminOrders.find(o => o._id === orderId);
    if (!order) return alert("Order details not found!");

    // Populate Invoice Fields
    document.getElementById('invNumber').innerText = `#${order._id.slice(-6).toUpperCase()}`;
    document.getElementById('invDate').innerText = new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('invCustName').innerText = order.customerName || 'Guest Customer';
    document.getElementById('invCustPhone').innerText = order.customerPhone || '-';
    document.getElementById('invCustAddress').innerText = `${order.customerAddress || ''}, ${order.city || 'Karianwala'}`;

    // Populate Items
    const itemsTbody = document.getElementById('invItemsBody');
    itemsTbody.innerHTML = order.items.map(i => {
        const qty = i.qty || i.quantity || 1;
        const total = (i.price || 0) * qty;
        return `
            <tr>
                <td class="py-2 px-3 font-bold text-slate-800">${i.name}</td>
                <td class="py-2 px-3 text-center font-semibold">${qty}</td>
                <td class="py-2 px-3 text-right">Rs. ${(i.price || 0).toLocaleString()}</td>
                <td class="py-2 px-3 text-right font-bold text-emerald-800">Rs. ${total.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    document.getElementById('invGrandTotal').innerText = `Rs. ${order.totalAmount.toLocaleString()}`;

    // Trigger Browser Print Dialogue
    window.print();
}
fetchProducts();
fetchOrders();