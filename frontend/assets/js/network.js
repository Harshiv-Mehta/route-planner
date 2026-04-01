(function () {
  var summaryNode = document.getElementById("networkSummary");
  var tagsNode = document.getElementById("lineTags");
  var rowsNode = document.getElementById("networkRows");
  var cityCatalogNode = document.getElementById("cityCatalog");

  if (!summaryNode || !rowsNode || !window.MetroData) {
    return;
  }

  var network = MetroData.load();
  var stationsCount = network.stations.length;
  var routesCount = network.routes.length;
  var lineSet = {};

  network.routes.forEach(function (route) {
    lineSet[route.line] = true;
  });

  var lines = Object.keys(lineSet);
  summaryNode.innerHTML =
    "<p class='lead'><strong>" + stationsCount + "</strong> planner stations, <strong>" +
    routesCount + "</strong> route links, and <strong>" + lines.length + "</strong> active lines in the frontend route model.</p>";

  tagsNode.innerHTML = lines.map(function (line) {
    return "<span class='tag'>" + line + "</span>";
  }).join("");

  rowsNode.innerHTML = network.routes.map(function (route) {
    var fare = route.cost;
    if (window.MetroFare && typeof window.MetroFare.baseFareByDistance === "function") {
      fare = window.MetroFare.baseFareByDistance(Number(route.distance) || 0);
    }
    return (
      "<tr>" +
      "<td>" + route.line + "</td>" +
      "<td>" + route.from + "</td>" +
      "<td>" + route.to + "</td>" +
      "<td>" + route.distance + "</td>" +
      "<td>" + fare + "</td>" +
      "<td>" + route.stops + "</td>" +
      "</tr>"
    );
  }).join("");

  if (!cityCatalogNode || !window.MetroCatalog) {
    return;
  }

  cityCatalogNode.innerHTML = window.MetroCatalog.cities.map(function (city) {
    var stations = window.MetroCatalog.stations.filter(function (station) {
      return station.cityId === city.id;
    });

    var stationTags = stations.map(function (station) {
      return "<span class='tag'>" + station.name + "</span>";
    }).join("");

    return (
      "<section class='catalog-block'>" +
      "<h3>" + city.name + "</h3>" +
      "<p class='lead'>" + stations.length + " stations from the database seed.</p>" +
      "<div>" + stationTags + "</div>" +
      "</section>"
    );
  }).join("");
})();
