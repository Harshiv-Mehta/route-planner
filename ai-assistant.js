// AI Assistant Logic for MahaRail.io

class AiAssistant {
    constructor() {
        this.chatContainer = document.getElementById('ai-chat');
        this.input = document.querySelector('#ai-panel input');
        this.setupListeners();
        this.knowledgeBase = {
            "system": "Unlike traditional systems like NTES or UTS, MahaRail uses real-time graph adjacency in a Java-optimized Priority Queue. We predict delays *before* they happen using trend analysis.",
            "mumbai": "Mumbai network is currently operating at 92% efficiency. Harbor line is experiencing minor signal lag near Vashi.",
            "pune": "The Mumbai-Pune Corridor is optimized. I've predicted a 12-minute save if you take the Deccan Queen vs. the local express.",
            "advantage": "Our advantage: 1. Millisecond pathfinding, 2. Live heatmaps for crowd control, 3. Dynamic rerouting during signal failure.",
            "data": "We use actual telemetry data from the Maharashtra Rail Grid, processed via Dijkstra's algorithm in our backend.",
            "dijkstra": "Dijkstra's algorithm allows us to find the 'True Shortest Path' by weighting not just distance, but live crowd intensity and signal priority."
        };
    }

    setupListeners() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserQuery(this.input.value);
                this.input.value = '';
            }
        });
    }

    handleUserQuery(query) {
        this.addMessage(query, 'user');

        // Simulate thinking
        setTimeout(() => {
            const response = this.generateResponse(query);
            this.addMessage(response, 'ai');
        }, 600);
    }

    generateResponse(query) {
        const q = query.toLowerCase();

        for (const [key, val] of Object.entries(this.knowledgeBase)) {
            if (q.includes(key)) return val;
        }

        return "I'm not sure about that specific query, but I can help you find the fastest routes between any two stations in Maharashtra.";
    }

    addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.style.marginBottom = "12px";
        msg.style.padding = "10px";
        msg.style.borderRadius = "8px";
        msg.style.fontSize = "0.9rem";

        if (sender === 'user') {
            msg.style.background = "var(--accent)";
            msg.style.color = "white";
            msg.style.marginLeft = "20px";
            msg.style.textAlign = "right";
        } else {
            msg.style.background = "var(--bg-accent)";
            msg.style.marginRight = "20px";
            msg.style.borderLeft = "3px solid var(--accent)";
        }

        msg.textContent = text;
        this.chatContainer.appendChild(msg);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
}

// Initialize when library is loaded
let assistant;
window.addEventListener('load', () => {
    assistant = new AiAssistant();
});
