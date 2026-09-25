document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("exploration-map");
    if (!container || typeof cytoscape === "undefined") return;

    const cy = cytoscape({
        container,
        elements: [
            { data: { id: "core", label: "Convex Optimization & Dual Reformulation", width: 250, height: 54 }, position: { x: 380, y: 195 } },

            { data: { id: "ai", label: "AI / ML", width: 88, height: 38 }, position: { x: 245, y: 82 } },
            { data: { id: "deep-bsde", label: "Deep BSDE", width: 104, height: 38 }, position: { x: 90, y: 118 } },
            { data: { id: "sciml", label: "Scientific ML", width: 118, height: 38 }, position: { x: 410, y: 62 } },
            { data: { id: "drpo", label: "DRPO", width: 78, height: 38 }, position: { x: 555, y: 300 } },

            { data: { id: "edge-core-ai", source: "core", target: "ai" } },
            { data: { id: "edge-ai-bsde", source: "ai", target: "deep-bsde" } },
            { data: { id: "edge-ai-sciml", source: "ai", target: "sciml" } },
            { data: { id: "edge-core-drpo", source: "core", target: "drpo" } }
        ],
        layout: {
            name: "preset",
            fit: false
        },
        style: [
            {
                selector: "node",
                style: {
                    "background-opacity": 0,
                    "border-color": "#cbc7bf",
                    "border-width": 1,
                    "shape": "round-rectangle",
                    "width": "data(width)",
                    "height": "data(height)",
                    "label": "data(label)",
                    "font-family": "Inter, Noto Sans KR, sans-serif",
                    "font-size": 11,
                    "font-weight": "normal",
                    "color": "#6f6b65",
                    "text-wrap": "wrap",
                    "text-max-width": 210,
                    "text-valign": "center",
                    "text-halign": "center"
                }
            },
            {
                selector: "#core",
                style: {
                    "border-color": "#6f6b65",
                    "border-width": 1.6,
                    "font-size": 12.5,
                    "font-weight": "bold",
                    "color": "#191919"
                }
            },
            {
                selector: "edge",
                style: {
                    "width": 1.1,
                    "line-color": "#d6d2ca",
                    "curve-style": "unbundled-bezier",
                    "control-point-distances": 16,
                    "control-point-weights": 0.5
                }
            },
            {
                selector: "#edge-core-ai, #edge-core-drpo",
                style: {
                    "line-color": "#bcb7af",
                    "width": 1.2
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
        cy.fit(cy.elements(), window.innerWidth <= 600 ? 18 : 30);
    };

    cy.ready(fit);
    window.addEventListener("resize", fit);
});
