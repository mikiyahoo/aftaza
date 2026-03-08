import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

async function main() {
  const email = "admin@aftaza.internal";
  const password = "admin123";
  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log(`Admin user created: ${user.email} with role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
