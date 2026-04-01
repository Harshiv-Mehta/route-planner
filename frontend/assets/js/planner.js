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

  if (!cityNode || !fromNode || !toNode || !form || !window.MetroData || !window.MetroCatalog) {
    return;
  }

  var network = MetroData.load();

  function getRouteStationsForCity(cityId) {
    var cityStations = window.MetroCatalog.stations
      .filter(function (station) {
        return station.cityId === cityId;
      })
      .map(function (station) {
        return station.name;
      });

    return cityStations.filter(function (station) {
      return network.stations.indexOf(station) > -1;
    });
  }

  function populateCities() {
    cityNode.innerHTML = "";
    window.MetroCatalog.cities.forEach(function (city) {
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
      optionFrom.value = station;
      optionFrom.textContent = station;
      fromNode.appendChild(optionFrom);

      var optionTo = document.createElement("option");
      optionTo.value = station;
      optionTo.textContent = station;
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

    var passSupported = isPune;
    Array.prototype.forEach.call(ticketTypeNode.options, function (option) {
      if (option.value === "one-pune-card" || option.value === "vidyarthi-pass") {
        option.disabled = !passSupported;
      }
    });
    if (!passSupported && ticketTypeNode.value !== "token") {
      ticketTypeNode.value = "token";
    }
  }

  function buildAdjacency(stations, routes) {
    var graph = {};
    stations.forEach(function (name) {
      graph[name] = [];
    });

    routes.forEach(function (route) {
      graph[route.from].push(route);
      graph[route.to].push({
        from: route.to,
        to: route.from,
        distance: route.distance,
        cost: route.cost,
        stops: route.stops,
        line: route.line
      });
    });

    return graph;
  }

  function findBestCommute(networkData, from, to) {
    var stations = networkData.stations;
    var graph = buildAdjacency(stations, networkData.routes);
    var dist = {};
    var prev = {};
    var lineAt = {};
    var visited = {};

    stations.forEach(function (name) {
      dist[name] = Number.POSITIVE_INFINITY;
      prev[name] = null;
      lineAt[name] = null;
      visited[name] = false;
    });
    dist[from] = 0;

    while (true) {
      var node = null;
      var best = Number.POSITIVE_INFINITY;

      stations.forEach(function (name) {
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
      singleFare: singleFare,
      totalFare: totalFare
    };
  }

  async function fetchOfficialFare(cityId, from, to) {
    if (cityId !== "pune") {
      return null;
    }

    try {
      var response = await fetch(
        "/api/pune-fare?from=" + encodeURIComponent(from) + "&to=" + encodeURIComponent(to)
      );
      if (!response.ok) return null;
      var payload = await response.json();
      return payload && typeof payload.fare === "number" ? payload.fare : null;
    } catch (error) {
      return null;
    }
  }

  function renderResult(cityId, result, ticketType, tripType, officialBaseFare) {
    if (!result) {
      resultNode.innerHTML = "<strong>No route found.</strong> Try another station pair in the selected city.";
      return;
    }

    var fareBreakdown;
    if (typeof officialBaseFare === "number") {
      fareBreakdown = calculateFare(officialBaseFare, ticketType, tripType);
    } else {
      fareBreakdown = calculateFare(result.totals.cost, "token", tripType);
    }

    var discountLabel = fareBreakdown.discountRate > 0
      ? Math.round(fareBreakdown.discountRate * 100) + "% discount applied"
      : "No discount";

    var ticketLabel = "Token";
    if (ticketType === "one-pune-card") ticketLabel = "One Pune Card";
    if (ticketType === "vidyarthi-pass") ticketLabel = "Vidyarthi Pass";
    var tripLabel = tripType === "return" ? "Return" : "Single";
    var fareSource = cityId === "pune" && typeof officialBaseFare === "number"
      ? "Official Pune Metro fare chart"
      : "Database seed fare";

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

  function getCityNetwork(cityId) {
    var stations = getRouteStationsForCity(cityId);
    var routes = network.routes.filter(function (route) {
      return stations.indexOf(route.from) > -1 && stations.indexOf(route.to) > -1;
    });
    return { stations: stations, routes: routes };
  }

  function refreshCityStations() {
    var cityId = cityNode.value;
    var stations = getRouteStationsForCity(cityId);
    populateStations(stations);
    updatePlannerMeta(cityId);
  }

  populateCities();
  refreshCityStations();

  cityNode.addEventListener("change", function () {
    refreshCityStations();
    resultNode.innerHTML = "Choose stations in the selected city and click <strong>Find Route</strong>.";
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (fromNode.value === toNode.value) {
      resultNode.innerHTML = "<strong>Source and destination cannot be the same.</strong>";
      return;
    }

    var cityId = cityNode.value;
    var cityNetwork = getCityNetwork(cityId);
    resultNode.innerHTML = cityId === "pune"
      ? "Fetching official Pune Metro fare and route..."
      : "Finding route using database connections...";

    var result = findBestCommute(cityNetwork, fromNode.value, toNode.value);
    var officialBaseFare = await fetchOfficialFare(cityId, fromNode.value, toNode.value);
    renderResult(cityId, result, ticketTypeNode.value, tripTypeNode.value, officialBaseFare);
  });
})();
