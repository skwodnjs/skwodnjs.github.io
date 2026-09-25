document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("exploration-map");
    if (!container || typeof cytoscape === "undefined") return;

    const cy = cytoscape({
        container,
        elements: [
            { data: { id: "convex", label: "Convex Optimization", type: "core" }, position: { x: 290, y: 180 } },
            { data: { id: "duality", label: "Duality-based\nReformulation", type: "core" }, position: { x: 530, y: 180 } },

            { data: { id: "drpo", label: "DRPO", type: "topic" }, position: { x: 410, y: 310 } },

            { data: { id: "ai", label: "AI / ML", type: "field" }, position: { x: 150, y: 70 } },
            { data: { id: "deep-bsde", label: "Deep BSDE", type: "topic" }, position: { x: 55, y: 190 } },
            { data: { id: "sciml", label: "Scientific ML", type: "topic" }, position: { x: 255, y: 35 } },

            { data: { id: "e-core", source: "convex", target: "duality" } },
            { data: { id: "e-drpo-1", source: "convex", target: "drpo" } },
            { data: { id: "e-drpo-2", source: "duality", target: "drpo" } },
            { data: { id: "e-ai", source: "ai", target: "convex" } },
            { data: { id: "e-bsde", source: "ai", target: "deep-bsde" } },
            { data: { id: "e-sciml", source: "ai", target: "sciml" } }
        ],
        layout: { name: "preset", fit: true, padding: 28 },
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "#fbfaf7",
                    "border-color": "#d7d3cb",
                    "border-width": 1,
                    "shape": "round-rectangle",
                    "width": "label",
                    "height": 28,
                    "padding": 9,
                    "label": "data(label)",
                    "font-family": "Inter, Noto Sans KR, sans-serif",
                    "font-size": 11,
                    "font-weight": 500,
                    "color": "#77746f",
                    "text-wrap": "wrap",
                    "text-max-width": 130,
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },
            {
                selector: "node[type = 'core']",
                style: {
                    "border-color": "#8f8b84",
                    "border-width": 1.25,
                    "height": 34,
                    "padding": 11,
                    "font-size": 12.5,
                    "font-weight": 600,
                    "color": "#191919",
                    "text-max-width": 155
                }
            },
            {
                selector: "node[type = 'field']",
                style: {
                    "border-color": "#b9b5ae",
                    "color": "#4f4c48"
                }
            },
            {
                selector: "edge",
                style: {
                    "width": 1,
                    "line-color": "#d7d3cb",
                    "curve-style": "bezier"
                }
            }
        ],
        autoungrabify: true,
        boxSelectionEnabled: false,
        userPanningEnabled: false,
        userZoomingEnabled: false,
        minZoom: 0.5,
        maxZoom: 1.5
    });

    const fit = () => cy.fit(cy.elements(), window.innerWidth <= 600 ? 24 : 34);
    fit();
    window.addEventListener("resize", fit);
});
