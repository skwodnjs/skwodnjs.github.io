document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("exploration-map");
    if (!container || typeof cytoscape === "undefined") return;

    const cy = cytoscape({
        container,
        elements: [
            { data: { id: "convex", label: "Convex Optimization", width: 142 }, position: { x: 285, y: 185 } },
            { data: { id: "duality", label: "Duality-based Reformulation", width: 188 }, position: { x: 535, y: 185 } },
            { data: { id: "ai", label: "AI / ML", width: 72 }, position: { x: 285, y: 55 } },
            { data: { id: "deep-bsde", label: "Deep BSDE", width: 92 }, position: { x: 95, y: 55 } },
            { data: { id: "sciml", label: "Scientific ML", width: 108 }, position: { x: 475, y: 55 } },
            { data: { id: "drpo", label: "DRPO", width: 62 }, position: { x: 410, y: 310 } },

            { data: { id: "edge-core", source: "convex", target: "duality" } },
            { data: { id: "edge-ai", source: "ai", target: "convex" } },
            { data: { id: "edge-bsde", source: "ai", target: "deep-bsde" } },
            { data: { id: "edge-sciml", source: "ai", target: "sciml" } },
            { data: { id: "edge-drpo-convex", source: "convex", target: "drpo" } },
            { data: { id: "edge-drpo-duality", source: "duality", target: "drpo" } }
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
                    "border-color": "#c4c0b8",
                    "border-width": 1,
                    "shape": "round-rectangle",
                    "width": "data(width)",
                    "height": 30,
                    "padding": 10,
                    "label": "data(label)",
                    "font-family": "Inter, Noto Sans KR, sans-serif",
                    "font-size": 11,
                    "font-weight": "normal",
                    "color": "#5f5c57",
                    "text-wrap": "wrap",
                    "text-max-width": 165,
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },
            {
                selector: "#convex, #duality",
                style: {
                    "border-color": "#77746f",
                    "border-width": 1.5,
                    "font-size": 12,
                    "font-weight": "bold",
                    "color": "#191919"
                }
            },
            {
                selector: "#ai",
                style: {
                    "border-color": "#9f9b94",
                    "color": "#3f3d3a"
                }
            },
            {
                selector: "edge",
                style: {
                    "width": 1.25,
                    "line-color": "#aaa69f",
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

    cy.ready(fit);
    window.addEventListener("resize", fit);
});
