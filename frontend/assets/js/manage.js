(function () {
  if (!window.MetroApi) {
    return;
  }

  var stationForm = document.getElementById("stationForm");
  var stationCityNode = document.getElementById("stationCity");
  var stationNameNode = document.getElementById("stationName");
  var stationLinesNode = document.getElementById("stationLines");
  var stationXNode = document.getElementById("stationX");
  var stationYNode = document.getElementById("stationY");
  var stationNotice = document.getElementById("stationNotice");

  var routeForm = document.getElementById("routeForm");
  var routeCityNode = document.getElementById("routeCity");
  var routeFrom = document.getElementById("routeFrom");
  var routeTo = document.getElementById("routeTo");
  var routeDistance = document.getElementById("routeDistance");
  var routeStops = document.getElementById("routeStops");
  var routeCost = document.getElementById("routeCost");
  var routeNotice = document.getElementById("routeNotice");
  var resetBtn = document.getElementById("resetBtn");
  var resetNotice = document.getElementById("resetNotice");

  var appState = {
    catalog: null,
    stationsByCity: {}
  };

  function setNotice(node, message, isError) {
    node.className = isError ? "notice error" : "notice";
    node.textContent = message;
  }

  function populateCityOptions(cities) {
    stationCityNode.innerHTML = "";
    routeCityNode.innerHTML = "";

    cities.forEach(function (city) {
      var stationOption = document.createElement("option");
      stationOption.value = city.id;
      stationOption.textContent = city.name;
      stationCityNode.appendChild(stationOption);

      var routeOption = document.createElement("option");
      routeOption.value = city.id;
      routeOption.textContent = city.name;
      routeCityNode.appendChild(routeOption);
    });
  }

  function populateRouteStations(cityId) {
    var stations = appState.stationsByCity[cityId] || [];
    routeFrom.innerHTML = "";
    routeTo.innerHTML = "";

    stations.forEach(function (station) {
      var optionA = document.createElement("option");
      optionA.value = station.id;
      optionA.textContent = station.name;
      routeFrom.appendChild(optionA);

      var optionB = document.createElement("option");
      optionB.value = station.id;
      optionB.textContent = station.name;
      routeTo.appendChild(optionB);
    });

    if (stations.length > 1) {
      routeTo.selectedIndex = 1;
    }
  }

  async function refreshCatalog() {
    appState.catalog = await window.MetroApi.getNetwork();
    populateCityOptions(appState.catalog.cities);

    for (var i = 0; i < appState.catalog.cities.length; i += 1) {
      var city = appState.catalog.cities[i];
      var cityNetwork = await window.MetroApi.getNetwork(city.id);
      appState.stationsByCity[city.id] = cityNetwork.stations;
    }

    populateRouteStations(routeCityNode.value || appState.catalog.cities[0].id);
  }

  routeCityNode.addEventListener("change", function () {
    populateRouteStations(routeCityNode.value);
  });

  stationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      await window.MetroApi.addStation({
        cityId: stationCityNode.value,
        name: stationNameNode.value.trim(),
        lines: stationLinesNode.value.trim(),
        x: Number(stationXNode.value),
        y: Number(stationYNode.value)
      });

      await refreshCatalog();
      stationForm.reset();
      stationCityNode.value = appState.catalog.cities[0].id;
      setNotice(stationNotice, "Station saved to the database successfully.", false);
    } catch (error) {
      setNotice(stationNotice, "Unable to add station. " + error.message, true);
    }
  });

  routeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (routeFrom.value === routeTo.value) {
      setNotice(routeNotice, "Source and destination stations must be different.", true);
      return;
    }

    try {
      await window.MetroApi.addConnection({
        cityId: routeCityNode.value,
        fromId: routeFrom.value,
        toId: routeTo.value,
        distance: Number(routeDistance.value),
        cost: Number(routeCost.value),
        stops: Number(routeStops.value)
      });

      routeForm.reset();
      routeCityNode.value = appState.catalog.cities[0].id;
      populateRouteStations(routeCityNode.value);
      setNotice(routeNotice, "Connection saved to the database successfully.", false);
    } catch (error) {
      setNotice(routeNotice, "Unable to add route. " + error.message, true);
    }
  });

  resetBtn.addEventListener("click", async function () {
    try {
      resetBtn.disabled = true;
      await window.MetroApi.resetDemo();
      await refreshCatalog();
      setNotice(resetNotice, "Database reset to the seeded sample network.", false);
    } catch (error) {
      setNotice(resetNotice, "Unable to reset database. " + error.message, true);
    } finally {
      resetBtn.disabled = false;
    }
  });

  refreshCatalog().catch(function (error) {
    setNotice(resetNotice, "Unable to load backend catalog. " + error.message, true);
  });
})();
