document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("exploration-map");
    if (!container || typeof cytoscape === "undefined") return;

    cytoscape({
        container,
        elements: [
            { data: { id: "convex", label: "Convex Optimization" }, position: { x: 285, y: 185 } },
            { data: { id: "duality", label: "Duality-based Reformulation" }, position: { x: 535, y: 185 } },
            { data: { id: "ai", label: "AI / ML" }, position: { x: 285, y: 55 } },
            { data: { id: "deep-bsde", label: "Deep BSDE" }, position: { x: 95, y: 55 } },
            { data: { id: "sciml", label: "Scientific ML" }, position: { x: 475, y: 55 } },
            { data: { id: "drpo", label: "DRPO" }, position: { x: 410, y: 310 } },

            { data: { id: "edge-core", source: "convex", target: "duality" } },
            { data: { id: "edge-ai", source: "ai", target: "convex" } },
            { data: { id: "edge-bsde", source: "ai", target: "deep-bsde" } },
            { data: { id: "edge-sciml", source: "ai", target: "sciml" } },
            { data: { id: "edge-drpo-convex", source: "convex", target: "drpo" } },
            { data: { id: "edge-drpo-duality", source: "duality", target: "drpo" } }
        ],
        layout: {
            name: "preset",
            fit: true,
            padding: 36
        },
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "#fbfaf7",
                    "border-color": "#c4c0b8",
                    "border-width": 1,
                    "shape": "round-rectangle",
                    "width": "label",
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
});
