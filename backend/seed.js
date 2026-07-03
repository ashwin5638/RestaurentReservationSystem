require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('./src/models/Table');

const tables = [
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 2 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 4 },
  { tableNumber: 5, capacity: 4 },
  { tableNumber: 6, capacity: 6 },
  { tableNumber: 7, capacity: 6 },
  { tableNumber: 8, capacity: 8 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Table.deleteMany({});
    console.log('Cleared existing tables');

    const created = await Table.insertMany(tables);
    console.log(`Seeded ${created.length} tables`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
