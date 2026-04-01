(function () {
  var STORAGE_KEY = "metroPlannerNetworkDbAlignedV1";

  var cityCatalog = [
    { id: "mumbai", name: "Mumbai" },
    { id: "pune", name: "Pune" },
    { id: "nagpur", name: "Nagpur" }
  ];

  var stationCatalog = [
    { name: "Mumbai CSMT", cityId: "mumbai", lines: "Central,Harbor" },
    { name: "Masjid", cityId: "mumbai", lines: "Central,Harbor" },
    { name: "Sandhurst Road", cityId: "mumbai", lines: "Central,Harbor" },
    { name: "Byculla", cityId: "mumbai", lines: "Central" },
    { name: "Chinchpokli", cityId: "mumbai", lines: "Central" },
    { name: "Currey Road", cityId: "mumbai", lines: "Central" },
    { name: "Parel", cityId: "mumbai", lines: "Central" },
    { name: "Dadar (CR)", cityId: "mumbai", lines: "Central" },
    { name: "Matunga", cityId: "mumbai", lines: "Central" },
    { name: "Sion", cityId: "mumbai", lines: "Central" },
    { name: "Kurla", cityId: "mumbai", lines: "Central,Harbor" },
    { name: "Vikhroli", cityId: "mumbai", lines: "Central" },
    { name: "Kanjurmarg", cityId: "mumbai", lines: "Central" },
    { name: "Bhandup", cityId: "mumbai", lines: "Central" },
    { name: "Mulund", cityId: "mumbai", lines: "Central" },
    { name: "Thane", cityId: "mumbai", lines: "Central" },
    { name: "Diva", cityId: "mumbai", lines: "Central" },
    { name: "Dombivli", cityId: "mumbai", lines: "Central" },
    { name: "Kalyan", cityId: "mumbai", lines: "Central" },
    { name: "Churchgate", cityId: "mumbai", lines: "Western" },
    { name: "Marine Lines", cityId: "mumbai", lines: "Western" },
    { name: "Charni Road", cityId: "mumbai", lines: "Western" },
    { name: "Grant Road", cityId: "mumbai", lines: "Western" },
    { name: "Mumbai Central", cityId: "mumbai", lines: "Western" },
    { name: "Mahalakshmi", cityId: "mumbai", lines: "Western" },
    { name: "Lower Parel", cityId: "mumbai", lines: "Western" },
    { name: "Prabhadevi", cityId: "mumbai", lines: "Western" },
    { name: "Dadar (WR)", cityId: "mumbai", lines: "Western" },
    { name: "Matunga Road", cityId: "mumbai", lines: "Western" },
    { name: "Mahim Jn", cityId: "mumbai", lines: "Western,Harbor" },
    { name: "Bandra", cityId: "mumbai", lines: "Western" },
    { name: "Khar Road", cityId: "mumbai", lines: "Western" },
    { name: "Santa Cruz", cityId: "mumbai", lines: "Western" },
    { name: "Vile Parle", cityId: "mumbai", lines: "Western" },
    { name: "Andheri", cityId: "mumbai", lines: "Western,Metro-1" },
    { name: "Jogeshwari", cityId: "mumbai", lines: "Western" },
    { name: "Goregaon", cityId: "mumbai", lines: "Western" },
    { name: "Malad", cityId: "mumbai", lines: "Western" },
    { name: "Kandivli", cityId: "mumbai", lines: "Western" },
    { name: "Borivali", cityId: "mumbai", lines: "Western" },
    { name: "PCMC Bhavan", cityId: "pune", lines: "Purple" },
    { name: "Sant Tukaram Nagar", cityId: "pune", lines: "Purple" },
    { name: "Nashik Phata", cityId: "pune", lines: "Purple" },
    { name: "Kasarwadi", cityId: "pune", lines: "Purple" },
    { name: "Phugewadi", cityId: "pune", lines: "Purple" },
    { name: "Dapodi", cityId: "pune", lines: "Purple" },
    { name: "Bopodi", cityId: "pune", lines: "Purple" },
    { name: "Shivaji Nagar", cityId: "pune", lines: "Purple,Central" },
    { name: "Civil Court", cityId: "pune", lines: "Purple,Aqua" },
    { name: "Swargate", cityId: "pune", lines: "Purple" },
    { name: "Vanaz", cityId: "pune", lines: "Aqua" },
    { name: "Anand Nagar", cityId: "pune", lines: "Aqua" },
    { name: "Nal Stop", cityId: "pune", lines: "Aqua" },
    { name: "Garware College", cityId: "pune", lines: "Aqua" },
    { name: "PMC Bhavan", cityId: "pune", lines: "Aqua" },
    { name: "Pune Junction", cityId: "pune", lines: "Aqua,Central" },
    { name: "Ruby Hall Clinic", cityId: "pune", lines: "Aqua" },
    { name: "Yerawada", cityId: "pune", lines: "Aqua" },
    { name: "Ramwadi", cityId: "pune", lines: "Aqua" },
    { name: "Automotive Square", cityId: "nagpur", lines: "Orange" },
    { name: "Nari Road", cityId: "nagpur", lines: "Orange" },
    { name: "Gaddi Godam Sq", cityId: "nagpur", lines: "Orange" },
    { name: "Kasturchand Park", cityId: "nagpur", lines: "Orange" },
    { name: "Zero Mile", cityId: "nagpur", lines: "Orange" },
    { name: "Sitabuldi Interchange", cityId: "nagpur", lines: "Orange,Aqua" },
    { name: "Congress Nagar", cityId: "nagpur", lines: "Orange" },
    { name: "Airport", cityId: "nagpur", lines: "Orange" },
    { name: "Khapri", cityId: "nagpur", lines: "Orange" },
    { name: "Prajapati Nagar", cityId: "nagpur", lines: "Aqua" },
    { name: "Ambedkar Sq", cityId: "nagpur", lines: "Aqua" },
    { name: "Nagpur Rly Stn", cityId: "nagpur", lines: "Aqua" },
    { name: "Jhansi Rani Sq", cityId: "nagpur", lines: "Aqua" },
    { name: "Inst of Engineers", cityId: "nagpur", lines: "Aqua" },
    { name: "Subhash Nagar", cityId: "nagpur", lines: "Aqua" },
    { name: "Lokmanya Nagar", cityId: "nagpur", lines: "Aqua" }
  ];

  var defaultData = {
    stations: [
      "Mumbai CSMT",
      "Masjid",
      "Sandhurst Road",
      "Byculla",
      "Dadar (CR)",
      "Kurla",
      "Thane",
      "Kalyan",
      "Churchgate",
      "Marine Lines",
      "Mumbai Central",
      "Dadar (WR)",
      "Bandra",
      "Andheri",
      "Borivali",
      "PCMC Bhavan",
      "Sant Tukaram Nagar",
      "Nashik Phata",
      "Kasarwadi",
      "Phugewadi",
      "Dapodi",
      "Bopodi",
      "Shivaji Nagar",
      "Civil Court",
      "Swargate",
      "Vanaz",
      "Anand Nagar",
      "Nal Stop",
      "Garware College",
      "PMC Bhavan",
      "Pune Junction",
      "Ruby Hall Clinic",
      "Yerawada",
      "Ramwadi",
      "Automotive Square",
      "Gaddi Godam Sq",
      "Kasturchand Park",
      "Sitabuldi Interchange",
      "Airport",
      "Khapri",
      "Prajapati Nagar",
      "Nagpur Rly Stn",
      "Subhash Nagar",
      "Lokmanya Nagar"
    ],
    routes: [
      { from: "Mumbai CSMT", to: "Masjid", distance: 2, cost: 5, stops: 1, line: "Central" },
      { from: "Masjid", to: "Sandhurst Road", distance: 2, cost: 5, stops: 1, line: "Central" },
      { from: "Sandhurst Road", to: "Byculla", distance: 3, cost: 5, stops: 1, line: "Central" },
      { from: "Byculla", to: "Dadar (CR)", distance: 5, cost: 10, stops: 3, line: "Central" },
      { from: "Dadar (CR)", to: "Kurla", distance: 7, cost: 10, stops: 3, line: "Central" },
      { from: "Kurla", to: "Thane", distance: 18, cost: 15, stops: 6, line: "Central" },
      { from: "Thane", to: "Kalyan", distance: 20, cost: 15, stops: 5, line: "Central" },
      { from: "Churchgate", to: "Marine Lines", distance: 2, cost: 5, stops: 1, line: "Western" },
      { from: "Marine Lines", to: "Mumbai Central", distance: 4, cost: 5, stops: 2, line: "Western" },
      { from: "Mumbai Central", to: "Dadar (WR)", distance: 6, cost: 10, stops: 3, line: "Western" },
      { from: "Dadar (CR)", to: "Dadar (WR)", distance: 1, cost: 5, stops: 1, line: "Interchange" },
      { from: "Dadar (WR)", to: "Bandra", distance: 6, cost: 10, stops: 2, line: "Western" },
      { from: "Bandra", to: "Andheri", distance: 8, cost: 10, stops: 4, line: "Western" },
      { from: "Andheri", to: "Borivali", distance: 15, cost: 15, stops: 5, line: "Western" },
      { from: "PCMC Bhavan", to: "Sant Tukaram Nagar", distance: 2, cost: 10, stops: 1, line: "Purple" },
      { from: "Sant Tukaram Nagar", to: "Nashik Phata", distance: 2, cost: 10, stops: 1, line: "Purple" },
      { from: "Nashik Phata", to: "Kasarwadi", distance: 2, cost: 10, stops: 1, line: "Purple" },
      { from: "Kasarwadi", to: "Phugewadi", distance: 2, cost: 10, stops: 1, line: "Purple" },
      { from: "Phugewadi", to: "Dapodi", distance: 2, cost: 10, stops: 1, line: "Purple" },
      { from: "Dapodi", to: "Bopodi", distance: 2, cost: 10, stops: 1, line: "Purple" },
      { from: "Bopodi", to: "Shivaji Nagar", distance: 8, cost: 20, stops: 4, line: "Purple" },
      { from: "Shivaji Nagar", to: "Civil Court", distance: 2, cost: 5, stops: 1, line: "Purple" },
      { from: "Civil Court", to: "Swargate", distance: 3, cost: 10, stops: 2, line: "Purple" },
      { from: "Vanaz", to: "Anand Nagar", distance: 2, cost: 10, stops: 1, line: "Aqua" },
      { from: "Anand Nagar", to: "Nal Stop", distance: 2, cost: 10, stops: 1, line: "Aqua" },
      { from: "Nal Stop", to: "Garware College", distance: 2, cost: 10, stops: 1, line: "Aqua" },
      { from: "Garware College", to: "PMC Bhavan", distance: 2, cost: 10, stops: 1, line: "Aqua" },
      { from: "PMC Bhavan", to: "Civil Court", distance: 1, cost: 10, stops: 1, line: "Aqua" },
      { from: "Civil Court", to: "Pune Junction", distance: 2, cost: 10, stops: 1, line: "Aqua" },
      { from: "Pune Junction", to: "Ruby Hall Clinic", distance: 1, cost: 10, stops: 1, line: "Aqua" },
      { from: "Ruby Hall Clinic", to: "Yerawada", distance: 3, cost: 10, stops: 2, line: "Aqua" },
      { from: "Yerawada", to: "Ramwadi", distance: 6, cost: 20, stops: 3, line: "Aqua" },
      { from: "Automotive Square", to: "Gaddi Godam Sq", distance: 5, cost: 15, stops: 2, line: "Orange" },
      { from: "Gaddi Godam Sq", to: "Kasturchand Park", distance: 2, cost: 10, stops: 1, line: "Orange" },
      { from: "Kasturchand Park", to: "Sitabuldi Interchange", distance: 2, cost: 10, stops: 1, line: "Orange" },
      { from: "Sitabuldi Interchange", to: "Airport", distance: 8, cost: 20, stops: 4, line: "Orange" },
      { from: "Airport", to: "Khapri", distance: 4, cost: 15, stops: 2, line: "Orange" },
      { from: "Prajapati Nagar", to: "Nagpur Rly Stn", distance: 6, cost: 15, stops: 4, line: "Aqua" },
      { from: "Nagpur Rly Stn", to: "Sitabuldi Interchange", distance: 1, cost: 10, stops: 1, line: "Aqua" },
      { from: "Sitabuldi Interchange", to: "Subhash Nagar", distance: 6, cost: 15, stops: 4, line: "Aqua" },
      { from: "Subhash Nagar", to: "Lokmanya Nagar", distance: 4, cost: 15, stops: 2, line: "Aqua" }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function sanitize(payload) {
    if (!payload || !Array.isArray(payload.stations) || !Array.isArray(payload.routes)) {
      return clone(defaultData);
    }

    var stations = payload.stations.filter(function (item, index, arr) {
      return typeof item === "string" && item.trim() && arr.indexOf(item) === index;
    });

    var routes = payload.routes
      .filter(function (route) {
        return route && stations.indexOf(route.from) > -1 && stations.indexOf(route.to) > -1;
      })
      .map(function (route) {
        return {
          from: route.from,
          to: route.to,
          distance: Number(route.distance) || 0,
          cost: Number(route.cost) || 0,
          stops: Number(route.stops) || 0,
          line: route.line || "Connector"
        };
      });

    return { stations: stations, routes: routes };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return clone(defaultData);
      }
      return sanitize(JSON.parse(raw));
    } catch (error) {
      return clone(defaultData);
    }
  }

  function save(data) {
    var cleaned = sanitize(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  }

  window.MetroData = {
    load: load,
    save: save,
    reset: function () {
      localStorage.removeItem(STORAGE_KEY);
      return clone(defaultData);
    }
  };

  window.MetroCatalog = {
    cities: cityCatalog,
    stations: stationCatalog
  };

  window.MetroFare = {
    baseFareByDistance: function (distanceKm) {
      if (distanceKm <= 2.7) return 10;
      if (distanceKm <= 5.9) return 15;
      if (distanceKm <= 9.0) return 20;
      if (distanceKm <= 15.9) return 25;
      if (distanceKm <= 18.7) return 30;
      return 35;
    },
    totalFare: function (distanceKm, ticketType, isReturn) {
      var base = this.baseFareByDistance(distanceKm);
      var discountRate = 0;
      if (ticketType === "one-pune-card") discountRate = 0.10;
      if (ticketType === "vidyarthi-pass") discountRate = 0.30;
      var single = Math.round(base * (1 - discountRate));
      var total = isReturn ? single * 2 : single;
      return {
        baseSingle: base,
        discountRate: discountRate,
        singleFare: single,
        totalFare: total
      };
    }
  };
})();
