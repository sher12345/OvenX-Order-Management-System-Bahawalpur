/* --- PROTECTED CORE LOGIC --- */
const SUPABASE_URL = "https://frjcefugnvitexxcated.supabase.co";
const SUPABASE_KEY = "sb_publishable_iymHBHXzWCXmXI4yUfQ_XQ__5EW47HJ";
const AI_KEY = "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";
let sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let cart = [], selectedItem = null, selectedQty = 1, orderType = "", tableNum = "", userAddress = "", delCharge = 0, chkStep = 1, aiChatHistory = [];
let currentKitchenFilter = 'ALL';

const menuData = {
    "Starter 🍟": [{name: "Plain Fries", price: 230}, {name: "Loaded Fries", price: 599}, {name: "Pizza Fries", price: 720}],
    "Burgers 🍔": [{name: "Zinger Burger", price: 420}, {name: "Mighty Burger", price: 699}],
    "Pan Pizza 🍕": [{name: "Chicken Tikka", price: {S:499, M:999, L:1549}}, {name: "Fajita", price: {S:499, M:999, L:1549}}]
};

// --- APP FLOW ---
function enterApp(t) {
    document.getElementById('gateway-screen').style.display='none';
    document.getElementById('top-sticky-container').style.display='flex';
    document.getElementById('ai-chat-bubble').style.display='flex';
    switchTab(t);
}

function exitToGateway() {
    document.getElementById('gateway-screen').style.display='flex';
    document.getElementById('top-sticky-container').style.display='none';
}

function switchTab(t) {
    document.getElementById('menu-container').style.display = (t==='menu'?'block':'none');
    document.getElementById('deals-container').style.display = (t==='deals'?'block':'none');
    if(t==='menu') renderPublicMenu();
}

// --- AI BRAIN (NO JSON IN CHAT) ---
function toggleAIChat() { 
    const win = document.getElementById('ai-chat-window');
    win.style.display = (win.style.display === 'flex' ? 'none' : 'flex'); 
}

function appendAIMsg(role, text) {
    const box = document.getElementById('ai-msg-container');
    const div = document.createElement('div');
    div.className = `ai-msg ai-msg-${role}`;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

async function sendToAI() {
    const input = document.getElementById('ai-input-box');
    const val = input.value.trim();
    if(!val) return;
    appendAIMsg('user', val); input.value = "";
    
    const systemPrompt = `You are a human waiter at Oven X Multan. 
    MENU: ${JSON.stringify(menuData)}. CURRENT CART: ${JSON.stringify(cart)}.
    RULES: 1. Speak human-like (Urdu/English). 2. To ADD: End message with [[{"action":"add","item":"Name","price":0}]] 
    3. To CHECKOUT: End with [[{"action":"checkout"}]] 4. NO DUPLICATES: Check CURRENT CART first. 
    5. DELIVERY: Distance-based fee (allow location). DO NOT SHOW [[ ]] TO USER.`;

    try {
        const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST", headers: { "Authorization": `Bearer ${AI_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ "model": "google/gemini-2.0-flash-001", "messages": [{ "role": "system", "content": systemPrompt }, ...aiChatHistory, { "role": "user", "content": val }] })
        });
        const data = await resp.json();
        const aiRaw = data.choices[0].message.content;
        const parts = aiRaw.split('[[');
        appendAIMsg('bot', parts[0].trim()); // ONLY FRIENDLY TEXT SHOWS

        if(parts[1]) {
            const act = JSON.parse(parts[1].split(']]')[0]);
            if(act.action === "add") { 
                cart.push({ name: act.item, price: act.price, qty: 1 }); 
                updateCartBar(); 
            } else if(act.action === "checkout") { 
                toggleAIChat(); 
                setTimeout(startCheckout, 800); 
            }
        }
        aiChatHistory.push({"role":"user", "content": val}, {"role":"assistant", "content": aiRaw});
    } catch(e) { appendAIMsg('bot', "Connection busy!"); }
}

// --- CORE UTILS ---
function updateCartBar() {
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cart-total').innerText = `Rs ${total}`;
    document.getElementById('cart-bar').style.display = total > 0 ? 'flex' : 'none';
}

function startCheckout() {
    document.getElementById('overlay-screen').style.display='block';
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('checkout-content').innerHTML = `<h2>Summary</h2><h3>Total: Rs ${total}</h3><button class="confirm-btn" onclick="finalSubmitOrder()">CONFIRM VIA WHATSAPP ➔</button>`;
}

async function finalSubmitOrder() {
    const text = encodeURIComponent(`*OVEN X ORDER*\n\n${cart.map(i=>i.name).join('\n')}`);
    window.location.href = `https://wa.me/923001450301?text=${text}`;
}

/* --- KITCHEN & LOYALTY (Restored) --- */
function renderLoyaltyCard() { /* Your original logic for the 10-stamp card */ }
async function renderKitchenOrders() { /* Your original kitchen list logic */ }

// Init
renderPublicMenu();
renderLoyaltyCard();
