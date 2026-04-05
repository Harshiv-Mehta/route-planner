const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL, URLSearchParams } = require("url");
const { execFile } = require("child_process");

if (!process.env.DATABASE_URL) {
  const localDbPath = path.resolve(__dirname, "Database", "dev.db").replace(/\\/g, "/");
  process.env.DATABASE_URL = `file:${localDbPath}`;
}

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 5500;
const base = path.resolve(__dirname, "frontend");
const seedPath = path.resolve(__dirname, "Database", "seed.js");
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
  const m = html.match(/class="color_light_purple">(?:₹|â‚¹)&nbsp\s*(\d+)/);
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

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function deriveLine(fromLines, toLines) {
  const fromSet = String(fromLines || "")
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean);
  const toSet = String(toLines || "")
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean);
  const shared = fromSet.find((line) => toSet.indexOf(line) > -1);
  return shared || "Connector";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function buildNetwork(cityId) {
  const cityWhere = cityId ? { cityId: cityId } : {};
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
  const stations = await prisma.station.findMany({
    where: cityWhere,
    orderBy: { name: "asc" }
  });

  const stationById = {};
  stations.forEach((station) => {
    stationById[station.id] = station;
  });

  const connections = await prisma.connection.findMany({
    where: cityId
      ? {
          fromStation: { cityId: cityId },
          toStation: { cityId: cityId }
        }
      : undefined,
    include: {
      fromStation: true,
      toStation: true
    },
    orderBy: { id: "asc" }
  });

  const routes = connections.map((connection) => ({
    id: connection.id,
    fromId: connection.fromId,
    toId: connection.toId,
    from: connection.fromStation.name,
    to: connection.toStation.name,
    cityId: connection.fromStation.cityId,
    line: deriveLine(connection.fromStation.lines, connection.toStation.lines),
    distance: connection.distance,
    cost: connection.cost,
    stops: connection.stops
  }));

  return { cities, stations, routes };
}

async function resetDatabase() {
  return new Promise((resolve, reject) => {
    execFile(process.execPath, [seedPath], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      stationCache = null;
      fareCache.clear();
      resolve(stdout);
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);

    if (req.method === "GET" && reqUrl.pathname === "/api/network") {
      const cityId = reqUrl.searchParams.get("cityId") || undefined;
      const network = await buildNetwork(cityId);
      sendJson(res, 200, network);
      return;
    }

    if (req.method === "GET" && reqUrl.pathname === "/api/pune-fare") {
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

    if (req.method === "POST" && reqUrl.pathname === "/api/stations") {
      const body = await readJsonBody(req);
      if (!body.name || !body.cityId) {
        sendJson(res, 400, { error: "Missing station name or cityId" });
        return;
      }

      const baseId = slugify(body.cityId + "_" + body.name);
      let stationId = baseId;
      let suffix = 1;
      while (await prisma.station.findUnique({ where: { id: stationId } })) {
        suffix += 1;
        stationId = `${baseId}_${suffix}`;
      }

      const created = await prisma.station.create({
        data: {
          id: stationId,
          name: body.name,
          cityId: body.cityId,
          lines: body.lines || "Connector",
          x: Number(body.x) || 0,
          y: Number(body.y) || 0
        }
      });
      sendJson(res, 201, created);
      return;
    }

    if (req.method === "POST" && reqUrl.pathname === "/api/connections") {
      const body = await readJsonBody(req);
      const fromStation = body.fromId
        ? await prisma.station.findUnique({ where: { id: body.fromId } })
        : await prisma.station.findFirst({
            where: {
              name: body.from,
              ...(body.cityId ? { cityId: body.cityId } : {})
            }
          });
      const toStation = body.toId
        ? await prisma.station.findUnique({ where: { id: body.toId } })
        : await prisma.station.findFirst({
            where: {
              name: body.to,
              ...(body.cityId ? { cityId: body.cityId } : {})
            }
          });
      if (!fromStation || !toStation) {
        sendJson(res, 404, { error: "Station not found" });
        return;
      }

      const cost = Number(body.cost) || 0;
      const distance = Number(body.distance) || 0;
      const stops = Number(body.stops) || 1;

      await prisma.connection.create({
        data: { fromId: fromStation.id, toId: toStation.id, distance, cost, stops }
      });
      await prisma.connection.create({
        data: { fromId: toStation.id, toId: fromStation.id, distance, cost, stops }
      });

      sendJson(res, 201, { ok: true });
      return;
    }

    if (req.method === "POST" && reqUrl.pathname === "/api/search-history") {
      const body = await readJsonBody(req);
      if (!body.source || !body.destination) {
        sendJson(res, 400, { error: "Missing source/destination" });
        return;
      }
      const created = await prisma.searchHistory.create({
        data: {
          source: body.source,
          destination: body.destination
        }
      });
      sendJson(res, 201, created);
      return;
    }

    if (req.method === "POST" && reqUrl.pathname === "/api/reset-demo") {
      await resetDatabase();
      sendJson(res, 200, { ok: true });
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
    sendJson(res, 500, {
      error: "server_error",
      detail: String(error && error.message ? error.message : error)
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`MetroPath server running on http://127.0.0.1:${PORT}`);
});
