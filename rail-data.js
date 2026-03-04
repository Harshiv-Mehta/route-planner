// Real-World Maharashtra Railway Dataset (Central, Western, Harbor, and Metro)
const MAHA_DATASET = [
    // Mumbai Core
    { id: "csmt", name: "Mumbai CSMT", coord: [50, 400], lines: ["Central", "Harbor"] },
    { id: "churchgate", name: "Churchgate", coord: [40, 410], lines: ["Western"] },
    { id: "dadar_w", name: "Dadar (WR)", coord: [80, 360], lines: ["Western"] },
    { id: "dadar_c", name: "Dadar (CR)", coord: [85, 360], lines: ["Central"] },
    { id: "bandra", name: "Bandra", coord: [90, 320], lines: ["Western"] },
    { id: "kurla", name: "Kurla", coord: [110, 340], lines: ["Central", "Harbor"] },
    { id: "vashi", name: "Vashi", coord: [180, 360], lines: ["Harbor"] },
    { id: "panvel", name: "Panvel", coord: [250, 400], lines: ["Harbor", "Central"] },
    { id: "andheri", name: "Andheri", coord: [85, 280], lines: ["Western", "Metro-1"] },
    { id: "borivali", name: "Borivali", coord: [80, 200], lines: ["Western"] },
    { id: "thane", name: "Thane", coord: [180, 280], lines: ["Central"] },
    { id: "kalyan", name: "Kalyan", coord: [230, 250], lines: ["Central"] },

    // Pune Network
    { id: "pune_jn", name: "Pune Junction", coord: [450, 550], lines: ["Central"] },
    { id: "shivajinagar", name: "Shivajinagar", coord: [430, 550], lines: ["Pune Metro"] },
    { id: "pimpri", name: "Pimpri", coord: [400, 520], lines: ["Pune Metro"] },
    { id: "lonavala", name: "Lonavala", coord: [320, 480], lines: ["Central"] },

    // State Connectors
    { id: "nashik", name: "Nashik Road", coord: [300, 150], lines: ["Main-North"] },
    { id: "aurangabad", name: "Aurangabad", coord: [500, 180], lines: ["Main-East"] },
    { id: "nagpur", name: "Nagpur Junction", coord: [900, 250], lines: ["Main-East"] },
    { id: "amravati", name: "Amravati", coord: [800, 220], lines: ["Main-East"] },
    { id: "akola", name: "Akola", coord: [700, 230], lines: ["Main-East"] },
    { id: "jalgaon", name: "Jalgaon", coord: [450, 100], lines: ["Main-North"] },
    { id: "solapur", name: "Solapur", coord: [650, 700], lines: ["Main-South"] },
    { id: "kolhapur", name: "Kolhapur CSMR", coord: [420, 850], lines: ["Main-South"] },
    { id: "sangli", name: "Sangli", coord: [450, 800], lines: ["Main-South"] },
    { id: "satara", name: "Satara", coord: [380, 700], lines: ["Main-South"] },
    { id: "ratnagiri", name: "Ratnagiri", coord: [150, 750], lines: ["Konkan"] },
    { id: "chiplun", name: "Chiplun", coord: [160, 680], lines: ["Konkan"] },
];

const MAHA_CONNECTIONS = [
    { f: "csmt", t: "dadar_c" }, { f: "churchgate", t: "dadar_w" },
    { f: "dadar_w", t: "bandra" }, { f: "bandra", t: "andheri" },
    { f: "andheri", t: "borivali" }, { f: "dadar_c", t: "kurla" },
    { f: "kurla", t: "vashi" }, { f: "vashi", t: "panvel" },
    { f: "kurla", t: "thane" }, { f: "thane", t: "kalyan" },
    { f: "kalyan", t: "lonavala" }, { f: "lonavala", t: "pune_jn" },
    { f: "pune_jn", t: "shivajinagar" }, { f: "shivajinagar", t: "pimpri" },
    { f: "kalyan", t: "nashik" }, { f: "nashik", t: "jalgaon" },
    { f: "jalgaon", t: "akola" }, { f: "akola", t: "amravati" },
    { f: "amravati", t: "nagpur" }, { f: "pune_jn", t: "solapur" },
    { f: "solapur", t: "sangli" }, { f: "sangli", t: "kolhapur" },
    { f: "panvel", t: "chiplun" }, { f: "chiplun", t: "ratnagiri" }
];
