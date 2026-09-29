document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("course-map");
  const status = document.getElementById("course-map-description");
  const filters = [...document.querySelectorAll(".course-filter")];
  const searchInput = document.getElementById("course-search");
  const tableRows = [...document.querySelectorAll("#courses-table tbody tr")];
  const emptyState = document.getElementById("course-empty-state");

  const nodes = [
    { id: "math221", label: "MATH 221/222", group: "math", x: 70, y: 96, width: 142 },
    { id: "cs200", label: "CS 200", group: "cs", x: 62, y: 236, width: 104 },
    { id: "esl118", label: "ESL 118", group: "context", x: 70, y: 416, width: 108 },
    { id: "theatre100", label: "THEATRE 100", group: "context", x: 238, y: 494, width: 138 },
    { id: "math340", label: "MATH 340", group: "math", x: 288, y: 52, width: 116 },
    { id: "math331", label: "MATH 331", group: "math", x: 296, y: 126, width: 116 },
    { id: "cs300", label: "CS 300", group: "cs", x: 282, y: 222, width: 104 },
    { id: "cs240", label: "CS 240", group: "cs", x: 288, y: 300, width: 104 },
    { id: "cs252", label: "CS 252", group: "cs", x: 290, y: 374, width: 104 },
    { id: "lis202", label: "LIS 202", group: "context", x: 470, y: 492, width: 104 },
    { id: "anthro104", label: "ANTHRO 104", group: "context", x: 454, y: 418, width: 132 },
    { id: "cs400", label: "CS 400", group: "cs", x: 520, y: 210, width: 104 },
    { id: "cs354", label: "CS 354", group: "cs", x: 520, y: 356, width: 104 },
    { id: "urs250", label: "URS 250", group: "context", x: 686, y: 458, width: 108 },
    { id: "cs524", label: "CS 524", group: "cs", x: 692, y: 108, width: 104 },
    { id: "cs532", label: "CS 532", group: "cs", x: 690, y: 206, width: 104 },
    { id: "cs639", label: "CS 639", group: "cs", x: 892, y: 278, width: 104 }
  ];

  const edges = [
    ["math221", "math340"], ["math221", "math331"], ["math340", "cs532"], ["math331", "cs532"],
    ["cs200", "cs300"], ["cs300", "cs400"], ["cs200", "cs240"], ["cs200", "cs252"],
    ["cs252", "cs354"], ["cs240", "cs524"], ["cs400", "cs639"], ["cs354", "cs639"],
    ["cs524", "cs639"], ["cs532", "cs639"], ["esl118", "urs250"], ["theatre100", "urs250"],
    ["lis202", "urs250"], ["anthro104", "urs250"], ["urs250", "cs639"]
  ];

  if (svg) {
    const namespace = "http://www.w3.org/2000/svg";
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const edgeElements = [];
    const nodeElements = new Map();

    const center = (node) => ({ x: node.x + node.width / 2, y: node.y + 23 });
    const edgeLayer = document.createElementNS(namespace, "g");
    const nodeLayer = document.createElementNS(namespace, "g");
    svg.append(edgeLayer, nodeLayer);

    edges.forEach(([sourceId, targetId]) => {
      const source = center(nodeById.get(sourceId));
      const target = center(nodeById.get(targetId));
      const bend = Math.max(36, Math.abs(target.x - source.x) * 0.48);
      const path = document.createElementNS(namespace, "path");
      path.setAttribute("d", `M ${source.x} ${source.y} C ${source.x + bend} ${source.y}, ${target.x - bend} ${target.y}, ${target.x} ${target.y}`);
      path.setAttribute("class", "course-edge");
      path.dataset.source = sourceId;
      path.dataset.target = targetId;
      edgeLayer.append(path);
      edgeElements.push(path);
    });

    nodes.forEach((node) => {
      const group = document.createElementNS(namespace, "g");
      const rect = document.createElementNS(namespace, "rect");
      const text = document.createElementNS(namespace, "text");
      group.setAttribute("class", "course-node");
      group.setAttribute("data-group", node.group);
      group.setAttribute("data-node-id", node.id);
      group.setAttribute("role", "button");
      group.setAttribute("tabindex", "0");
      group.setAttribute("aria-label", `Show connections for ${node.label}`);
      rect.setAttribute("x", node.x);
      rect.setAttribute("y", node.y);
      rect.setAttribute("width", node.width);
      rect.setAttribute("height", "46");
      rect.setAttribute("rx", "23");
      text.setAttribute("x", node.x + node.width / 2);
      text.setAttribute("y", node.y + 29);
      text.setAttribute("text-anchor", "middle");
      text.textContent = node.label;
      group.append(rect, text);
      nodeLayer.append(group);
      nodeElements.set(node.id, group);
    });

    const resetGraph = (group = "all") => {
      nodeElements.forEach((element, id) => {
        const visible = group === "all" || nodeById.get(id).group === group;
        element.classList.toggle("is-muted", !visible);
        element.classList.remove("is-active");
      });
      edgeElements.forEach((edge) => {
        const sourceMatches = group === "all" || nodeById.get(edge.dataset.source).group === group;
        const targetMatches = group === "all" || nodeById.get(edge.dataset.target).group === group;
        edge.classList.toggle("is-muted", !(sourceMatches && targetMatches));
        edge.classList.remove("is-active");
      });
      if (status) status.textContent = group === "all" ? "Choose a course to reveal its conceptual neighbors." : `Showing the ${group === "cs" ? "computer science" : group === "math" ? "mathematics" : "human context"} layer.`;
    };

    const activateNode = (nodeId) => {
      const connected = new Set([nodeId]);
      edgeElements.forEach((edge) => {
        const isConnected = edge.dataset.source === nodeId || edge.dataset.target === nodeId;
        edge.classList.toggle("is-active", isConnected);
        edge.classList.toggle("is-muted", !isConnected);
        if (isConnected) connected.add(edge.dataset.source === nodeId ? edge.dataset.target : edge.dataset.source);
      });
      nodeElements.forEach((element, id) => {
        element.classList.toggle("is-active", id === nodeId);
        element.classList.toggle("is-muted", !connected.has(id));
      });
      const labels = [...connected].filter((id) => id !== nodeId).map((id) => nodeById.get(id).label);
      if (status) status.textContent = `${nodeById.get(nodeId).label} connects to ${labels.join(", ")}.`;
    };

    nodeElements.forEach((element, id) => {
      element.addEventListener("click", () => activateNode(id));
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateNode(id);
        }
      });
    });

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        filters.forEach((item) => item.classList.toggle("is-active", item === button));
        resetGraph(button.dataset.courseGroup);
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase().trim();
      let visibleRows = 0;
      tableRows.forEach((row) => {
        const matches = row.dataset.search.includes(query);
        row.hidden = !matches;
        if (matches) visibleRows += 1;
      });
      if (emptyState) emptyState.hidden = visibleRows !== 0;
    });
  }
});
