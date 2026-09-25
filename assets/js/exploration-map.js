document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("exploration-map");
    if (!container || typeof cytoscape === "undefined") return;

    const cy = cytoscape({
        container,
        elements: [
            { data: { id: "convex", label: "Convex Optimization" }, classes: "core", position: { x: 285, y: 185 } },
            { data: { id: "duality", label: "Duality-based\nReformulation" }, classes: "core", position: { x: 535, y: 185 } },

            { data: { id: "ai", label: "AI / ML" }, classes: "field", position: { x: 285, y: 55 } },
            { data: { id: "deep-bsde", label: "Deep BSDE" }, classes: "topic", position: { x: 95, y: 65 } },
            { data: { id: "sciml", label: "Scientific ML" }, classes: "topic", position: { x: 475, y: 55 } },

            { data: { id: "drpo", label: "DRPO" }, classes: "topic", position: { x: 410, y: 310 } },

            { data: { id: "e-core", source: "convex", target: "duality" } },
            { data: { id: "e-ai", source: "ai", target: "convex" } },
            { data: { id: "e-bsde", source: "ai", target: "deep-bsde" } },
            { data: { id: "e-sciml", source: "ai", target: "sciml" } },
            { data: { id: "e-drpo-1", source: "convex", target: "drpo" } },
            { data: { id: "e-drpo-2", source: "duality", target: "drpo" } }
        ],
        layout: {
            name: "preset",
            fit: false
        },
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "#fbfaf7",
                    "border-color": "#c9c5bd",
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
                    "text-max-width": 140,
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },
            {
                selector: ".core",
                style: {
                    "border-color": "#77746f",
                    "border-width": 1.5,
                    "height": 34,
                    "padding": 11,
                    "font-size": 12.5,
                    "font-weight": 600,
                    "color": "#191919",
                    "text-max-width": 165
                }
            },
            {
                selector: ".field",
                style: {
                    "border-color": "#9f9b94",
                    "color": "#3f3d3a"
                }
            },
            {
                selector: "edge",
                style: {
                    "width": 1.2,
                    "line-color": "#bdb9b1",
                    "curve-style": "bezier"
                }
            }
        ],
        autoungrabify: true,
        boxSelectionEnabled: false,
        userPanningEnabled: false,
        userZoomingEnabled: false
    });

    const fit = () => {
        cy.resize();
        cy.fit(cy.elements(), window.innerWidth <= 600 ? 24 : 36);
    };

    requestAnimationFrame(fit);
    window.addEventListener("resize", fit);
});
