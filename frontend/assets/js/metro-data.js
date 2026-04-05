(function () {
  async function request(url, options) {
    var response = await fetch(url, options);
    if (!response.ok) {
      var text = await response.text();
      throw new Error(text || "Request failed");
    }
    return response.json();
  }

  window.MetroApi = {
    getNetwork: function (cityId) {
      var url = "/api/network";
      if (cityId) {
        url += "?cityId=" + encodeURIComponent(cityId);
      }
      return request(url);
    },
    addStation: function (payload) {
      return request("/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    },
    addConnection: function (payload) {
      return request("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    },
    saveSearchHistory: function (payload) {
      return request("/api/search-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    },
    resetDemo: function () {
      return request("/api/reset-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
    },
    getPuneFare: function (from, to) {
      return request(
        "/api/pune-fare?from=" + encodeURIComponent(from) + "&to=" + encodeURIComponent(to)
      );
    }
  };
})();
