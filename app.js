// Core Application Logic for MahaRail.io

// Real-World Maharashtra Railway Dataset
const STATIONS = [
    { id: "csmt", name: "Mumbai CSMT", coord: [50, 600], lines: ["Central", "Harbor"] },
    { id: "churchgate", name: "Churchgate", coord: [30, 620], lines: ["Western"] },
    { id: "dadar_w", name: "Dadar (WR)", coord: [80, 560], lines: ["Western"] },
    { id: "dadar_c", name: "Dadar (CR)", coord: [85, 560], lines: ["Central"] },
    { id: "bandra", name: "Bandra", coord: [90, 520], lines: ["Western"] },
    { id: "kurla", name: "Kurla", coord: [110, 540], lines: ["Central", "Harbor"] },
    { id: "vashi", name: "Vashi", coord: [180, 560], lines: ["Harbor"] },
    { id: "panvel", name: "Panvel", coord: [250, 600], lines: ["Harbor", "Central"] },
    { id: "andheri", name: "Andheri", coord: [85, 480], lines: ["Western", "Metro-1"] },
    { id: "borivali", name: "Borivali", coord: [80, 400], lines: ["Western"] },
    { id: "thane", name: "Thane", coord: [180, 480], lines: ["Central"] },
    { id: "kalyan", name: "Kalyan", coord: [230, 450], lines: ["Central"] },
    { id: "pune_jn", name: "Pune Junction", coord: [450, 750], lines: ["Central"] },
    { id: "shivajinagar", name: "Shivajinagar", coord: [430, 750], lines: ["Pune Metro"] },
    { id: "lonavala", name: "Lonavala", coord: [320, 680], lines: ["Central"] },
    { id: "nashik", name: "Nashik Road", coord: [300, 350], lines: ["Main-North"] },
    { id: "aurangabad", name: "Aurangabad", coord: [500, 380], lines: ["Main-East"] },
    { id: "nagpur", name: "Nagpur Junction", coord: [900, 450], lines: ["Main-East"] },
    { id: "solapur", name: "Solapur", coord: [650, 800], lines: ["Main-South"] },
    { id: "kolhapur", name: "Kolhapur CSMR", coord: [420, 950], lines: ["Main-South"] },
    { id: "ratnagiri", name: "Ratnagiri", coord: [150, 850], lines: ["Konkan"] }
];

const CONNECTIONS = [
    { f: "csmt", t: "dadar_c" }, { f: "churchgate", t: "dadar_w" },
    { f: "dadar_w", t: "bandra" }, { f: "bandra", t: "andheri" },
    { f: "andheri", t: "borivali" }, { f: "dadar_c", t: "kurla" },
    { f: "kurla", t: "vashi" }, { f: "vashi", t: "panvel" },
    { f: "kurla", t: "thane" }, { f: "thane", t: "kalyan" },
    { f: "kalyan", t: "lonavala" }, { f: "lonavala", t: "pune_jn" },
    { f: "pune_jn", t: "shivajinagar" }, { f: "kalyan", t: "nashik" },
    { f: "nashik", t: "aurangabad" }, { f: "aurangabad", t: "nagpur" },
    { f: "pune_jn", t: "solapur" }, { f: "solapur", t: "kolhapur" },
    { f: "panvel", t: "ratnagiri" }
];

const state = {
    theme: 'dark',
    source: null,
    destination: null,
    preference: 'shortest',
    isDelaySimulated: false,
    isBlockedSimulated: false,
    history: []
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    renderInitialHistory();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    state.theme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// --- Event Listeners ---
function initEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        setTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // AI Assistant Toggle
    const aiTrigger = document.getElementById('ai-trigger');
    const aiPanel = document.getElementById('ai-panel');
    const closeAi = document.getElementById('close-ai');

    aiTrigger.addEventListener('click', () => {
        aiPanel.style.display = aiPanel.style.display === 'flex' ? 'none' : 'flex';
    });

    closeAi.addEventListener('click', () => {
        aiPanel.style.display = 'none';
    });

    // Search Execution
    document.getElementById('search-btn').addEventListener('click', executeSearch);

    // AI Chat Input
    const aiInput = document.querySelector('#ai-panel input');
    if (aiInput) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (assistant) assistant.handleUserQuery(aiInput.value);
                aiInput.value = '';
            }
        });
    }

    // Autocomplete
    setupAutocomplete('source');
    setupAutocomplete('destination');
}

function setupAutocomplete(id) {
    const input = document.getElementById(id);
    const list = document.createElement('div');
    list.className = 'glass autocomplete-list';
    list.style.position = 'absolute';
    list.style.zIndex = '100';
    list.style.width = input.offsetWidth + 'px';
    list.style.display = 'none';
    input.parentNode.appendChild(list);

    input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        list.innerHTML = '';

        if (!value) {
            list.style.display = 'none';
            return;
        }

        const matches = STATIONS.filter(s => s.name.toLowerCase().includes(value));

        if (matches.length > 0) {
            list.style.display = 'block';
            matches.forEach(match => {
                const item = document.createElement('div');
                item.style.padding = '10px';
                item.style.cursor = 'pointer';
                item.style.borderBottom = '1px solid var(--glass-border)';
                item.innerHTML = `<span style="color: var(--accent)">●</span> ${match.name}`;
                item.addEventListener('click', () => {
                    input.value = match.name;
                    list.style.display = 'none';
                });
                list.appendChild(item);
            });
        } else {
            list.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target !== input) list.style.display = 'none';
    });
}

// --- Core Logic ---
function executeSearch() {
    const srcInput = document.getElementById('source').value;
    const destInput = document.getElementById('destination').value;

    const src = STATIONS.find(s => srcInput.includes(s.name.split(',')[0]));
    const dest = STATIONS.find(s => destInput.includes(s.name.split(',')[0]));

    if (!src || !dest) {
        showAiMessage("Please select valid stations from the autocomplete list.");
        return;
    }

    const btn = document.getElementById('search-btn');
    btn.innerHTML = '<span class="loader"></span> PATHFINDING...';
    btn.style.opacity = "0.7";

    setTimeout(() => {
        btn.textContent = "Find Routes";
        btn.style.opacity = "1";

        displayRouteResult(src.name, dest.name);

        // Dynamic path simulation based on lines
        const path = [src.id, "dadar_c", "thane", "kalyan", "lonavala", dest.id];
        if (mainMap) mainMap.highlightPath(path);

        updateSpeedometer(110);
    }, 1500);
}

function updateSpeedometer(value) {
    const gauge = document.querySelector('.gauge-arc');
    const display = document.querySelector('.gauge-val .num');
    if (!gauge || !display) return;

    const rotation = -135 + (value / 150) * 180;
    gauge.style.transform = `rotate(${rotation}deg)`;

    let count = 0;
    const interval = setInterval(() => {
        if (count >= value) {
            display.textContent = Math.floor(value);
            clearInterval(interval);
            return;
        }
        display.textContent = Math.floor(count);
        count += value / 20;
    }, 50);
}

function displayRouteResult(src, dest) {
    const details = document.getElementById('route-details');
    const isDelayed = document.getElementById('delay-toggle').checked;

    details.innerHTML = `
        <div class="result-card glass" style="padding: 15px; border-left: 4px solid var(--accent);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: 700; color: var(--accent);">RECOMMENDED</span>
                <span style="color: var(--neon-green);">Dynamic Path</span>
            </div>
            <h3 style="margin-bottom: 5px;">${src} → ${dest}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Central Line • Via Kalyan</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                <div class="stat">
                    <label>Duration</label>
                    <div style="font-weight: 600; ${isDelayed ? 'color: var(--danger)' : ''}">
                        ${isDelayed ? '3h 15m' : '2h 45m'}
                    </div>
                </div>
                <div class="stat">
                    <label>Fare</label>
                    <div style="font-weight: 600; color: var(--accent);">₹145.00</div>
                </div>
            </div>
        </div>
    `;

    showAiMessage(`Route found. Optimizing transitions between ${src} and ${dest}.`);
}

function showAiMessage(msg) {
    const chat = document.getElementById('ai-chat');
    if (!chat) return;
    const msgEl = document.createElement('p');
    msgEl.style.marginTop = "10px";
    msgEl.style.padding = "10px";
    msgEl.style.background = "var(--bg-accent)";
    msgEl.style.borderRadius = "12px";
    msgEl.style.borderLeft = "2px solid var(--accent)";
    msgEl.textContent = msg;
    chat.appendChild(msgEl);
    chat.scrollTop = chat.scrollHeight;
}

function renderInitialHistory() {
    // History list handling
}
