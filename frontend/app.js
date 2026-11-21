
const API = "http://127.0.0.1:8000";

// Load dashboard data
async function loadDashboard() {
  try {
    const [serviceResponse, incidentResponse] = await Promise.all([
      fetch(`${API}/api/services`),
      fetch(`${API}/api/incidents`)
    ]);

    if (!serviceResponse.ok || !incidentResponse.ok) {
      throw new Error("API request failed");
    }

    const serviceData = await serviceResponse.json();
    const incidentData = await incidentResponse.json();

    const entries = Object.entries(serviceData.services);

    // Update dashboard statistics
    document.getElementById("total").textContent = serviceData.total;

    document.getElementById("healthy").textContent =
      entries.filter(([, s]) => s.status === "healthy").length;

    document.getElementById("critical").textContent =
      entries.filter(([, s]) => s.status === "critical").length;

    document.getElementById("incidentCount").textContent =
      incidentData.total;

    // Display monitored services
    const servicesRoot = document.getElementById("services");
    servicesRoot.replaceChildren();

    entries.forEach(([id, service]) => {
      const row = document.createElement("div");
      row.className = "service";

      const info = document.createElement("div");

      const name = document.createElement("strong");
      name.textContent = service.name;

      const details = document.createElement("p");
      details.textContent =
        `Latency: ${service.latency} ms | Error rate: ${service.error_rate}%`;

      info.append(name, details);

      const status = document.createElement("span");
      status.className =
        service.status === "healthy" ? "healthy" : "critical";
      status.textContent = service.status.toUpperCase();

      const failButton = document.createElement("button");
      failButton.textContent = "Simulate Failure";
      failButton.addEventListener("click", () => simulateFailure(id));

      const recoverButton = document.createElement("button");
      recoverButton.textContent = "Recover";
      recoverButton.addEventListener("click", () => recoverService(id));

      row.append(info, status, failButton, recoverButton);
      servicesRoot.appendChild(row);
    });

    // Display incidents
    const incidentsRoot = document.getElementById("incidents");
    incidentsRoot.replaceChildren();

    if (incidentData.incidents.length === 0) {
      incidentsRoot.textContent = "No incidents recorded.";
    } else {
      incidentData.incidents.slice().reverse().forEach(incident => {
        const item = document.createElement("p");

        item.textContent =
          `${incident.severity.toUpperCase()} — ${incident.service}: ` +
          `${incident.message} (${new Date(incident.timestamp).toLocaleString()})`;

        incidentsRoot.appendChild(item);
      });
    }

    document.getElementById("message").textContent =
      "Connected to FaultLens API";

  } catch (error) {
    document.getElementById("message").textContent =
      "Backend not connected. Start the API server first.";

    console.error("FaultLens error:", error);
  }
}

// Simulate a service failure
async function simulateFailure(id) {
  try {
    const response = await fetch(
      `${API}/api/services/${id}/simulate-failure`,
      { method: "POST" }
    );

    if (!response.ok) throw new Error("Failure simulation failed");

    await loadDashboard();
  } catch (error) {
    console.error(error);
    document.getElementById("message").textContent =
      "Could not simulate failure.";
  }
}

// Recover a service
async function recoverService(id) {
  try {
    const response = await fetch(
      `${API}/api/services/${id}/recover`,
      { method: "POST" }
    );

    if (!response.ok) throw new Error("Recovery failed");

    await loadDashboard();
  } catch (error) {
    console.error(error);
    document.getElementById("message").textContent =
      "Could not recover service.";
  }
}

// Initial load and automatic refresh every 5 seconds
loadDashboard();
setInterval(loadDashboard, 5000);

async function loadAdvancedFeatures() {
  try {
    const [dependencyRes, analysisRes, analyticsRes] =
      await Promise.all([
        fetch(`${API}/api/dependencies`),
        fetch(`${API}/api/analysis`),
        fetch(`${API}/api/analytics`)
      ]);

    if (!dependencyRes.ok || !analysisRes.ok || !analyticsRes.ok) {
      throw new Error("Advanced API request failed");
    }

    const dependencyData = await dependencyRes.json();
    const analysisData = await analysisRes.json();
    const analyticsData = await analyticsRes.json();

    // Dependency graph
    const graph = document.getElementById("dependencyGraph");
    graph.replaceChildren();

    Object.entries(dependencyData.dependencies).forEach(([service, deps]) => {
      const item = document.createElement("div");
      item.className = "service";

      const label = document.createElement("strong");
      label.textContent = service.toUpperCase();

      const relation = document.createElement("span");
      relation.textContent = deps.length
        ? `Depends on: ${deps.join(", ").toUpperCase()}`
        : "No dependencies";

      item.append(label, relation);
      graph.appendChild(item);
    });

    // Root cause analysis
    const root = document.getElementById("rootCause");
    root.replaceChildren();

    if (analysisData.results.length === 0) {
      root.textContent = "No critical failures detected. All services are operational.";
    } else {
      analysisData.results.forEach(result => {
        const item = document.createElement("div");
        item.className = "service";

        const details = document.createElement("p");
        details.textContent =
          `Suspected cause: ${result.suspected_root_cause} | ` +
          `Potentially affected: ${result.potentially_affected_services.join(", ") || "None"}`;

        item.appendChild(details);
        root.appendChild(item);
      });
    }

    // Reliability analytics
    const analytics = document.getElementById("analytics");
    analytics.replaceChildren();

    const metrics = [
      ["HEALTH SCORE", `${analyticsData.health_percentage}%`],
      ["AVERAGE LATENCY", `${analyticsData.average_latency_ms} ms`],
      ["AVERAGE ERROR RATE", `${analyticsData.average_error_rate}%`],
      ["RECORDED INCIDENTS", analyticsData.recorded_incidents]
    ];

    metrics.forEach(([label, value]) => {
      const card = document.createElement("div");
      card.className = "card";

      const heading = document.createElement("p");
      heading.textContent = label;

      const number = document.createElement("h2");
      number.textContent = value;

      card.append(heading, number);
      analytics.appendChild(card);
    });

  } catch (error) {
    console.error("Advanced features error:", error);
    document.getElementById("rootCause").textContent =
      "Unable to load advanced analytics. Check backend connection.";
  }
}

loadAdvancedFeatures();
setInterval(loadAdvancedFeatures, 5000);

