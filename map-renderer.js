// Neon SVG Map Renderer for MahaRail v2

class MapRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.svgNS = "http://www.w3.org/2000/svg";
        this.stations = STATIONS;
        this.links = CONNECTIONS;
        this.render();
    }

class MapRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.svgNS = "http://www.w3.org/2000/svg";
        this.stations = STATIONS;
        this.links = [
            { f: "csmt", t: "dadar" },
            { f: "dadar", t: "thane" },
            { f: "thane", t: "kalyan" },
            { f: "kalyan", t: "lonavala" },
            { f: "lonavala", t: "pune" },
            { f: "kalyan", t: "nashik" },
            { f: "nashik", t: "aurangabad" },
            { f: "aurangabad", t: "nagpur" },
            { f: "pune", t: "solapur" },
            { f: "solapur", t: "kolhapur" }
        ];
        this.render();
    }

    render() {
        this.container.innerHTML = "";
        const svg = document.createElementNS(this.svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 1000 800");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.background = "radial-gradient(circle, rgba(0,242,255,0.05) 0%, transparent 70%)";

        // Add Glow Filter
        const defs = document.createElementNS(this.svgNS, "defs");
        defs.innerHTML = `
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.2" />
                <stop offset="50%" style="stop-color:var(--accent);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--accent);stop-opacity:0.2" />
            </linearGradient>
        `;
        svg.appendChild(defs);

        // Draw Links
        this.links.forEach(link => {
            const s = this.stations.find(st => st.id === link.f);
            const e = this.stations.find(st => st.id === link.t);
            if (s && e) {
                const line = document.createElementNS(this.svgNS, "line");
                line.setAttribute("x1", s.coord[0] * 10);
                line.setAttribute("y1", s.coord[1] * 10);
                line.setAttribute("x2", e.coord[0] * 10);
                line.setAttribute("y2", e.coord[1] * 10);
                line.setAttribute("stroke", "var(--glass-border)");
                line.setAttribute("stroke-width", "2");
                line.setAttribute("id", `link-${link.f}-${link.t}`);
                svg.appendChild(line);
            }
        });

        // Draw Stations
        this.stations.forEach(st => {
            const group = document.createElementNS(this.svgNS, "g");
            const circle = document.createElementNS(this.svgNS, "circle");
            circle.setAttribute("cx", st.coord[0] * 10);
            circle.setAttribute("cy", st.coord[1] * 10);
            circle.setAttribute("r", "6");
            circle.setAttribute("fill", "var(--bg-secondary)");
            circle.setAttribute("stroke", "var(--text-secondary)");
            circle.setAttribute("stroke-width", "2");
            circle.setAttribute("id", `node-${st.id}`);
            circle.classList.add("map-node");

            const text = document.createElementNS(this.svgNS, "text");
            text.setAttribute("x", st.coord[0] * 10 + 10);
            text.setAttribute("y", st.coord[1] * 10 + 4);
            text.setAttribute("fill", "var(--text-secondary)");
            text.setAttribute("font-size", "12");
            text.textContent = st.name.split(',')[0];

            group.appendChild(circle);
            svg.appendChild(group);

            // Add Heatmap Pulse to specific nodes (Simulation)
            if (st.id === 'nagpur' || st.id === 'csmt') {
                const pulse = document.createElementNS(this.svgNS, "circle");
                pulse.setAttribute("cx", st.coord[0] * 10);
                pulse.setAttribute("cy", st.coord[1] * 10);
                pulse.classList.add("heatmap-node");
                svg.appendChild(pulse);
            }
        });

        this.container.appendChild(svg);
        this.mainSvg = svg;
    }

    highlightPath(pathIds) {
        // Reset all
        this.render();

        for (let i = 0; i < pathIds.length - 1; i++) {
            const f = pathIds[i];
            const t = pathIds[i + 1];

            // Highlight node
            const node = document.getElementById(`node-${f}`);
            if (node) {
                node.setAttribute("stroke", "var(--accent)");
                node.setAttribute("filter", "url(#neon-glow)");
                node.setAttribute("r", "8");
            }

            // Animate pulse along the line
            const s = this.stations.find(st => st.id === f);
            const e = this.stations.find(st => st.id === t);
            if (s && e) {
                const animatePath = document.createElementNS(this.svgNS, "path");
                const d = `M ${s.coord[0] * 10} ${s.coord[1] * 10} L ${e.coord[0] * 10} ${e.coord[1] * 10}`;
                animatePath.setAttribute("d", d);
                animatePath.setAttribute("stroke", "var(--accent)");
                animatePath.setAttribute("stroke-width", "4");
                animatePath.setAttribute("fill", "none");
                animatePath.setAttribute("stroke-dasharray", "10, 10");

                const anim = document.createElementNS(this.svgNS, "animate");
                anim.setAttribute("attributeName", "stroke-dashoffset");
                anim.setAttribute("from", "100");
                anim.setAttribute("to", "0");
                anim.setAttribute("dur", "1s");
                anim.setAttribute("repeatCount", "indefinite");

                animatePath.appendChild(anim);
                this.mainSvg.appendChild(animatePath);
            }
        }

        // Final node
        const lastNode = document.getElementById(`node-${pathIds[pathIds.length - 1]}`);
        if (lastNode) {
            lastNode.setAttribute("stroke", "var(--accent)");
            lastNode.setAttribute("filter", "url(#neon-glow)");
        }
    }
}

// Global instance
let mainMap;
window.addEventListener('load', () => {
    mainMap = new MapRenderer('map-container');
});

function updateMap(src, dest) {
    // Logic to re-render or highlight nodes
    console.log(`Updating map for ${src} to ${dest}`);
}
