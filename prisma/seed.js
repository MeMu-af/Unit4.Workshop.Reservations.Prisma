const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seed = async () => {
  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: "Alice Smith",
      reservations: {
        create: [
          {
            date: new Date("2025-04-06T19:00:00-04:00"),
            partyCount: 2,
            restaurant: {
              connect: { id: 1 }, 
            },
          },
          {
            date: new Date("2025-04-12T18:30:00-04:00"),
            partyCount: 4,
            restaurant: {
              connect: { id: 2 }, 
            },
          },
        ],
      },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Bob Johnson",
      reservations: {
        create: [
          {
            date: new Date("2025-04-07T20:00:00-04:00"),
            partyCount: 3,
            restaurant: {
              connect: { id: 1 },
            },
          },
        ],
      },
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: "Charlie Brown",
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: "Diana Lee",
    },
  });

  // Create Restaurants
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: "The Italian Place",
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: "Sushi House",
    },
  });

  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: "Burger Joint",
    },
  });

  // Create additional Reservations 
  await prisma.reservation.create({
    data: {
      date: new Date("2025-04-15T19:30:00-04:00"),
      partyCount: 2,
      customer: {
        connect: { id: customer3.id },
      },
      restaurant: {
        connect: { id: restaurant2.id },
      },
    },
  });

  console.log("Seeding completed successfully!");
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
