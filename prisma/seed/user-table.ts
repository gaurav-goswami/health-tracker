import prisma from "../../src/config/db";
import TokenAndCredentialsService from "../../src/services/token-and-credentials-service";

const token_and_credentials_service = new TokenAndCredentialsService();

const USERS = [
  {
    email: "user@user.com",
    password: "password",
    firstName: "User",
  },
  {
    email: "test@test.com",
    password: "password",
    firstName: "Jane",
  },
  {
    email: "example@eg.com",
    password: "password",
    firstName: "John",
  },
];

export const seedUserTable = async () => {
  const currentUserTable = await prisma.user.count();

  if (currentUserTable > 0) {
    return;
  }

  // logger.info("Seeding user table");
  for (const user of USERS) {
    await prisma.user.create({
      data: {
        email: user.email,
        password: await token_and_credentials_service.hashPassword(user.password),
        firstName: user.firstName,
      },
    });
  }
};
