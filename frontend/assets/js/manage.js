(function () {
  if (!window.MetroData) {
    return;
  }

  var stationForm = document.getElementById("stationForm");
  var stationNameNode = document.getElementById("stationName");
  var stationNotice = document.getElementById("stationNotice");

  var routeForm = document.getElementById("routeForm");
  var routeFrom = document.getElementById("routeFrom");
  var routeTo = document.getElementById("routeTo");
  var routeDistance = document.getElementById("routeDistance");
  var routeStops = document.getElementById("routeStops");
  var routeLine = document.getElementById("routeLine");
  var routeNotice = document.getElementById("routeNotice");
  var resetBtn = document.getElementById("resetBtn");
  var resetNotice = document.getElementById("resetNotice");

  var data = MetroData.load();

  function setNotice(node, message, isError) {
    node.className = isError ? "notice error" : "notice";
    node.textContent = message;
  }

  function fillStationOptions() {
    routeFrom.innerHTML = "";
    routeTo.innerHTML = "";
    data.stations.forEach(function (station) {
      var optionA = document.createElement("option");
      optionA.value = station;
      optionA.textContent = station;
      routeFrom.appendChild(optionA);

      var optionB = document.createElement("option");
      optionB.value = station;
      optionB.textContent = station;
      routeTo.appendChild(optionB);
    });

    if (data.stations.length > 1) {
      routeTo.selectedIndex = 1;
    }
  }

  fillStationOptions();

  stationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = stationNameNode.value.trim();
    if (!name) {
      setNotice(stationNotice, "Station name is required.", true);
      return;
    }

    if (data.stations.indexOf(name) > -1) {
      setNotice(stationNotice, "Station already exists.", true);
      return;
    }

    data.stations.push(name);
    data = MetroData.save(data);
    fillStationOptions();
    stationForm.reset();
    setNotice(stationNotice, "Station added successfully.", false);
  });

  routeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (routeFrom.value === routeTo.value) {
      setNotice(routeNotice, "Source and destination stations must be different.", true);
      return;
    }

    data.routes.push({
      from: routeFrom.value,
      to: routeTo.value,
      distance: Number(routeDistance.value),
      // Cost is derived from fare slabs; keep stored value aligned for table fallback.
      cost: window.MetroFare && typeof window.MetroFare.baseFareByDistance === "function"
        ? window.MetroFare.baseFareByDistance(Number(routeDistance.value))
        : 10,
      stops: Number(routeStops.value),
      line: routeLine.value.trim() || "Connector"
    });
    data = MetroData.save(data);
    routeForm.reset();
    fillStationOptions();
    setNotice(routeNotice, "Route added successfully.", false);
  });

  resetBtn.addEventListener("click", function () {
    data = MetroData.reset();
    data = MetroData.save(data);
    fillStationOptions();
    setNotice(resetNotice, "Network reset to default sample dataset.", false);
  });
})();
