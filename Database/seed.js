const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing database for comprehensive re-seed...');
    await prisma.connection.deleteMany({});
    await prisma.station.deleteMany({});
    await prisma.city.deleteMany({});

    console.log('Seeding comprehensive Maharashtra data...');

    // 1. Create Cities
    const cities = [
        { id: 'mumbai', name: 'Mumbai' },
        { id: 'pune', name: 'Pune' },
        { id: 'nagpur', name: 'Nagpur' },
    ];

    for (const city of cities) {
        await prisma.city.create({ data: city });
    }

    // 2. Define Stations
    const stationData = [
        // --- MUMBAI SUBURBAN & METRO ---
        { id: "m_csmt", name: "Mumbai CSMT", x: 50, y: 600, lines: "Central,Harbor", cityId: "mumbai" },
        { id: "m_msd", name: "Masjid", x: 55, y: 590, lines: "Central,Harbor", cityId: "mumbai" },
        { id: "m_snrd", name: "Sandhurst Road", x: 60, y: 580, lines: "Central,Harbor", cityId: "mumbai" },
        { id: "m_byc", name: "Byculla", x: 65, y: 570, lines: "Central", cityId: "mumbai" },
        { id: "m_chg", name: "Chinchpokli", x: 70, y: 565, lines: "Central", cityId: "mumbai" },
        { id: "m_crp", name: "Currey Road", x: 75, y: 560, lines: "Central", cityId: "mumbai" },
        { id: "m_parel", name: "Parel", x: 80, y: 555, lines: "Central", cityId: "mumbai" },
        { id: "m_dadar_c", name: "Dadar (CR)", x: 85, y: 550, lines: "Central", cityId: "mumbai" },
        { id: "m_mat", name: "Matunga", x: 90, y: 540, lines: "Central", cityId: "mumbai" },
        { id: "m_sin", name: "Sion", x: 100, y: 530, lines: "Central", cityId: "mumbai" },
        { id: "m_kurla", name: "Kurla", x: 110, y: 520, lines: "Central,Harbor", cityId: "mumbai" },
        { id: "m_vikh", name: "Vikhroli", x: 130, y: 500, lines: "Central", cityId: "mumbai" },
        { id: "m_kan", name: "Kanjurmarg", x: 140, y: 490, lines: "Central", cityId: "mumbai" },
        { id: "m_bnd", name: "Bhandup", x: 150, y: 480, lines: "Central", cityId: "mumbai" },
        { id: "m_mlnd", name: "Mulund", x: 165, y: 470, lines: "Central", cityId: "mumbai" },
        { id: "m_thane", name: "Thane", x: 180, y: 460, lines: "Central", cityId: "mumbai" },
        { id: "m_diva", name: "Diva", x: 200, y: 450, lines: "Central", cityId: "mumbai" },
        { id: "m_domb", name: "Dombivli", x: 215, y: 440, lines: "Central", cityId: "mumbai" },
        { id: "m_kalyan", name: "Kalyan", x: 230, y: 430, lines: "Central", cityId: "mumbai" },

        { id: "m_chu", name: "Churchgate", x: 30, y: 600, lines: "Western", cityId: "mumbai" },
        { id: "m_mcl", name: "Marine Lines", x: 35, y: 590, lines: "Western", cityId: "mumbai" },
        { id: "m_ctr", name: "Charni Road", x: 40, y: 580, lines: "Western", cityId: "mumbai" },
        { id: "m_gtr", name: "Grant Road", x: 45, y: 570, lines: "Western", cityId: "mumbai" },
        { id: "m_bcl", name: "Mumbai Central", x: 50, y: 560, lines: "Western", cityId: "mumbai" },
        { id: "m_mx", name: "Mahalakshmi", x: 55, y: 550, lines: "Western", cityId: "mumbai" },
        { id: "m_plr", name: "Lower Parel", x: 60, y: 540, lines: "Western", cityId: "mumbai" },
        { id: "m_pl", name: "Prabhadevi", x: 65, y: 535, lines: "Western", cityId: "mumbai" },
        { id: "m_dadar_w", name: "Dadar (WR)", x: 70, y: 530, lines: "Western", cityId: "mumbai" },
        { id: "m_mr", name: "Matunga Road", x: 75, y: 520, lines: "Western", cityId: "mumbai" },
        { id: "m_mm", name: "Mahim Jn", x: 80, y: 510, lines: "Western,Harbor", cityId: "mumbai" },
        { id: "m_ba", name: "Bandra", x: 90, y: 500, lines: "Western", cityId: "mumbai" },
        { id: "m_khar", name: "Khar Road", x: 100, y: 490, lines: "Western", cityId: "mumbai" },
        { id: "m_stc", name: "Santa Cruz", x: 110, y: 480, lines: "Western", cityId: "mumbai" },
        { id: "m_vlp", name: "Vile Parle", x: 120, y: 470, lines: "Western", cityId: "mumbai" },
        { id: "m_andh", name: "Andheri", x: 130, y: 460, lines: "Western,Metro-1", cityId: "mumbai" },
        { id: "m_jog", name: "Jogeshwari", x: 140, y: 440, lines: "Western", cityId: "mumbai" },
        { id: "m_gor", name: "Goregaon", x: 150, y: 420, lines: "Western", cityId: "mumbai" },
        { id: "m_md", name: "Malad", x: 160, y: 400, lines: "Western", cityId: "mumbai" },
        { id: "m_kiv", name: "Kandivli", x: 170, y: 380, lines: "Western", cityId: "mumbai" },
        { id: "m_bor", name: "Borivali", x: 180, y: 360, lines: "Western", cityId: "mumbai" },

        // --- PUNE METRO (Line 1 & 2) ---
        { id: "p_pcmc", name: "PCMC Bhavan", x: 400, y: 700, lines: "Purple", cityId: "pune" },
        { id: "p_stn", name: "Sant Tukaram Nagar", x: 405, y: 710, lines: "Purple", cityId: "pune" },
        { id: "p_np", name: "Nashik Phata", x: 410, y: 720, lines: "Purple", cityId: "pune" },
        { id: "p_kas", name: "Kasarwadi", x: 415, y: 730, lines: "Purple", cityId: "pune" },
        { id: "p_phu", name: "Phugewadi", x: 420, y: 740, lines: "Purple", cityId: "pune" },
        { id: "p_dap", name: "Dapodi", x: 425, y: 750, lines: "Purple", cityId: "pune" },
        { id: "p_bop", name: "Bopodi", x: 430, y: 760, lines: "Purple", cityId: "pune" },
        { id: "p_shv", name: "Shivaji Nagar", x: 435, y: 770, lines: "Purple,Central", cityId: "pune" },
        { id: "p_cc", name: "Civil Court", x: 440, y: 780, lines: "Purple,Aqua", cityId: "pune" },
        { id: "p_st", name: "Swargate", x: 445, y: 790, lines: "Purple", cityId: "pune" },

        { id: "p_van", name: "Vanaz", x: 420, y: 780, lines: "Aqua", cityId: "pune" },
        { id: "p_anand", name: "Anand Nagar", x: 425, y: 780, lines: "Aqua", cityId: "pune" },
        { id: "p_nal", name: "Nal Stop", x: 430, y: 780, lines: "Aqua", cityId: "pune" },
        { id: "p_gar", name: "Garware College", x: 435, y: 780, lines: "Aqua", cityId: "pune" },
        { id: "p_pmc", name: "PMC Bhavan", x: 440, y: 775, lines: "Aqua", cityId: "pune" },
        { id: "p_pune_jn", name: "Pune Junction", x: 450, y: 780, lines: "Aqua,Central", cityId: "pune" },
        { id: "p_ruby", name: "Ruby Hall Clinic", x: 455, y: 780, lines: "Aqua", cityId: "pune" },
        { id: "p_yer", name: "Yerawada", x: 465, y: 780, lines: "Aqua", cityId: "pune" },
        { id: "p_ram", name: "Ramwadi", x: 475, y: 780, lines: "Aqua", cityId: "pune" },

        // --- NAGPUR METRO (Orange & Aqua) ---
        { id: "n_auto", name: "Automotive Square", x: 880, y: 400, lines: "Orange", cityId: "nagpur" },
        { id: "n_nari", name: "Nari Road", x: 880, y: 410, lines: "Orange", cityId: "nagpur" },
        { id: "n_gad", name: "Gaddi Godam Sq", x: 880, y: 430, lines: "Orange", cityId: "nagpur" },
        { id: "n_kast", name: "Kasturchand Park", x: 880, y: 440, lines: "Orange", cityId: "nagpur" },
        { id: "n_zm", name: "Zero Mile", x: 880, y: 450, lines: "Orange", cityId: "nagpur" },
        { id: "n_sit", name: "Sitabuldi Interchange", x: 880, y: 460, lines: "Orange,Aqua", cityId: "nagpur" },
        { id: "n_cong", name: "Congress Nagar", x: 880, y: 470, lines: "Orange", cityId: "nagpur" },
        { id: "n_airport", name: "Airport", x: 880, y: 490, lines: "Orange", cityId: "nagpur" },
        { id: "n_khapri", name: "Khapri", x: 880, y: 510, lines: "Orange", cityId: "nagpur" },

        { id: "n_praj", name: "Prajapati Nagar", x: 840, y: 460, lines: "Aqua", cityId: "nagpur" },
        { id: "n_amb", name: "Ambedkar Sq", x: 850, y: 460, lines: "Aqua", cityId: "nagpur" },
        { id: "n_nag_stn", name: "Nagpur Rly Stn", x: 870, y: 460, lines: "Aqua", cityId: "nagpur" },
        { id: "n_rani", name: "Jhansi Rani Sq", x: 890, y: 460, lines: "Aqua", cityId: "nagpur" },
        { id: "n_inst", name: "Inst of Engineers", x: 900, y: 460, lines: "Aqua", cityId: "nagpur" },
        { id: "n_subh", name: "Subhash Nagar", x: 920, y: 460, lines: "Aqua", cityId: "nagpur" },
        { id: "n_lok", name: "Lokmanya Nagar", x: 940, y: 460, lines: "Aqua", cityId: "nagpur" },
    ];

    for (const s of stationData) {
        await prisma.station.create({ data: s });
    }

    // 3. Define Connections (Simplified linear paths for demo)
    const connectionData = [
        // Mumbai Central Line
        { f: "m_csmt", t: "m_msd", d: 2, c: 5, s: 1 },
        { f: "m_msd", t: "m_snrd", d: 2, c: 5, s: 1 },
        { f: "m_snrd", t: "m_byc", d: 3, c: 5, s: 1 },
        { f: "m_byc", t: "m_dadar_c", d: 5, c: 10, s: 3 },
        { f: "m_dadar_c", t: "m_kurla", d: 7, c: 10, s: 3 },
        { f: "m_kurla", t: "m_thane", d: 18, c: 15, s: 6 },
        { f: "m_thane", t: "m_kalyan", d: 20, c: 15, s: 5 },

        // Mumbai Western Line
        { f: "m_chu", t: "m_mcl", d: 2, c: 5, s: 1 },
        { f: "m_mcl", t: "m_bcl", d: 4, c: 5, s: 2 },
        { f: "m_bcl", t: "m_dadar_w", d: 6, c: 10, s: 3 },
        { f: "m_dadar_w", t: "m_ba", d: 6, c: 10, s: 2 },
        { f: "m_ba", t: "m_andh", d: 8, c: 10, s: 4 },
        { f: "m_andh", t: "m_bor", d: 15, c: 15, s: 5 },

        // Pune Purple Line
        { f: "p_pcmc", t: "p_stn", d: 2, c: 10, s: 1 },
        { f: "p_stn", t: "p_np", d: 2, c: 10, s: 1 },
        { f: "p_np", t: "p_shv", d: 8, c: 20, s: 4 },
        { f: "p_shv", t: "p_cc", d: 2, c: 5, s: 1 },
        { f: "p_cc", t: "p_st", d: 3, c: 10, s: 2 },

        // Pune Aqua Line
        { f: "p_van", t: "p_nal", d: 4, c: 15, s: 2 },
        { f: "p_nal", t: "p_cc", d: 4, c: 15, s: 3 },
        { f: "p_cc", t: "p_pune_jn", d: 2, c: 10, s: 1 },
        { f: "p_pune_jn", t: "p_ruby", d: 1, c: 10, s: 1 },
        { f: "p_ruby", t: "p_ram", d: 6, c: 20, s: 5 },

        // Nagpur Orange Line
        { f: "n_auto", t: "n_gad", d: 5, c: 15, s: 2 },
        { f: "n_gad", t: "n_kast", d: 2, c: 10, s: 1 },
        { f: "n_kast", t: "n_sit", d: 2, c: 10, s: 1 },
        { f: "n_sit", t: "n_airport", d: 8, c: 20, s: 4 },
        { f: "n_airport", t: "n_khapri", d: 4, c: 15, s: 2 },

        // Nagpur Aqua Line
        { f: "n_praj", t: "n_nag_stn", d: 6, c: 15, s: 4 },
        { f: "n_nag_stn", t: "n_sit", d: 1, c: 10, s: 1 },
        { f: "n_sit", t: "n_subh", d: 6, c: 15, s: 4 },
        { f: "n_subh", t: "n_lok", d: 4, c: 15, s: 2 },
    ];

    for (const c of connectionData) {
        // Add bidirectional connections
        await prisma.connection.create({
            data: { fromId: c.f, toId: c.t, distance: c.d, cost: c.c, stops: c.s },
        });
        await prisma.connection.create({
            data: { fromId: c.t, toId: c.f, distance: c.d, cost: c.c, stops: c.s },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
