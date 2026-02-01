// --- GLOBAL DATA & SUPABASE ---
const SUPABASE_URL = "https://frjcefugnvitexxcated.supabase.co";
const SUPABASE_KEY = "sb_publishable_iymHBHXzWCXmXI4yUfQ_XQ__5EW47HJ";
const AI_KEY = "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";
let sb = null;
try { sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch(e) {}

let cart = [], selectedItem = null, selectedQty = 1, orderType = "", tableNum = "", userAddress = "", delCharge = 0, chkStep = 1, dealChoices = [], currentFlavorStep = 0, isQRScan = false, kitchenInterval = null, secretClickCount = 0, aiChatHistory = [];
let currentKitchenFilter = 'ALL';
const RIDERS = ["Ramzan", "Abdurehman", "Abu Bakar", "Atif", "Ahsan"];
const LOYALTY_PRIZES = ["Pan Pizza (S)", "Zinger Burger", "Club Sandwich", "Loaded Fries", "6pcs Wings", "Chipotle Wrap"];

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

// --- APP INITIALIZATION ---
window.onload = () => {
    renderPublicMenu(); 
    renderPublicDeals(); 
    renderCategoryBar(); 
    renderLoyaltyCard();
    const savedOrderId = localStorage.getItem('ovenx_last_order_id');
    if(savedOrderId) initCustomerTracking(savedOrderId);
};

// --- CORE FUNCTIONS (ENTER, EXIT, TABS) ---
function enterApp(target) { 
    playClick('thud'); 
    document.getElementById('gateway-screen').style.display = 'none'; 
    document.getElementById('top-sticky-container').style.display = 'flex'; 
    document.getElementById('ai-chat-bubble').style.display = 'flex';
    if(tableNum && orderType === "") { renderServiceOptions(); document.getElementById('welcome-overlay').style.display = 'flex'; setScrollLock(true); } 
    if(target === 'deals') switchTab('deals'); else switchTab('menu'); 
}

function exitToGateway() { playClick('pop'); document.getElementById('gateway-screen').style.display = 'flex'; document.getElementById('top-sticky-container').style.display = 'none'; document.getElementById('cart-bar').style.display = 'none'; document.getElementById('ai-chat-bubble').style.display = 'none'; document.getElementById('ai-chat-window').style.display = 'none'; renderLoyaltyCard(); setScrollLock(false); }

function switchTab(tab) { playClick('pop'); if(tab === 'menu') { document.getElementById('menu-container').style.display = 'block'; document.getElementById('deals-container').style.display = 'none'; document.getElementById('tab-menu').classList.add('active'); document.getElementById('tab-deals').classList.remove('active'); document.getElementById('menu-controls').style.display = 'block'; renderPublicMenu(); } else { document.getElementById('menu-container').style.display = 'none'; document.getElementById('deals-container').style.display = 'block'; document.getElementById('tab-deals').classList.add('active'); document.getElementById('tab-menu').classList.remove('active'); document.getElementById('menu-controls').style.display = 'none'; renderPublicDeals(); } }

// --- ORDERING & CHECKOUT (THE SOUL) ---
async function finalSubmitOrder() {
    playClick('thud'); const foodTotal = cart.reduce((s, i) => s + (i.price * i.qty), 0); let sc = (orderType === "Dine-In") ? Math.round(foodTotal * 0.07) : 0; const itemsListText = cart.map(i => i.qty + "x " + i.name + (i.note ? " ["+i.note+"]" : "")).join("\n");
    const orderObj = { type: orderType, location: orderType === 'Dine-In' ? "Table " + tableNum : userAddress, items: itemsListText, status: 'WAITING', subtotal: foodTotal + sc, delivery_fee: delCharge };
    let orderId = null; try { if(sb) { const { data } = await sb.from('kitchen_orders').insert([orderObj]).select(); if(data && data[0]) orderId = data[0].id; } } catch(e) { }
    let stamps = parseInt(localStorage.getItem('ovenx_stamps') || 0); let bonus = "";
    if(localStorage.getItem('ovenx_member_name')) { if(stamps >= 10) { bonus = "\n\n🌟 MEMBER GIFT CLAIMED"; localStorage.setItem('ovenx_stamps', 0); } else if(foodTotal >= 1000) { localStorage.setItem('ovenx_stamps', stamps + 1); } }
    const waMsg = encodeURIComponent(`*OVEN X - ORDER*\n\n${itemsListText}\n\n*Total: Rs ${foodTotal + parseFloat(delCharge) + sc}*${bonus}`);
    cart = []; updateCartBar(); document.getElementById('overlay-screen').style.display = 'none';
    if(orderId) initCustomerTracking(orderId); window.location.href = `https://wa.me/923001450301?text=${waMsg}`;
}

function startCheckout() { playClick('thud'); document.getElementById('overlay-screen').style.display = 'block'; setScrollLock(true); renderServiceTypeStep(); }

// --- AI BRAIN: HUMAN & AUTO-WHATSAPP ---
function toggleAIChat() { const win = document.getElementById('ai-chat-window'); win.style.display = (win.style.display === 'flex' ? 'none' : 'flex'); playClick('pop'); }
function appendAIMsg(role, text) { const box = document.getElementById('ai-msg-container'); const div = document.createElement('div'); div.className = `ai-msg ai-msg-${role}`; div.innerText = text; box.appendChild(div); box.scrollTop = box.scrollHeight; }

async function sendToAI() {
    const input = document.getElementById('ai-input-box'); const userVal = input.value.trim(); if(!userVal) return;
    appendAIMsg('user', userVal); input.value = "";
    const systemPrompt = `You are a professional human Waiter at Oven X Multan. Gemini 2.0 Brain.
    MENU: ${JSON.stringify(menuData)}. CURRENT CART: ${JSON.stringify(cart)}.
    RULES: 1. Chat like a real person. 2. To ADD items: End message with [[{"action":"add","item":"Name","price":0}]] 
    3. To CHECKOUT: End message with [[{"action":"checkout"}]] 4. NO DUPLICATES: Check CURRENT CART. 5. DO NOT show [[ ]] blocks.`;

    try {
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST", headers: { "Authorization": `Bearer ${AI_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ "model": "google/gemini-2.0-flash-001", "messages": [{ "role": "system", "content": systemPrompt }, ...aiChatHistory, { "role": "user", "content": userVal }] })
        });
        const data = await resp.json(); const aiRaw = data.choices[0].message.content; const parts = aiRaw.split('[[');
        appendAIMsg('bot', parts[0].trim());
        if(parts[1]) {
            const actionJson = JSON.parse(parts[1].split(']]')[0]);
            if(actionJson.action === "add") { cart.push({ name: actionJson.item, price: actionJson.price, qty: 1, note: "AI Order" }); updateCartBar(); }
            else if(actionJson.action === "checkout") { toggleAIChat(); setTimeout(startCheckout, 800); }
        }
        aiChatHistory.push({"role":"user", "content": userVal}, {"role":"assistant", "content": aiRaw});
    } catch(e) { appendAIMsg('bot', "Brain is busy, try again!"); }
}

// --- ALL OTHER LOGIC (KITCHEN, RIDER, PWA) ---
async function renderKitchenOrders() {
    if(!sb) return; const { data: orders } = await sb.from('kitchen_orders').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('kitchen-orders-list'); list.innerHTML = orders.map(o => `<div class="kitchen-card"><b>${o.type}</b><p>${o.items}</p><button onclick="updateStatus('${o.id}', 'READY')">DONE</button></div>`).join('');
}
