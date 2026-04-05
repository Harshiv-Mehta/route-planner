const path = require("path");
const { execFileSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const cityCount = await prisma.city.count();

  if (cityCount > 0) {
    console.log("Database already has seeded data. Skipping bootstrap seed.");
    return;
  }

  console.log("Database is empty. Running initial seed...");
  const seedPath = path.resolve(__dirname, "..", "Database", "seed.js");
  execFileSync(process.execPath, [seedPath], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
    env: process.env
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
