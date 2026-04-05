(function () {
  var cityNode = document.getElementById("networkCity");
  var summaryNode = document.getElementById("networkSummary");
  var tagsNode = document.getElementById("lineTags");
  var rowsNode = document.getElementById("networkRows");
  var cityCatalogNode = document.getElementById("cityCatalog");

  if (!summaryNode || !rowsNode || !window.MetroApi) {
    return;
  }

  var appState = {
    catalog: null
  };

  function populateCities(cities) {
    if (!cityNode) {
      return;
    }

    cityNode.innerHTML = "";

    var allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All Cities";
    cityNode.appendChild(allOption);

    cities.forEach(function (city) {
      var option = document.createElement("option");
      option.value = city.id;
      option.textContent = city.name;
      cityNode.appendChild(option);
    });
  }

  function renderCatalog(catalog) {
    if (!cityCatalogNode) {
      return;
    }

    cityCatalogNode.innerHTML = catalog.cities.map(function (city) {
      var stations = catalog.stations.filter(function (station) {
        return station.cityId === city.id;
      });

      var stationTags = stations.map(function (station) {
        return "<span class='tag'>" + station.name + "</span>";
      }).join("");

      return (
        "<section class='catalog-block'>" +
        "<h3>" + city.name + "</h3>" +
        "<p class='lead'>" + stations.length + " stations available in the database.</p>" +
        "<div>" + stationTags + "</div>" +
        "</section>"
      );
    }).join("");
  }

  function renderRoutes(network) {
    var lineSet = {};
    network.routes.forEach(function (route) {
      lineSet[route.line] = true;
    });

    var lines = Object.keys(lineSet);
    summaryNode.innerHTML =
      "<p class='lead'><strong>" + network.stations.length + "</strong> stations, <strong>" +
      network.routes.length + "</strong> directional route links, and <strong>" +
      lines.length + "</strong> active lines from the backend.</p>";

    tagsNode.innerHTML = lines.map(function (line) {
      return "<span class='tag'>" + line + "</span>";
    }).join("");

    rowsNode.innerHTML = network.routes.map(function (route) {
      return (
        "<tr>" +
        "<td>" + route.cityId + "</td>" +
        "<td>" + route.line + "</td>" +
        "<td>" + route.from + "</td>" +
        "<td>" + route.to + "</td>" +
        "<td>" + route.distance + "</td>" +
        "<td>" + route.cost + "</td>" +
        "<td>" + route.stops + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  async function loadNetwork(cityId) {
    summaryNode.innerHTML = "<p class='lead'>Loading backend network...</p>";
    tagsNode.innerHTML = "";
    rowsNode.innerHTML = "";
    var network = await window.MetroApi.getNetwork(cityId || "");
    renderRoutes(network);
  }

  async function init() {
    appState.catalog = await window.MetroApi.getNetwork();
    populateCities(appState.catalog.cities);
    renderCatalog(appState.catalog);
    await loadNetwork("");
  }

  if (cityNode) {
    cityNode.addEventListener("change", function () {
      loadNetwork(cityNode.value).catch(function (error) {
        summaryNode.innerHTML = "<p class='lead'><strong>Unable to load backend network.</strong> " + error.message + "</p>";
      });
    });
  }

  init().catch(function (error) {
    summaryNode.innerHTML = "<p class='lead'><strong>Unable to load network explorer.</strong> " + error.message + "</p>";
  });
})();
