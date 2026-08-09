const API_PRODUCTS = 'http://localhost:5000/api/products';
const API_ORDERS = 'http://localhost:5000/api/orders';

// 50 Comprehensive Default Products with Optional Old Price
const defaultProducts = [
    // --- GROCERY & PANTRY ---
    { _id: 'g1', name: "Premium Cooking Oil (5L)", category: "grocery", price: 2450, oldPrice: 2600, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500" },
    { _id: 'g2', name: "Super Basmati Rice (5 Kg)", category: "grocery", price: 1850, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500" },
    { _id: 'g3', name: "Fine Wheat Flour Atta (10 Kg)", category: "grocery", price: 1350, oldPrice: 1450, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500" },
    { _id: 'g4', name: "Refined White Sugar (5 Kg)", category: "grocery", price: 720, image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500" },
    { _id: 'g5', name: "National Black Tea Supreme (950g)", category: "grocery", price: 1650, oldPrice: 1750, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500" },
    { _id: 'g6', name: "Shan Masala Combo Pack (5 Box)", category: "grocery", price: 650, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500" },
    { _id: 'g7', name: "Daal Chana Premium (1 Kg)", category: "grocery", price: 280, image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500" },
    { _id: 'g8', name: "Daal Moong Wash (1 Kg)", category: "grocery", price: 320, oldPrice: 350, image: "https://images.unsplash.com/photo-1585992227540-7048c1108034?w=500" },
    { _id: 'g9', name: "Iodized Table Salt Pack (800g)", category: "grocery", price: 60, image: "https://images.unsplash.com/photo-1607672632458-9fe566963463?w=500" },
    { _id: 'g10', name: "Nestle EveryDay Milk Powder (900g)", category: "grocery", price: 1890, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500" },
    { _id: 'g11', name: "Olper's Full Cream Milk UHT (1L)", category: "grocery", price: 290, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500" },
    { _id: 'g12', name: "Jam-e-Shirin Syrup (800ml)", category: "grocery", price: 380, oldPrice: 420, image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500" },
    { _id: 'g13', name: "Mitchell's Tomato Ketchup (1 Kg)", category: "grocery", price: 460, image: "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=500" },
    { _id: 'g14', name: "Young's Mayonnaise Pouch (500g)", category: "grocery", price: 390, image: "https://images.unsplash.com/photo-1585325701165-351af916e581?w=500" },
    { _id: 'g15', name: "Knorr Chicken Noodles (Pack of 6)", category: "grocery", price: 330, image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500" },

    // --- KITCHEN & CROCKERY ---
    { _id: 'k1', name: "Non-Stick Cookware Set (8 Pcs)", category: "kitchen", price: 8900, oldPrice: 9800, image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500" },
    { _id: 'k2', name: "Royal Dinner Set Glassware (24 Pcs)", category: "kitchen", price: 6500, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500" },
    { _id: 'k3', name: "Electric Kitchen Blender 3-in-1", category: "kitchen", price: 5400, oldPrice: 6000, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500" },
    { _id: 'k4', name: "Stainless Steel Hotpot Set (3 Pcs)", category: "kitchen", price: 4200, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" },
    { _id: 'k5', name: "Insulated Water Jug (14 Liters)", category: "kitchen", price: 2150, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500" },
    { _id: 'k6', name: "Tea Cups & Saucers Set (6 Persons)", category: "kitchen", price: 2800, image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500" },
    { _id: 'k7', name: "Kitchen Chef Knife Set (5 Pcs)", category: "kitchen", price: 1750, image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500" },
    { _id: 'k8', name: "Spice Storage Jars Rack (12 Pcs)", category: "kitchen", price: 2400, image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=500" },

    // --- FROZEN FOODS & SNACKS ---
    { _id: 'f1', name: "K&N's Chicken Nuggets (1 Kg)", category: "frozen", price: 1480, oldPrice: 1600, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500" },
    { _id: 'f2', name: "Dawn Frozen Paratha (Family Pack)", category: "frozen", price: 580, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500" },
    { _id: 'f3', name: "Menu Chicken Seekh Kabab (20 Pcs)", category: "frozen", price: 1120, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },
    { _id: 'f4', name: "Omore Vanilla Fudge Ice Cream (2L)", category: "frozen", price: 850, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500" },
    { _id: 'f5', name: "Crispy French Fries (1 Kg Pack)", category: "frozen", price: 640, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" },
    { _id: 'f6', name: "Lays Potato Chips Party Pack", category: "frozen", price: 360, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500" },
    { _id: 'f7', name: "Super Biscuits Value Box (12 Packs)", category: "frozen", price: 420, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500" },
    { _id: 'f8', name: "Dairy Milk Chocolate Celebration Box", category: "frozen", price: 1250, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500" },

    // --- COSMETICS & PERSONAL CARE ---
    { _id: 'c1', name: "Sunsilk Black Shine Shampoo (650ml)", category: "cosmetics", price: 920, image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500" },
    { _id: 'c2', name: "Lux Velvet Touch Soap (Pack of 4)", category: "cosmetics", price: 480, image: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=500" },
    { _id: 'c3', name: "Fair & Lovely Glowing Cream (100g)", category: "cosmetics", price: 340, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500" },
    { _id: 'c4', name: "Nivea Moisturizing Soft Lotion (300ml)", category: "cosmetics", price: 1150, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500" },
    { _id: 'c5', name: "Sensodyne Toothpaste Fluoride (150g)", category: "cosmetics", price: 390, image: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=500" },
    { _id: 'c6', name: "Dettol Antiseptic Liquid (500ml)", category: "cosmetics", price: 680, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500" },
    { _id: 'c7', name: "Gillette Mach3 Razor + 2 Cartridges", category: "cosmetics", price: 1450, image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=500" },
    { _id: 'c8', name: "Fogg Body Spray Fragrance (120ml)", category: "cosmetics", price: 650, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500" },
    { _id: 'c9', name: "Pond's Bright Beauty Face Wash (100g)", category: "cosmetics", price: 420, image: "https://images.unsplash.com/photo-1567928269937-aec41475b637?w=500" },

    // --- TOYS & KIDS ---
    { _id: 't1', name: "Rechargeable RC Stunt Car Toy", category: "toys", price: 2850, image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500" },
    { _id: 't2', name: "Educational Building Blocks (100 Pcs)", category: "toys", price: 1650, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500" },
    { _id: 't3', name: "Plush Teddy Bear Giant Toy (2 Feet)", category: "toys", price: 2200, image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500" },
    { _id: 't4', name: "Kids Doctor Set Play Kit", category: "toys", price: 950, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500" },
    { _id: 't5', name: "Remote Control Helicopter Toy", category: "toys", price: 3400, image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500" },

    // --- HOUSEHOLD & CLEANING ---
    { _id: 'h1', name: "Surf Excel Washing Powder (2 Kg)", category: "household", price: 1180, image: "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=500" },
    { _id: 'h2', name: "Harpic Toilet Cleaner Liquid (1L)", category: "household", price: 490, image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500" },
    { _id: 'h3', name: "Max Dishwash Liquid Bottle (750ml)", category: "household", price: 380, image: "https://images.unsplash.com/photo-1585842378087-320e4088a2e2?w=500" },
    { _id: 'h4', name: "Rose Petal Tissue Box (Pack of 3)", category: "household", price: 520, image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500" },
    { _id: 'h5', name: "Finis Insecticide Spray Bottle (600ml)", category: "household", price: 590, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500" }
];

let products = [];
let cart = [];

// Load Products from Express API
async function loadProducts() {
    try {
        const res = await fetch(API_PRODUCTS);
        if (res.ok) {
            const data = await res.json();
            products = (data && data.length > 0) ? data : defaultProducts;
        } else {
            products = defaultProducts;
        }
    } catch (err) {
        console.log("Server offline, using default 50 products list:", err);
        products = defaultProducts;
    }
    renderProducts(products);
}

function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    if(!grid) return;

    grid.innerHTML = items.map(p => {
        const imgSrc = p.image || p.img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
        
        // Optional Old Price Logic Check
        const oldPriceHTML = (p.oldPrice && p.oldPrice > 0) 
            ? `<span class="text-xs text-slate-400 line-through">Rs. ${p.oldPrice.toLocaleString()}</span>` 
            : '';

        return `
            <div class="product-card bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-200 transition flex flex-col justify-between">
                <div>
                    <span class="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-1 rounded-md uppercase">${p.category}</span>
                    <div class="overflow-hidden rounded-xl h-44 my-3 bg-slate-100">
                        <img src="${imgSrc}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition duration-300" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';">
                    </div>
                    <h3 class="font-bold text-slate-800 text-sm line-clamp-1">${p.name}</h3>
                    <p class="text-xs text-slate-500 mb-3">Guaranteed Fresh & Genuine</p>
                </div>
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-base font-black text-emerald-800">Rs. ${p.price ? p.price.toLocaleString() : 0}</span>
                        ${oldPriceHTML}
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})" class="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition">
                            + Add Cart
                        </button>
                        <a href="https://wa.me/923143492111?text=${encodeURIComponent('I want to order: ' + p.name)}" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition text-center flex items-center justify-center gap-1">
                            <i class="fa-brands fa-whatsapp"></i> Quick
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    const countEl = document.getElementById('totalProductsCount');
    if(countEl) countEl.innerText = items.length;
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cartItemsList');
    const count = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');

    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        if(list) list.innerHTML = `<p class="text-slate-400 text-center py-8">Your cart is currently empty.</p>`;
    } else {
        if(list) {
            list.innerHTML = cart.map(item => {
                total += item.price * item.qty;
                totalItems += item.qty;
                return `
                    <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                            <h4 class="font-bold text-slate-800">${item.name}</h4>
                            <span class="text-xs text-slate-500">Rs. ${item.price} x ${item.qty}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="font-black text-emerald-800">Rs. ${(item.price * item.qty).toLocaleString()}</span>
                            <button onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')" class="text-rose-500 hover:text-rose-700 font-bold">&times;</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    if(count) count.innerText = totalItems;
    if(totalEl) totalEl.innerText = `Rs. ${total.toLocaleString()}`;
}

function toggleCartModal() {
    document.getElementById('cartModal').classList.toggle('hidden');
}

function openCheckoutModal() {
    if (cart.length === 0) return alert('Cart is empty!');
    toggleCartModal();
    document.getElementById('checkoutModal').classList.remove('hidden');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.add('hidden');
}

// Online Delivery Checkout
async function submitOnlineOrder(e) {
    e.preventDefault();
    const customerName = document.getElementById('custName').value.trim();
    const customerPhone = document.getElementById('custPhone').value.trim();
    const customerAddress = document.getElementById('custAddress').value.trim();
    const city = document.getElementById('custCity').value.trim();

    const totalAmount = cart.reduce((acc, c) => acc + (c.price * c.qty), 0);
    const btn = document.getElementById('submitOrderBtn');

    btn.disabled = true;
    btn.innerText = "Submitting Order...";

    try {
        const res = await fetch(API_ORDERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName,
                customerPhone,
                customerAddress,
                city,
                items: cart,
                totalAmount
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert("🎉 Order placed successfully! Tabarak Mega Mall team will contact you shortly.");
            cart = [];
            updateCartUI();
            closeCheckoutModal();
        } else {
            alert("❌ Error: " + (data.message || "Failed to place order."));
        }
    } catch (err) {
        alert("❌ Connection error! Ensure your Express backend server is running.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Confirm & Submit Order`;
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) return alert('Cart is empty!');
    let text = "Hello Tabarak Mega Mall, I want to place an order:\n\n";
    let total = 0;
    cart.forEach(item => {
        text += `• ${item.name} x ${item.qty} = Rs. ${item.price * item.qty}\n`;
        total += item.price * item.qty;
    });
    text += `\n*Total Amount:* Rs. ${total}`;
    window.open(`https://wa.me/923143492111?text=${encodeURIComponent(text)}`, '_blank');
}

function filterCategory(cat) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => {
        btn.className = "cat-btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl";
    });
    if(event && event.target) {
        event.target.className = "cat-btn bg-emerald-700 text-white px-3 py-2 rounded-xl";
    }

    if (cat === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderProducts(filtered);
}

loadProducts();