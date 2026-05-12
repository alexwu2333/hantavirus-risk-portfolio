const form = document.querySelector("#risk-form");
const statusPill = document.querySelector("#api-status");
const stateSelect = document.querySelector("#state");
const riskBand = document.querySelector("#risk-band");
const riskLevel = document.querySelector("#risk-level");
const confidence = document.querySelector("#confidence");
const drivers = document.querySelector("#drivers");
const recommendations = document.querySelector("#recommendations");
const stateGrid = document.querySelector("#state-grid");
const featureImportances = document.querySelector("#feature-importances");
const metricAccuracy = document.querySelector("#metric-accuracy");
const heroRisk = document.querySelector("#hero-risk");
const canvas = document.querySelector("#prob-chart");
const ctx = canvas.getContext("2d");
const mapSvg = document.querySelector(".map-svg");
const mapMarkers = document.querySelector("#map-markers");
const mapCaption = document.querySelector("#map-caption");
const mapZoomIn = document.querySelector("#map-zoom-in");
const mapZoomOut = document.querySelector("#map-zoom-out");
const mapReset = document.querySelector("#map-reset");
const stateMarkerElements = {};
const markerRiskByState = {};
const fullMapViewBox = { x: 0, y: 0, width: 1000, height: 560 };
let activeMapState = "New Mexico";
let currentMapScale = 1;
let apiAvailable = true;

const defaultsByState = {
  "Arizona": { avg_temp_f: 88, precip_in: 0.6, drought_index: 3.7, rural_population_pct: 10, forest_cover_pct: 25, rodent_habitat_score: 81, historical_cases: 7 },
  "New Mexico": { avg_temp_f: 77, precip_in: 1.1, drought_index: 3.5, rural_population_pct: 36, forest_cover_pct: 31, rodent_habitat_score: 84, historical_cases: 8 },
  "Colorado": { avg_temp_f: 72, precip_in: 1.2, drought_index: 2.6, rural_population_pct: 14, forest_cover_pct: 35, rodent_habitat_score: 73, historical_cases: 5 },
  "Utah": { avg_temp_f: 79, precip_in: 0.7, drought_index: 3.3, rural_population_pct: 9, forest_cover_pct: 34, rodent_habitat_score: 74, historical_cases: 4 },
  "California": { avg_temp_f: 76, precip_in: 0.4, drought_index: 3.6, rural_population_pct: 5, forest_cover_pct: 32, rodent_habitat_score: 70, historical_cases: 3 },
  "Oregon": { avg_temp_f: 68, precip_in: 1.1, drought_index: 1.5, rural_population_pct: 19, forest_cover_pct: 48, rodent_habitat_score: 55, historical_cases: 2 },
  "Washington": { avg_temp_f: 66, precip_in: 1.0, drought_index: 1.3, rural_population_pct: 16, forest_cover_pct: 52, rodent_habitat_score: 50, historical_cases: 1 },
  "Nevada": { avg_temp_f: 83, precip_in: 0.3, drought_index: 3.9, rural_population_pct: 6, forest_cover_pct: 16, rodent_habitat_score: 72, historical_cases: 3 },
  "Texas": { avg_temp_f: 84, precip_in: 1.8, drought_index: 2.3, rural_population_pct: 15, forest_cover_pct: 28, rodent_habitat_score: 60, historical_cases: 2 },
  "Montana": { avg_temp_f: 67, precip_in: 1.5, drought_index: 2.2, rural_population_pct: 44, forest_cover_pct: 27, rodent_habitat_score: 65, historical_cases: 3 },
  "New York": { avg_temp_f: 71, precip_in: 3.2, drought_index: 0.7, rural_population_pct: 12, forest_cover_pct: 61, rodent_habitat_score: 35, historical_cases: 0 },
};

const stateMapMeta = {
  "Arizona": { abbr: "AZ", x: 276, y: 374, zoom: 2.25 },
  "California": { abbr: "CA", x: 156, y: 332, zoom: 2.05 },
  "Colorado": { abbr: "CO", x: 374, y: 285, zoom: 2.25 },
  "Montana": { abbr: "MT", x: 405, y: 157, zoom: 2.05 },
  "Nevada": { abbr: "NV", x: 214, y: 295, zoom: 2.12 },
  "New Mexico": { abbr: "NM", x: 365, y: 374, zoom: 2.25 },
  "New York": { abbr: "NY", x: 795, y: 208, zoom: 2.15 },
  "Oregon": { abbr: "OR", x: 151, y: 219, zoom: 2.05 },
  "Texas": { abbr: "TX", x: 523, y: 430, zoom: 1.95 },
  "Utah": { abbr: "UT", x: 286, y: 282, zoom: 2.2 },
  "Washington": { abbr: "WA", x: 170, y: 135, zoom: 2.05 },
};

const baselineRiskByState = {
  "Arizona": "high",
  "California": "medium",
  "Colorado": "medium",
  "Montana": "medium",
  "Nevada": "medium",
  "New Mexico": "high",
  "New York": "low",
  "Oregon": "low",
  "Texas": "medium",
  "Utah": "medium",
  "Washington": "low",
};

const staticRegions = {
  "Arizona": "Southwest",
  "California": "West Coast",
  "Colorado": "Mountain West",
  "Montana": "Northern Rockies",
  "Nevada": "Mountain West",
  "New Mexico": "Southwest",
  "New York": "Northeast",
  "Oregon": "Pacific Northwest",
  "Texas": "South Central",
  "Utah": "Mountain West",
  "Washington": "Pacific Northwest",
};

const staticMetadata = {
  metrics: { accuracy: 0.88 },
  model_card: {
    top_feature_importances: [
      { feature: "rodent_habitat_score", importance: 0.24 },
      { feature: "historical_cases", importance: 0.21 },
      { feature: "drought_index", importance: 0.16 },
      { feature: "avg_temp_f", importance: 0.12 },
      { feature: "season", importance: 0.09 },
      { feature: "forest_cover_pct", importance: 0.07 },
    ],
  },
};

function numericValue(name) {
  return Number(form.elements[name].value);
}

function collectPayload() {
  return {
    state: form.elements.state.value,
    year: numericValue("year"),
    season: form.elements.season.value,
    avg_temp_f: numericValue("avg_temp_f"),
    precip_in: numericValue("precip_in"),
    drought_index: numericValue("drought_index"),
    rural_population_pct: numericValue("rural_population_pct"),
    forest_cover_pct: numericValue("forest_cover_pct"),
    rodent_habitat_score: numericValue("rodent_habitat_score"),
    historical_cases: numericValue("historical_cases"),
  };
}

function syncOutputs() {
  document.querySelectorAll("input[type='range']").forEach((input) => {
    const output = input.parentElement.querySelector("output");
    output.value = input.value;
    output.textContent = input.value;
  });
}

function applyStateDefaults(state) {
  const defaults = defaultsByState[state];
  if (!defaults) return;
  Object.entries(defaults).forEach(([key, value]) => {
    form.elements[key].value = value;
  });
  syncOutputs();
}

function renderList(target, values) {
  target.innerHTML = "";
  values.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    target.appendChild(item);
  });
}

function renderFeatureImportances(values) {
  featureImportances.innerHTML = "";
  values.slice(0, 6).forEach((item) => {
    const row = document.createElement("li");
    row.innerHTML = `<span>${item.feature.replaceAll("_", " ")}</span><strong>${Math.round(item.importance * 1000) / 10}%</strong>`;
    featureImportances.appendChild(row);
  });
}

async function fetchJson(path, options = {}) {
  const response = await fetch(path, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function staticProbabilities(score) {
  const highRaw = Math.exp((score - 0.57) * 5.2);
  const mediumRaw = Math.exp((0.5 - Math.abs(score - 0.5)) * 4.4);
  const lowRaw = Math.exp((0.45 - score) * 5.2);
  const total = highRaw + mediumRaw + lowRaw;
  return {
    low: lowRaw / total,
    medium: mediumRaw / total,
    high: highRaw / total,
  };
}

function staticPredict(payload) {
  const seasonalBoost = { spring: 0.03, summer: 0.08, fall: 0.05, winter: -0.02 }[payload.season] || 0;
  const baselineBoost = { high: 0.14, medium: 0.08, low: 0.02 }[baselineRiskByState[payload.state] || "low"];
  const tempSuitability = 1 - Math.min(Math.abs(payload.avg_temp_f - 76) / 45, 1);
  const precipSuitability = 1 - Math.min(Math.abs(payload.precip_in - 1.4) / 4.8, 1);
  const score = clamp(
    payload.rodent_habitat_score / 100 * 0.28 +
      Math.min(payload.historical_cases / 12, 1) * 0.23 +
      payload.drought_index / 5 * 0.16 +
      payload.forest_cover_pct / 80 * 0.08 +
      payload.rural_population_pct / 70 * 0.08 +
      tempSuitability * 0.06 +
      precipSuitability * 0.05 +
      seasonalBoost +
      baselineBoost,
    0.05,
    0.95,
  );
  const riskLevel = score >= 0.67 ? "high" : score >= 0.43 ? "medium" : "low";
  const probabilities = staticProbabilities(score);
  const drivers = [
    `Rodent habitat score: ${payload.rodent_habitat_score}/100`,
    `Historical case signal: ${payload.historical_cases} recent-style cases`,
    `Drought pressure: ${payload.drought_index}/5`,
    `Season and temperature profile: ${payload.season}, ${payload.avg_temp_f}F`,
  ];
  const recommendations = {
    low: [
      "Maintain baseline surveillance and public information.",
      "Refresh state-level features when new climate or surveillance data is available.",
    ],
    medium: [
      "Monitor trend changes and prepare targeted public-health messaging.",
      "Review county-level exposure signals before allocating field resources.",
    ],
    high: [
      "Prioritize outreach around exposure prevention and early symptom awareness.",
      "Increase surveillance attention in high-risk rural and habitat-overlap areas.",
    ],
  }[riskLevel];

  return {
    risk_level: riskLevel,
    confidence: Math.max(probabilities.low, probabilities.medium, probabilities.high),
    probabilities,
    drivers,
    recommendations,
  };
}

function formatViewBox(box) {
  return `${Math.round(box.x)} ${Math.round(box.y)} ${Math.round(box.width)} ${Math.round(box.height)}`;
}

function viewBoxForState(state, scale) {
  const meta = stateMapMeta[state] || stateMapMeta["New Mexico"];
  const safeScale = clamp(scale, 1, 2.8);
  const width = fullMapViewBox.width / safeScale;
  const height = fullMapViewBox.height / safeScale;
  return {
    x: clamp(meta.x - width / 2, -58, fullMapViewBox.width - width + 58),
    y: clamp(meta.y - height / 2, -42, fullMapViewBox.height - height + 42),
    width,
    height,
  };
}

function setMapViewBox(box) {
  if (!mapSvg) return;
  mapSvg.setAttribute("viewBox", formatViewBox(box));
}

function setMarkerClass(state, isActive = false) {
  const marker = stateMarkerElements[state];
  if (!marker) return;
  const riskClass = markerRiskByState[state] || baselineRiskByState[state] || "low";
  marker.setAttribute("class", `map-marker marker-${riskClass}${isActive ? " marker-active" : ""}`);
}

function updateAllMarkerStyles(activeState = activeMapState) {
  Object.keys(stateMarkerElements).forEach((state) => {
    setMarkerClass(state, state === activeState);
  });
}

function focusStateOnMap(state, riskLevel, options = {}) {
  if (!stateMapMeta[state]) return;
  if (riskLevel) {
    markerRiskByState[state] = riskLevel;
  }
  activeMapState = state;
  const shouldZoom = options.zoom !== false;
  const nextScale = shouldZoom ? options.scale || stateMapMeta[state].zoom : 1;
  currentMapScale = nextScale;
  updateAllMarkerStyles(state);
  setMapViewBox(shouldZoom ? viewBoxForState(state, nextScale) : fullMapViewBox);
  if (mapCaption) {
    mapCaption.textContent = shouldZoom ? `${state} highlighted` : "Full demo coverage";
  }
}

function zoomMap(delta) {
  const nextScale = clamp(currentMapScale + delta, 1, 2.8);
  focusStateOnMap(activeMapState, markerRiskByState[activeMapState], { scale: nextScale });
}

function resetMap() {
  focusStateOnMap(activeMapState, markerRiskByState[activeMapState], { zoom: false });
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

function renderMapMarkers() {
  if (!mapMarkers || mapMarkers.dataset.ready === "true") return;
  Object.entries(stateMapMeta).forEach(([state, meta]) => {
    markerRiskByState[state] = baselineRiskByState[state] || "low";
    const marker = createSvgElement("g", {
      class: `map-marker marker-${markerRiskByState[state]}`,
      transform: `translate(${meta.x} ${meta.y})`,
      role: "button",
      tabindex: "0",
      "aria-label": `${state} risk marker`,
    });
    marker.dataset.state = state;

    marker.appendChild(createSvgElement("circle", { class: "halo", r: "43" }));
    marker.appendChild(createSvgElement("circle", { class: "marker-dot", r: "32" }));
    const label = createSvgElement("text", { y: "8" });
    label.textContent = meta.abbr;
    marker.appendChild(label);

    marker.addEventListener("click", () => {
      if (stateSelect.value !== state) {
        stateSelect.value = state;
        applyStateDefaults(state);
      }
      focusStateOnMap(state, markerRiskByState[state]);
      runPrediction();
    });
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        marker.dispatchEvent(new MouseEvent("click"));
      }
    });

    stateMarkerElements[state] = marker;
    mapMarkers.appendChild(marker);
  });
  mapMarkers.dataset.ready = "true";
}

function initRiskMap() {
  if (!mapSvg || !mapMarkers) return;
  renderMapMarkers();
  focusStateOnMap("New Mexico", "high", { zoom: false });
}

function renderProbabilityChart(probabilities) {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfcf9";
  ctx.fillRect(0, 0, width, height);

  const labels = ["low", "medium", "high"];
  const colors = { low: "#4f8a5b", medium: "#c88923", high: "#b24a3b" };
  const barWidth = 98;
  const gap = 62;
  const base = height - 50;
  const maxBarHeight = height - 88;
  const startX = (width - labels.length * barWidth - (labels.length - 1) * gap) / 2;

  ctx.strokeStyle = "#d7dfda";
  ctx.beginPath();
  ctx.moveTo(28, base);
  ctx.lineTo(width - 28, base);
  ctx.stroke();

  labels.forEach((label, index) => {
    const value = probabilities[label] || 0;
    const x = startX + index * (barWidth + gap);
    const barHeight = Math.max(3, value * maxBarHeight);
    const y = base - barHeight;

    ctx.fillStyle = colors[label];
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#14201b";
    ctx.font = "800 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, x + barWidth / 2, base + 24);
    ctx.fillText(`${Math.round(value * 100)}%`, x + barWidth / 2, y - 10);
  });
}

function renderResult(result, options = {}) {
  riskBand.className = `risk-band ${result.risk_level}`;
  riskLevel.textContent = result.risk_level;
  heroRisk.textContent = `${result.risk_level} risk scenario`;
  confidence.textContent = `${Math.round(result.confidence * 100)}% confidence`;
  renderProbabilityChart(result.probabilities);
  renderList(drivers, result.drivers);
  renderList(recommendations, result.recommendations);
  focusStateOnMap(collectPayload().state, result.risk_level, { zoom: options.focusMap !== false });
}

async function runPrediction(options = {}) {
  const payload = collectPayload();
  if (apiAvailable) {
    try {
      const result = await fetchJson("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      renderResult(result, options);
      return;
    } catch (error) {
      apiAvailable = false;
      statusPill.textContent = "Static demo";
    }
  }
  renderResult(staticPredict(payload), options);
}

async function loadStates() {
  try {
    const health = await fetch("/health");
    apiAvailable = health.ok;
  } catch (error) {
    apiAvailable = false;
  }
  statusPill.textContent = apiAvailable ? "API online" : "Static demo";

  let data = {
    states: Object.keys(defaultsByState),
    regions: staticRegions,
  };
  if (apiAvailable) {
    try {
      data = await fetchJson("/states");
    } catch (error) {
      apiAvailable = false;
      statusPill.textContent = "Static demo";
    }
  }
  stateSelect.innerHTML = "";
  data.states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  stateSelect.value = "New Mexico";
  applyStateDefaults("New Mexico");
  initRiskMap();

  stateGrid.innerHTML = "";
  data.states.forEach((state) => {
    const item = document.createElement("div");
    item.className = "state-card";
    item.innerHTML = `<strong>${state}</strong><span>${data.regions[state] || "Other"}</span>`;
    stateGrid.appendChild(item);
  });
}

async function loadMetadata() {
  let data = staticMetadata;
  if (apiAvailable) {
    try {
      data = await fetchJson("/metadata");
    } catch (error) {
      apiAvailable = false;
      statusPill.textContent = "Static demo";
    }
  }
  if (data.metrics && typeof data.metrics.accuracy === "number") {
    metricAccuracy.textContent = `${Math.round(data.metrics.accuracy * 100)}%`;
  }
  if (data.model_card && data.model_card.top_feature_importances) {
    renderFeatureImportances(data.model_card.top_feature_importances);
  }
}

document.querySelectorAll("input[type='range']").forEach((input) => {
  input.addEventListener("input", syncOutputs);
});

mapZoomIn?.addEventListener("click", () => zoomMap(0.35));
mapZoomOut?.addEventListener("click", () => zoomMap(-0.35));
mapReset?.addEventListener("click", resetMap);

stateSelect.addEventListener("change", (event) => {
  applyStateDefaults(event.target.value);
  focusStateOnMap(event.target.value);
  runPrediction().catch((error) => {
    statusPill.textContent = "API issue";
    renderList(drivers, [error.message]);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await runPrediction();
  } catch (error) {
    statusPill.textContent = "API issue";
    renderList(drivers, [error.message]);
  }
});

Promise.all([loadStates(), loadMetadata()])
  .then(() => runPrediction({ focusMap: false }))
  .catch((error) => {
    statusPill.textContent = "API issue";
    renderList(drivers, [error.message]);
  });
