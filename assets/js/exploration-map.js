document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("exploration-map");
    if (!container || typeof cytoscape === "undefined") return;

    const cy = cytoscape({
        container,
        elements: [
            { data: { id: "convex", label: "Convex Optimization", width: 150 }, position: { x: 300, y: 205 } },
            { data: { id: "duality", label: "Duality-based Reformulation", width: 190 }, position: { x: 535, y: 205 } },

            { data: { id: "ai", label: "AI / ML", width: 82 }, position: { x: 265, y: 82 } },
            { data: { id: "deep-bsde", label: "Deep BSDE", width: 92 }, position: { x: 92, y: 112 } },
            { data: { id: "sciml", label: "Scientific ML", width: 108 }, position: { x: 450, y: 58 } },

            { data: { id: "drpo", label: "DRPO", width: 72 }, position: { x: 430, y: 318 } },

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
                    "border-width": 0,
                    "shape": "round-rectangle",
                    "width": "data(width)",
                    "height": 30,
                    "padding": 8,
                    "label": "data(label)",
                    "font-family": "Inter, Noto Sans KR, sans-serif",
                    "font-size": 11,
                    "font-weight": "normal",
                    "color": "#77746f",
                    "text-wrap": "wrap",
                    "text-max-width": 170,
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },
            {
                selector: "#convex, #duality",
                style: {
                    "background-color": "#252422",
                    "color": "#fbfaf7",
                    "height": 34,
                    "padding": 12,
                    "font-size": 12,
                    "font-weight": "bold"
                }
            },
            {
                selector: "#ai, #drpo",
                style: {
                    "background-color": "#efede8",
                    "color": "#4f4c48",
                    "height": 28,
                    "padding": 9,
                    "font-weight": 500
                }
            },
            {
                selector: "#deep-bsde, #sciml",
                style: {
                    "background-opacity": 0,
                    "color": "#77746f",
                    "font-size": 11
                }
            },
            {
                selector: "edge",
                style: {
                    "width": 1.15,
                    "line-color": "#d6d2ca",
                    "curve-style": "unbundled-bezier",
                    "control-point-distances": 18,
                    "control-point-weights": 0.5
                }
            },
            {
                selector: "#edge-core",
                style: {
                    "width": 1.35,
                    "line-color": "#9f9b94",
                    "control-point-distances": 0
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
        cy.fit(cy.elements(), window.innerWidth <= 600 ? 20 : 34);
    };

    cy.ready(fit);
    window.addEventListener("resize", fit);
});
