const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("./models/User");
const Service = require("./models/Service");
const Appointment = require("./models/Appointment");

// 🔌 Connexion MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/rdv_db");

// ========================
// 🔧 HELPERS (bruit contrôlé)
// ========================
const maybe = (p) => Math.random() < p;

const noisyText = (text) => {
  if (maybe(0.15)) return " " + text + " ";
  if (maybe(0.1)) return text.toUpperCase();
  if (maybe(0.1)) return text.toLowerCase();
  return text;
};

// ========================
// 1️⃣ USERS
// ========================
const generateUsers = async () => {
  await User.deleteMany();

  const users = [];

  // Clients
  for (let i = 0; i < 300; i++) {
    users.push({
      name: noisyText(faker.person.fullName()),
      email: faker.internet.email().toLowerCase(),
      password: "123456",
      role: "client"
    });
  }

  // Providers
  for (let i = 0; i < 40; i++) {
    users.push({
      name: noisyText(faker.person.fullName()),
      email: faker.internet.email().toLowerCase(),
      password: "123456",
      role: "provider"
    });
  }

  return await User.insertMany(users);
};

// ========================
// 2️⃣ SERVICES
// ========================
const serviceTitles = [
  "Consultation generale",
  "Consultation générale",
  "Consultation spécialisée",
  "Consultation specilaisée",
  "Suivi medical",
  "Thérapie",
  "Diagnostic"
];

const generateServices = async (providers) => {
  await Service.deleteMany();
  const services = [];

  providers.forEach(provider => {
    const nbServices = faker.number.int({ min: 3, max: 5 });

    for (let i = 0; i < nbServices; i++) {
      services.push({
        provider: provider._id,
        title: noisyText(faker.helpers.arrayElement(serviceTitles)),
        description: maybe(0.2) ? "" : faker.lorem.sentence(),
        price: maybe(0.05)
          ? 0
          : maybe(0.05)
          ? faker.number.int({ min: 500, max: 1000 })
          : faker.number.int({ min: 50, max: 300 }),
        duration: faker.helpers.arrayElement([15, 30, 45, 60])
      });
    }
  });

  return await Service.insertMany(services);
};

// ========================
// 3️⃣ APPOINTMENTS (FACT BI)
// ========================
const generateAppointments = async (clients, services) => {
  await Appointment.deleteMany();
  const appointments = [];

  const now = new Date();

  for (let i = 0; i < 10000; i++) {
    const service = faker.helpers.arrayElement(services);

    const date = faker.date.between({
      from: "2023-01-01",
      to: "2026-12-31"
    });

    let status;
    if (date > now) {
      status = "scheduled";
    } else {
      status = faker.helpers.arrayElement(["completed", "cancelled"]);
    }

    appointments.push({
      client: faker.helpers.arrayElement(clients)._id,
      provider: service.provider,
      service: service._id,
      date,
      status,
      notes: maybe(0.25)
        ? ""
        : faker.lorem.words(faker.number.int({ min: 3, max: 10 }))
    });
  }

  await Appointment.insertMany(appointments);
};

// ========================
// 🚀 EXECUTION
// ========================
const seed = async () => {
  try {
    const users = await generateUsers();
    const clients = users.filter(u => u.role === "client");
    const providers = users.filter(u => u.role === "provider");

    const services = await generateServices(providers);
    await generateAppointments(clients, services);

    console.log("✅ Données BI volumineuses et réalistes générées");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
