const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL, URLSearchParams } = require("url");

const base = path.resolve(__dirname, "frontend");
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const PUNE_FARE_URL = "https://www.punemetrorail.org/fare_chart.aspx";
let stationCache = null;
const fareCache = new Map();

function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (resp) => {
      let data = "";
      resp.on("data", (chunk) => (data += chunk));
      resp.on("end", () => resolve({ data, headers: resp.headers }));
    }).on("error", reject);
  });
}

function httpPost(url, form, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = form.toString();
    const req = https.request(
      {
        method: "POST",
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(payload),
          ...headers
        }
      },
      (resp) => {
        let data = "";
        resp.on("data", (chunk) => (data += chunk));
        resp.on("end", () => resolve({ data, headers: resp.headers }));
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function normalizeStationName(name) {
  const aliases = {
    "pcmc bhavan": "pcmc",
    "nashik phata": "nashik phata bhosari",
    "civil court": "district court",
    "pmc bhavan": "pmc",
    "pune junction": "pune railway station",
    "yerawada": "yerwada"
  };

  const normalized = String(name || "")
    .toLowerCase()
    .replace(/shivajinagar/g, "shivaji nagar")
    .replace(/bhosari nashik phata/g, "nashik phata bhosari")
    .replace(/[\.\(\)]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return aliases[normalized] || normalized;
}

function parseHiddenField(html, id) {
  const re = new RegExp(`name="${id}" id="${id}" value="([^"]+)"`);
  const m = html.match(re);
  return m ? m[1] : "";
}

async function getFareContext() {
  const now = Date.now();
  if (stationCache && now - stationCache.ts < 10 * 60 * 1000) {
    return stationCache;
  }

  const first = await httpGet(PUNE_FARE_URL);
  const html = first.data;
  const cookies = (first.headers["set-cookie"] || []).map((s) => s.split(";")[0]).join("; ");

  const viewState = parseHiddenField(html, "__VIEWSTATE");
  const eventValidation = parseHiddenField(html, "__EVENTVALIDATION");
  const viewStateGenerator = parseHiddenField(html, "__VIEWSTATEGENERATOR");
  const matches = [...html.matchAll(/<option value="(\d+)">([^<]+)<\/option>/g)];
  const stations = matches
    .map((m) => ({ id: m[1], name: m[2].replace(/\s+/g, " ").trim() }))
    .filter((s) => s.id !== "0");

  const stationByNorm = {};
  stations.forEach((s) => {
    stationByNorm[normalizeStationName(s.name)] = s.id;
  });

  stationCache = {
    ts: now,
    cookies,
    viewState,
    eventValidation,
    viewStateGenerator,
    stationByNorm
  };
  return stationCache;
}

function parseFare(html) {
  const m = html.match(/class="color_light_purple">₹&nbsp\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

async function getOfficialPuneFare(fromName, toName) {
  const key = `${fromName}__${toName}`;
  if (fareCache.has(key)) return fareCache.get(key);

  const ctx = await getFareContext();
  const fromId = ctx.stationByNorm[normalizeStationName(fromName)];
  const toId = ctx.stationByNorm[normalizeStationName(toName)];
  if (!fromId || !toId) {
    return { fare: null, source: "official", reason: "station_not_found" };
  }

  const form = new URLSearchParams({
    __VIEWSTATE: ctx.viewState,
    __VIEWSTATEGENERATOR: ctx.viewStateGenerator,
    __EVENTVALIDATION: ctx.eventValidation,
    ddlFrom: fromId,
    ddlTo: toId,
    btnShowRoute: "Know you fare",
    textcaptcha: "codex"
  });
  const posted = await httpPost(PUNE_FARE_URL, form, { Cookie: ctx.cookies });
  const fare = parseFare(posted.data);
  const out = { fare, source: "official", reason: fare == null ? "fare_not_found" : "ok" };
  fareCache.set(key, out);
  return out;
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, "http://127.0.0.1:5500");
    if (reqUrl.pathname === "/api/pune-fare") {
      const from = reqUrl.searchParams.get("from");
      const to = reqUrl.searchParams.get("to");
      if (!from || !to) {
        sendJson(res, 400, { error: "Missing from/to" });
        return;
      }
      const fare = await getOfficialPuneFare(from, to);
      sendJson(res, 200, fare);
      return;
    }

    let urlPath = reqUrl.pathname;
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.normalize(path.join(base, urlPath));
    if (!filePath.startsWith(base)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }
      res.setHeader("Content-Type", mime[path.extname(filePath)] || "text/plain");
      res.end(data);
    });
  } catch (error) {
    sendJson(res, 500, { error: "server_error", detail: String(error && error.message ? error.message : error) });
  }
});

server.listen(5500, "127.0.0.1");
