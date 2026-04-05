(function () {
  var cityNode = document.getElementById("citySelect");
  var fromNode = document.getElementById("fromStation");
  var toNode = document.getElementById("toStation");
  var ticketTypeNode = document.getElementById("ticketType");
  var tripTypeNode = document.getElementById("tripType");
  var form = document.getElementById("plannerForm");
  var resultNode = document.getElementById("routeResult");
  var supportNode = document.getElementById("plannerSupportNote");
  var linksNode = document.getElementById("plannerLinks");

  if (!cityNode || !fromNode || !toNode || !form || !window.MetroApi) {
    return;
  }

  var appState = {
    catalog: null,
    cityNetwork: null
  };

  function populateCities(cities) {
    cityNode.innerHTML = "";
    cities.forEach(function (city) {
      var option = document.createElement("option");
      option.value = city.id;
      option.textContent = city.name;
      cityNode.appendChild(option);
    });
  }

  function populateStations(stations) {
    fromNode.innerHTML = "";
    toNode.innerHTML = "";

    stations.forEach(function (station) {
      var optionFrom = document.createElement("option");
      optionFrom.value = station.name;
      optionFrom.textContent = station.name;
      fromNode.appendChild(optionFrom);

      var optionTo = document.createElement("option");
      optionTo.value = station.name;
      optionTo.textContent = station.name;
      toNode.appendChild(optionTo);
    });

    if (stations.length > 1) {
      toNode.selectedIndex = 1;
    }
  }

  function updatePlannerMeta(cityId) {
    var isPune = cityId === "pune";
    supportNode.style.display = isPune ? "block" : "none";
    linksNode.style.display = isPune ? "block" : "none";

    Array.prototype.forEach.call(ticketTypeNode.options, function (option) {
      if (option.value === "one-pune-card" || option.value === "vidyarthi-pass") {
        option.disabled = !isPune;
      }
    });
    if (!isPune && ticketTypeNode.value !== "token") {
      ticketTypeNode.value = "token";
    }
  }

  function buildAdjacency(stations, routes) {
    var graph = {};
    stations.forEach(function (station) {
      graph[station.name] = [];
    });

    routes.forEach(function (route) {
      if (graph[route.from] && graph[route.to]) {
        graph[route.from].push(route);
      }
    });

    return graph;
  }

  function findBestCommute(network, from, to) {
    var graph = buildAdjacency(network.stations, network.routes);
    var stationNames = network.stations.map(function (station) {
      return station.name;
    });
    var dist = {};
    var prev = {};
    var lineAt = {};
    var visited = {};

    stationNames.forEach(function (name) {
      dist[name] = Number.POSITIVE_INFINITY;
      prev[name] = null;
      lineAt[name] = null;
      visited[name] = false;
    });
    dist[from] = 0;

    while (true) {
      var node = null;
      var best = Number.POSITIVE_INFINITY;

      stationNames.forEach(function (name) {
        if (!visited[name] && dist[name] < best) {
          best = dist[name];
          node = name;
        }
      });

      if (!node || node === to) {
        break;
      }

      visited[node] = true;
      graph[node].forEach(function (edge) {
        var interchangePenalty = lineAt[node] && lineAt[node] !== edge.line ? 100 : 0;
        var trial = dist[node] + interchangePenalty + (Number(edge.stops) || 0) + (Number(edge.distance) || 0) / 100;
        if (trial < dist[edge.to]) {
          dist[edge.to] = trial;
          prev[edge.to] = node;
          lineAt[edge.to] = edge.line;
        }
      });
    }

    if (dist[to] === Number.POSITIVE_INFINITY) {
      return null;
    }

    var path = [];
    var cursor = to;
    while (cursor) {
      path.unshift(cursor);
      cursor = prev[cursor];
    }

    var totals = { distance: 0, stops: 0, interchanges: 0, cost: 0 };
    var linesUsed = [];

    for (var i = 0; i < path.length - 1; i += 1) {
      var source = path[i];
      var destination = path[i + 1];
      var edge = graph[source].find(function (item) {
        return item.to === destination;
      });
      if (!edge) continue;

      totals.distance += Number(edge.distance) || 0;
      totals.stops += Number(edge.stops) || 0;
      totals.cost += Number(edge.cost) || 0;
      linesUsed.push(edge.line);

      if (i > 0 && linesUsed[i] !== linesUsed[i - 1]) {
        totals.interchanges += 1;
      }
    }

    totals.etaMin = Math.max(3, Math.round((path.length - 1) * 2.2 + totals.interchanges * 3 + 2));
    totals.linesUsed = linesUsed.filter(function (line, index, arr) {
      return index === 0 || arr[index - 1] !== line;
    });

    return { path: path, totals: totals };
  }

  function calculateFare(baseFare, ticketType, tripType) {
    var discountRate = 0;
    if (ticketType === "one-pune-card") discountRate = 0.10;
    if (ticketType === "vidyarthi-pass") discountRate = 0.30;
    var singleFare = Math.round(baseFare * (1 - discountRate));
    var totalFare = tripType === "return" ? singleFare * 2 : singleFare;
    return {
      baseSingle: baseFare,
      discountRate: discountRate,
      totalFare: totalFare
    };
  }

  function renderResult(cityId, result, ticketType, tripType, officialBaseFare) {
    if (!result) {
      resultNode.innerHTML = "<strong>No route found.</strong> This station pair is disconnected in the backend data.";
      return;
    }

    var fareBreakdown = typeof officialBaseFare === "number"
      ? calculateFare(officialBaseFare, ticketType, tripType)
      : calculateFare(result.totals.cost, "token", tripType);

    var discountLabel = fareBreakdown.discountRate > 0
      ? Math.round(fareBreakdown.discountRate * 100) + "% discount applied"
      : "No discount";

    var ticketLabel = "Token";
    if (ticketType === "one-pune-card") ticketLabel = "One Pune Card";
    if (ticketType === "vidyarthi-pass") ticketLabel = "Vidyarthi Pass";
    var tripLabel = tripType === "return" ? "Return" : "Single";
    var fareSource = cityId === "pune" && typeof officialBaseFare === "number"
      ? "Official Pune Metro fare chart"
      : "Database connection cost";

    resultNode.innerHTML =
      "<p><strong>Best Commute Route</strong></p>" +
      "<p>" + result.path.join(" -> ") + "</p>" +
      "<p><span class='tag'>Distance: " + result.totals.distance.toFixed(1) + " km</span>" +
      "<span class='tag'>Stops: " + result.totals.stops + "</span>" +
      "<span class='tag'>Interchanges: " + result.totals.interchanges + "</span>" +
      "<span class='tag'>ETA: " + result.totals.etaMin + " min</span></p>" +
      "<p><span class='tag'>Ticket: " + ticketLabel + "</span>" +
      "<span class='tag'>Trip: " + tripLabel + "</span>" +
      "<span class='tag'>Base Fare: Rs " + fareBreakdown.baseSingle + "</span>" +
      "<span class='tag'>" + discountLabel + "</span>" +
      "<span class='tag'>Payable Fare: Rs " + fareBreakdown.totalFare + "</span></p>" +
      "<p class='lead'>Line sequence: " + (result.totals.linesUsed.length ? result.totals.linesUsed.join(" -> ") : "-") + "</p>" +
      "<p class='lead'>Fare source: " + fareSource + "</p>";
  }

  async function loadCityNetwork(cityId) {
    resultNode.innerHTML = "Loading network from database...";
    appState.cityNetwork = await window.MetroApi.getNetwork(cityId);
    populateStations(appState.cityNetwork.stations);
    updatePlannerMeta(cityId);
    resultNode.innerHTML = "Choose stations in the selected city and click <strong>Find Route</strong>.";
  }

  async function init() {
    appState.catalog = await window.MetroApi.getNetwork();
    populateCities(appState.catalog.cities);
    await loadCityNetwork(cityNode.value);
  }

  cityNode.addEventListener("change", function () {
    loadCityNetwork(cityNode.value).catch(function (error) {
      resultNode.innerHTML = "<strong>Unable to load city network.</strong> " + error.message;
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!appState.cityNetwork) {
      resultNode.innerHTML = "<strong>Network is still loading.</strong>";
      return;
    }

    if (fromNode.value === toNode.value) {
      resultNode.innerHTML = "<strong>Source and destination cannot be the same.</strong>";
      return;
    }

    var cityId = cityNode.value;
    resultNode.innerHTML = cityId === "pune"
      ? "Fetching official Pune Metro fare and backend route..."
      : "Finding route using backend connections...";

    var result = findBestCommute(appState.cityNetwork, fromNode.value, toNode.value);
    var officialBaseFare = null;
    if (cityId === "pune") {
      var farePayload = await window.MetroApi.getPuneFare(fromNode.value, toNode.value);
      officialBaseFare = farePayload && typeof farePayload.fare === "number" ? farePayload.fare : null;
    }
    renderResult(cityId, result, ticketTypeNode.value, tripTypeNode.value, officialBaseFare);

    window.MetroApi.saveSearchHistory({
      source: fromNode.value,
      destination: toNode.value
    }).catch(function () {});
  });

  init().catch(function (error) {
    resultNode.innerHTML = "<strong>Unable to load route planner.</strong> " + error.message;
  });
})();
