/* ==========================================
   1. GLOBAL CONFIG & DATA
   ========================================== */
const SUPABASE_URL = "https://frjcefugnvitexxcated.supabase.co";
const SUPABASE_KEY = "sb_publishable_iymHBHXzWCXmXI4yUfQ_XQ__5EW47HJ";
const AI_KEY = "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";
let sb = null;
try { sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch(e) { console.error("DB Error"); }

let cart = [], selectedItem = null, selectedQty = 1, orderType = "", tableNum = "", userAddress = "", delCharge = 0, chkStep = 1, dealChoices = [], currentFlavorStep = 0, isQRScan = false, kitchenInterval = null, secretClickCount = 0, aiChatHistory = [];
let currentKitchenFilter = 'ALL';

const menuData = {
    "Starter 🍟": [
        {name: "Plain Fries", price: {Reg: 230, Large: 300}}, 
        {name: "Loaded Fries", price: 599}, 
        {name: "Pizza Fries", price: 720}, 
        {name: "Dragon Shots", price: 399}, 
        {name: "Oven Baked Wings", price: {Reg: 399, Large: 780}}, 
        {name: "Peri-Peri Wings", price: {M: 399, L: 780}}, 
        {name: "Hot Wings", price: {M: 399, L: 780}}, 
        {name: "Honey Chili Wings", price: {M: 449, L: 880}}, 
        {name: "Cheese Sticks", price: 449}, 
        {name: "Meat Sticks", price: 449}, 
        {name: "Nuggets", price: {M: 350, L: 650}}
    ],
    "Sandwich 🥪": [
        {name: "Health Harvest", price: 599}, 
        {name: "Khameera Sandwich", price: 699}, 
        {name: "Club Sandwich", price: 599}
    ],
    "Fried Burger 🍔": [
        {name: "Chicken Patty Burger", price: 299}, 
        {name: "Zinger Burger", price: 420}, 
        {name: "Mighty Burger", price: 699}, 
        {name: "Chipotle Burger", price: 649}, 
        {name: "Crispy Jalapeno", price: 549}, 
        {name: "Stuff Jalapeno", price: 649}
    ],
    "Grilled Burger ♨️": [
        {name: "CM Grilled", price: 499}, 
        {name: "Smokey Grilled", price: 550}, 
        {name: "Peri Peri Grilled", price: 749}, 
        {name: "Drizzler X", price: 749}, 
        {name: "Jalapeno Blaze", price: 749}, 
        {name: "Mexi Fiesta", price: 749}
    ],
    "Pan Pizza 🍕": [
        {name: "Chicken Tikka", price: {S:499, M:999, L:1549}}, 
        {name: "Chicken Fajita", price: {S:499, M:999, L:1549}}, 
        {name: "Chicken Supreme", price: {S:499, M:999, L:1549}}, 
        {name: "Cheese Lover", price: {S:499, M:999, L:1549}}, 
        {name: "Veg Lover", price: {S:499, M:999, L:1549}}, 
        {name: "Sicilian Pizza", price: {S:499, M:999, L:1549}}
    ],
    "Premium Pizza 🌟": [
        {name: "BBQ Pizza", price: {M:1199, L:1699}}, 
        {name: "Creamy Dreamy", price: {M:1199, L:1699}}, 
        {name: "OvenX Special Premium", price: {M:1199, L:1699}}, 
        {name: "Bonfire Pizza", price: {M:1199, L:1699}}
    ],
    "Deep Dish Pizza 🍲": [
        {name: "Mild Butter", price: {M:1749, L:2449}}, 
        {name: "OvenX Special Deep Dish", price: {M:1749, L:2449}}
    ],
    "Extreme Pizza 🌶️": [
        {name: "Extreme Peri Peri", price: {M:1499, L:2049}}, 
        {name: "Extreme Flaming Kabab", price: {M:1499, L:2049}}, 
        {name: "Crispy Extreme", price: {M:1499, L:2049}}
    ],
    "Craft My Own Pizza 🎨": [
        {name: "Kabab Crust", price: {Med: 1399, Large: 1799}}, 
        {name: "Crown Crust", price: {Med: 1399, Large: 1799}}, 
        {name: "Cheese Crust", price: {Med: 1399, Large: 1799}}, 
        {name: "Crusti Thin", price: 1699}
    ],
    "Platters 🍱": [
        {name: "Khameera Sandwich Platter", price: 699}, 
        {name: "Calzone Platter", price: 899}, 
        {name: "Behari Platter", price: 949}
    ],
    "Pasta 🍝": [
        {name: "Alfredo Pasta", price: 699}, 
        {name: "OvenX Flaming Pasta", price: 650}, 
        {name: "Fire Kissed Pasta", price: 699}, 
        {name: "X-Special Pasta", price: 749}
    ],
    "Wraps & Rolls 🌯": [
        {name: "Chipotle Wrap", price: 699}, 
        {name: "BBQ Wrap", price: 599}, 
        {name: "Donar Kabab", price: 749}, 
        {name: "Crunch Wrap", price: 449}, 
        {name: "Zingeratha Roll", price: 449}, 
        {name: "Paratha Roll", price: 449}, 
        {name: "Malai Roll", price: 449}, 
        {name: "Behari Roll", price: 749}, 
        {name: "Peri Peri Wrap", price: 749}
    ],
    "Bar Menu 🥤": [
        {name: "Coke Buddy", price: 130}, 
        {name: "Sprite Buddy", price: 130}, 
        {name: "Coke 1 Liter", price: 190}, 
        {name: "Next Cola 1 Liter", price: 170}, 
        {name: "Coke 1.5L", price: 230}, 
        {name: "Sprite 1.5L", price: 230}, 
        {name: "Water Small", price: 99}, 
        {name: "Water Large", price: 170}
    ]
};

// Create a combined category for Family Feast and generic deals
menuData["Pan/Premium"] = [...menuData["Pan Pizza 🍕"], ...menuData["Premium Pizza 🌟"]];

// --- COMPLETE DEALS DATA ---
const dealsData = [
    { name: "Midnight Deal 1", desc: "2x Med Extreme Pizzas + 1.5L Drink", price: 2699, badge: "HOT DEAL", flavorsNeeded: [{label: "Pizza 1", cat: "Extreme Pizza 🌶️"}, {label: "Pizza 2", cat: "Extreme Pizza 🌶️"}], fixedItems: ["1.5L Soft Drink"] },
    { name: "Midnight Deal 2", desc: "1x Large wings + 2x Large Pan Pizzas + 1.5L Drink", price: 3249, badge: "SAVER", flavorsNeeded: [{label: "Pizza 1", cat: "Pan Pizza 🍕"}, {label: "Pizza 2", cat: "Pan Pizza 🍕"}], fixedItems: ["1x Large Hot Wings", "1.5L Soft Drink"] },
    { name: "Midnight Deal 3", desc: "1x Large wings + 2x Large Premium Pizzas + 1.5L Drink", price: 3649, badge: "PREMIUM", flavorsNeeded: [{label: "Pizza 1", cat: "Premium Pizza 🌟"}, {label: "Pizza 2", cat: "Premium Pizza 🌟"}], fixedItems: ["1x Large Hot Wings", "1.5L Soft Drink"] },
    { name: "Midnight Deal 4", desc: "1x Med Extreme Pizza + 1x Large Extreme Pizza + 1.5L Drink", price: 3149, badge: "MIX DEAL", flavorsNeeded: [{label: "Medium Pizza", cat: "Extreme Pizza 🌶️"}, {label: "Large Pizza", cat: "Extreme Pizza 🌶️"}], fixedItems: ["1.5L Soft Drink"] },
    { name: "Family Feast", desc: "2 Med Pizzas + 2 Zingers + 1L Drink + 6 Wings", price: 2299, badge: "FAMILY", flavorsNeeded: [{label: "Pizza 1", cat: "Pan/Premium"}, {label: "Pizza 2", cat: "Pan/Premium"}], fixedItems: ["2x Zinger Burgers", "1L Drink", "6x Wings"] },
    { name: "Extreme Buddy", desc: "1 Medium Extreme Pizza + Free 1L Drink", price: 1449, badge: "BEST SELLER", flavorsNeeded: [{label: "Pizza Flavor", cat: "Extreme Pizza 🌶️"}], fixedItems: ["1L Drink"] },
    { name: "Burger Deal 1", desc: "2 Zingers + 1 Reg Fries + 2 Drinks", price: 999, badge: "DELIVERY", fixedItems: ["2x Zinger Burgers", "1x Regular Fries", "2x Drinks"] },
    { name: "Burger Deal 2", desc: "1 Zinger + 1 Reg Fries + 1 345ml Drink + 2 Wings", price: 990, badge: "DELIVERY", fixedItems: ["1x Zinger Burger", "1x Regular Fries", "1x 345ml Buddy Drink", "2x Pcs Wings"] },
    { name: "Burger Deal 3", desc: "4 Classic Zingers + 2 Reg Fries + 1L Drink + 6 Wings", price: 1990, badge: "DELIVERY", fixedItems: ["4x Classic Zinger Burgers", "2x Regular Fries", "1x 1 Liter Drink", "6x Pcs Wings"] },
    { name: "01 PIZZA DEAL", desc: "1 Large Pizza (Pan) + 1L Drink", price: 1299, badge: "DELIVERY", flavorsNeeded: [{label: "Pizza", cat: "Pan Pizza 🍕"}], fixedItems: ["1L Drink"] },
    { name: "02 PIZZA DEAL", desc: "1 Large Pizza (Premium) + 1L Drink", price: 1499, badge: "DELIVERY", flavorsNeeded: [{label: "Pizza", cat: "Premium Pizza 🌟"}], fixedItems: ["1L Drink"] },
    { name: "03 PIZZA DEAL", desc: "1 Large Crown Pizza + 1L Drink", price: 1599, badge: "DELIVERY", flavorsNeeded: [{label: "Crown Flavor", cat: "Craft My Own Pizza 🎨"}], fixedItems: ["1L Drink"] },
    { name: "04 PIZZA DEAL", desc: "1 Large Extreme Pizza + 1L Drink", price: 1999, badge: "DELIVERY", flavorsNeeded: [{label: "Extreme Flavor", cat: "Extreme Pizza 🌶️"}], fixedItems: ["1L Drink"] }
];

/* ==========================================
   2. CORE UTILITIES (The "Click Fixers")
   ========================================== */
function playClick(type = 'pop') { 
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.type = 'sine';
    if(type === 'pop') osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    else if(type === 'thud') osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function setScrollLock(lock) {
    if(lock) document.body.classList.add('modal-active');
    else document.body.classList.remove('modal-active');
}

function closeModals() {
    const list = ['modal-overlay', 'welcome-overlay', 'flavor-overlay', 'size-overlay', 'admin-login-overlay', 'tracking-overlay', 'upsell-overlay', 'loyalty-setup-overlay', 'manual-order-overlay'];
    list.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = 'none'; });
    setScrollLock(false);
}

/* ==========================================
   3. APP NAVIGATION
   ========================================== */
function enterApp(target) {
    playClick('thud');
    document.getElementById('gateway-screen').style.display = 'none';
    document.getElementById('top-sticky-container').style.display = 'flex';
    document.getElementById('ai-chat-bubble').style.display = 'flex';
    if(target === 'deals') switchTab('deals'); else switchTab('menu');
}

function exitToGateway() {
    playClick('pop');
    document.getElementById('gateway-screen').style.display = 'flex';
    document.getElementById('top-sticky-container').style.display = 'none';
    setScrollLock(false);
}

function switchTab(tab) {
    const isMenu = tab === 'menu';
    document.getElementById('menu-container').style.display = isMenu ? 'block' : 'none';
    document.getElementById('deals-container').style.display = isMenu ? 'none' : 'block';
    document.getElementById('tab-menu').classList.toggle('active', isMenu);
    document.getElementById('tab-deals').classList.toggle('active', !isMenu);
    if(isMenu) renderPublicMenu(); else renderPublicDeals();
}

/* ==========================================
   4. RENDERING & UI
   ========================================== */
function renderPublicMenu(filterText = "") {
    const mC = document.getElementById('menu-container'); mC.innerHTML = "";
    const search = filterText.toLowerCase();
    for (let cat in menuData) {
        if (cat === "Pan/Premium") continue;
        const filtered = menuData[cat].filter(i => i.name.toLowerCase().includes(search));
        if (filtered.length > 0) {
            let html = `<div class="section-title" id="cat-${cat.replace(/\s+/g, '-')}">${cat}</div><div class="grid">`;
            filtered.forEach(item => {
                html += `<div class="btn btn-3d" onclick='openOrderFlow(${JSON.stringify(item)})'><div class="item-label-box"><div>${item.name}</div><div class="price-tag">${typeof item.price === 'object' ? 'PICK SIZE' : 'Rs '+item.price}</div></div></div>`;
            });
            mC.innerHTML += html + `</div>`;
        }
    }
}

function renderPublicDeals() {
    const list = document.getElementById('deals-list'); list.innerHTML = '';
    dealsData.forEach(deal => {
        list.innerHTML += `<div class="deal-card"><div class="deal-badge">${deal.badge}</div><div class="deal-info-box"><div class="deal-title">${deal.name}</div><div class="deal-price">Rs ${deal.price}</div><button class="next-btn btn-3d" style="background:var(--orange)" onclick='openOrderFlow(${JSON.stringify(deal)})'>ADD TO BAG</button></div></div>`;
    });
}

function renderCategoryBar() {
    const bar = document.getElementById('category-bar'); bar.innerHTML = "";
    Object.keys(menuData).filter(c => c !== "Pan/Premium").forEach(cat => {
        const pill = document.createElement('div'); pill.className = "cat-pill"; pill.innerText = cat;
        pill.onclick = () => { switchTab('menu'); document.getElementById("cat-" + cat.replace(/\s+/g, '-')).scrollIntoView(); };
        bar.appendChild(pill);
    });
}

/* ==========================================
   5. ORDER FLOW LOGIC
   ========================================== */
function openOrderFlow(item) {
    playClick('pop'); selectedItem = JSON.parse(JSON.stringify(item)); dealChoices = []; currentFlavorStep = 0;
    if (selectedItem.flavorsNeeded) startFlavorSelection();
    else if (item.price && typeof item.price === 'object') {
        const sizeGrid = document.getElementById('size-grid'); sizeGrid.innerHTML = '';
        for (let s in item.price) {
            let sBtn = document.createElement('div'); sBtn.className = 'btn btn-3d'; sBtn.innerHTML = `<div>${s} - Rs ${item.price[s]}</div>`;
            sBtn.onclick = () => { selectedItem.name += ` (${s})`; selectedItem.price = item.price[s]; document.getElementById('size-overlay').style.display='none'; openQtyModal(); };
            sizeGrid.appendChild(sBtn);
        }
        document.getElementById('size-overlay').style.display='flex';
    } else openQtyModal();
}

function openQtyModal() { document.getElementById('modal-item-name').innerText = selectedItem.name; setQty(1); document.getElementById('modal-overlay').style.display='flex'; setScrollLock(true); }
function setQty(q) { playClick('pop'); selectedQty = q; document.querySelectorAll('.qty-btn').forEach((b, i) => { b.classList.toggle('active', (q===5?i===1:i===(q-1))); }); }

function addToCartFinal() {
    const note = document.getElementById('special-note').value;
    cart.push({...selectedItem, qty: selectedQty, note: note});
    updateCartBar(); closeModals(); checkUpsell(selectedItem);
}

function updateCartBar() {
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cart-total').innerText = `Rs ${total}`;
    document.getElementById('cart-count').innerText = `ITEMS: ${cart.length}`;
    document.getElementById('cart-bar').style.display = cart.length > 0 ? 'flex' : 'none';
}

function startCheckout() {
    document.getElementById('overlay-screen').style.display = 'block';
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('checkout-content').innerHTML = `<h3>Order Summary</h3><button class="confirm-btn" onclick="finalSubmitOrder()">CONFIRM WHATSAPP</button>`;
}

async function finalSubmitOrder() {
    const text = encodeURIComponent(`*OVEN X ORDER*\n\n${cart.map(i=>i.qty+'x '+i.name).join('\n')}`);
    window.location.href = `https://wa.me/923001450301?text=${text}`;
}

/* ==========================================
   6. AI LOGIC
   ========================================== */
function toggleAIChat() { toggleAIChat_Logic(); } // Mapping for your HTML
function toggleAIChat_Logic() { const win = document.getElementById('ai-chat-window'); win.style.display = (win.style.display === 'flex' ? 'none' : 'flex'); }
function appendAIMsg(role, text) { const box = document.getElementById('ai-msg-container'); const div = document.createElement('div'); div.className = `ai-msg ai-msg-${role}`; div.innerText = text; box.appendChild(div); box.scrollTop = box.scrollHeight; }

async function sendToAI() {
    const input = document.getElementById('ai-input-box'); const val = input.value.trim(); if(!val) return;
    appendAIMsg('user', val); input.value = "";
    const prompt = `Human Waiter Oven X. MENU: ${JSON.stringify(menuData)}. Friendly. mix Urdu/English. ADD: [[{"action":"add","item":"Name","price":0}]] CHECKOUT: [[{"action":"checkout"}]]`;
    try {
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST", headers: { "Authorization": `Bearer ${AI_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ "model": "google/gemini-2.0-flash-001", "messages": [{ "role": "system", "content": prompt }, ...aiChatHistory, { "role": "user", "content": val }] })
        });
        const data = await resp.json(); const aiRaw = data.choices[0].message.content; const parts = aiRaw.split('[[');
        appendAIMsg('bot', parts[0].trim());
        if(parts[1]) {
            const act = JSON.parse(parts[1].split(']]')[0]);
            if(act.action === "add") { cart.push({ name: act.item, price: act.price, qty: 1 }); updateCartBar(); }
            else if(act.action === "checkout") { toggleAIChat(); startCheckout(); }
        }
    } catch(e) { appendAIMsg('bot', "Busy..."); }
}

/* ==========================================
   7. INITIALIZATION
 ========================================== */
window.onload = () => {
    renderPublicMenu(); 
    renderCategoryBar();
    renderLoyaltyCard();
};
