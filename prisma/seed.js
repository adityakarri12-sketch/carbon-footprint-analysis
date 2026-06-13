const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const recommendations = [
    // Transportation
    { description: 'Use public transport instead of driving for a week.', category: 'Transportation', points: 50 },
    { description: 'Carpool with a colleague for a month.', category: 'Transportation', points: 80 },
    { description: 'Bike or walk to work/school twice a week.', category: 'Transportation', points: 60 },
    { description: 'Offset your flight emissions for your next trip.', category: 'Transportation', points: 100 },
    { description: 'Switch to an electric vehicle.', category: 'Transportation', points: 500 },

    // Electricity
    { description: 'Switch to LED light bulbs in your entire home.', category: 'Electricity', points: 40 },
    { description: 'Unplug electronics when not in use for a month.', category: 'Electricity', points: 30 },
    { description: 'Install a smart thermostat to optimize heating/cooling.', category: 'Electricity', points: 120 },
    { description: 'Install solar panels on your roof.', category: 'Electricity', points: 1000 },
    { description: 'Wash clothes in cold water.', category: 'Electricity', points: 25 },

    // Food
    { description: 'Eat vegetarian for one week.', category: 'Food', points: 70 },
    { description: 'Start a compost bin for your food scraps.', category: 'Food', points: 50 },
    { description: 'Buy local produce from a farmer\'s market.', category: 'Food', points: 40 },
    { description: 'Reduce food waste by planning meals for a week.', category: 'Food', points: 60 },
    { description: 'Grow your own herbs or vegetables.', category: 'Food', points: 90 },

    // Waste
    { description: 'Avoid single-use plastics for a month.', category: 'Waste', points: 80 },
    { description: 'Use a reusable water bottle and coffee cup.', category: 'Waste', points: 40 },
    { description: 'Recycle all eligible materials for a month.', category: 'Waste', points: 50 },
    { description: 'Repair a broken item instead of replacing it.', category: 'Waste', points: 30 },
    { description: 'Donate old clothes and items instead of throwing them away.', category: 'Waste', points: 20 },
  ];

  for (const rec of recommendations) {
    await prisma.recommendation.create({
      data: rec,
    });
  }

  console.log('Seeded recommendations');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
