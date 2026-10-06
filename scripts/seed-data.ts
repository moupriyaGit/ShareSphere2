import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sharesphere";

async function runSeed() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection;
  const usersColl = db.collection("users");
  const reqColl = db.collection("requirements");
  const donColl = db.collection("donations");
  const allocColl = db.collection("allocations");
  const impColl = db.collection("impactrecords");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Admin
  await usersColl.updateOne(
    { email: "admin@sharesphere.org" },
    {
      $set: {
        name: "ShareSphere System Admin",
        email: "admin@sharesphere.org",
        password: hashedPassword,
        role: "admin",
        location: "Central Hub, New Delhi",
        latitude: 28.6139,
        longitude: 77.209,
        trustScore: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 2. Donor (Connaught Place, New Delhi)
  const donorRes = await usersColl.findOneAndUpdate(
    { email: "donor@sharesphere.org" },
    {
      $set: {
        name: "Rajesh Sharma",
        email: "donor@sharesphere.org",
        password: hashedPassword,
        role: "donor",
        location: "Connaught Place, New Delhi",
        latitude: 28.6315,
        longitude: 77.2167,
        trustScore: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );
  const donorUser = donorRes;

  // 3. NGO A: Hope Foundation (Lajpat Nagar, South Delhi: ~7.2 km away)
  const ngoARes = await usersColl.findOneAndUpdate(
    { email: "hope@ngo.org" },
    {
      $set: {
        name: "Hope Shelter Foundation",
        email: "hope@ngo.org",
        password: hashedPassword,
        role: "ngo",
        location: "Lajpat Nagar, South Delhi",
        latitude: 28.57,
        longitude: 77.24,
        trustScore: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );
  const ngoA = ngoARes;

  // 4. NGO B: Care India Relief (Rohini, North West Delhi: ~13.3 km away)
  const ngoBRes = await usersColl.findOneAndUpdate(
    { email: "care@ngo.org" },
    {
      $set: {
        name: "Care India Relief",
        email: "care@ngo.org",
        password: hashedPassword,
        role: "ngo",
        location: "Rohini Sector 7, North West Delhi",
        latitude: 28.715,
        longitude: 77.119,
        trustScore: 85,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );
  const ngoB = ngoBRes;

  // 5. NGO C: Seva Social Trust (Noida Sector 18: ~12.7 km away)
  const ngoCRes = await usersColl.findOneAndUpdate(
    { email: "seva@ngo.org" },
    {
      $set: {
        name: "Seva Community Trust",
        email: "seva@ngo.org",
        password: hashedPassword,
        role: "ngo",
        location: "Sector 18, Noida",
        latitude: 28.5708,
        longitude: 77.3271,
        trustScore: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );
  const ngoC = ngoCRes;

  // Reset demo requirements
  await reqColl.deleteMany({
    requirementId: { $in: ["REQ-401102", "REQ-302204", "REQ-503306", "REQ-109921", "REQ-208843"] },
  });

  // Insert Tech Mela requirements
  await reqColl.insertMany([
    {
      requirementId: "REQ-401102",
      ngoId: ngoA._id,
      ngoName: ngoA.name,
      itemName: "Winter Blankets",
      category: "Clothes & Blankets",
      quantityNeeded: 40,
      quantityReceived: 0,
      description: "Severe cold wave relief for homeless night shelters in South Delhi.",
      location: ngoA.location,
      latitude: ngoA.latitude,
      longitude: ngoA.longitude,
      urgency: "CRITICAL",
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      requirementId: "REQ-302204",
      ngoId: ngoB._id,
      ngoName: ngoB.name,
      itemName: "Warm Blankets",
      category: "Clothes & Blankets",
      quantityNeeded: 30,
      quantityReceived: 0,
      description: "Warm bedding needed for destitute elderly residents in Rohini care home.",
      location: ngoB.location,
      latitude: ngoB.latitude,
      longitude: ngoB.longitude,
      urgency: "HIGH",
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      requirementId: "REQ-503306",
      ngoId: ngoC._id,
      ngoName: ngoC.name,
      itemName: "Thermal Fleece Blankets",
      category: "Clothes & Blankets",
      quantityNeeded: 50,
      quantityReceived: 0,
      description: "Winter preparedness drive for migrant worker settlement clusters.",
      location: ngoC.location,
      latitude: ngoC.latitude,
      longitude: ngoC.longitude,
      urgency: "MEDIUM",
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      requirementId: "REQ-109921",
      ngoId: ngoA._id,
      ngoName: ngoA.name,
      itemName: "Dry Ration Food Kits",
      category: "Food & Ration",
      quantityNeeded: 80,
      quantityReceived: 0,
      description: "Monthly rice, wheat, and pulses for underprivileged family households.",
      location: ngoA.location,
      latitude: ngoA.latitude,
      longitude: ngoA.longitude,
      urgency: "HIGH",
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      requirementId: "REQ-208843",
      ngoId: ngoB._id,
      ngoName: ngoB.name,
      itemName: "School Book & Stationery Kits",
      category: "Education & Books",
      quantityNeeded: 120,
      quantityReceived: 0,
      description: "Notebooks and learning kits for children in community evening classes.",
      location: ngoB.location,
      latitude: ngoB.latitude,
      longitude: ngoB.longitude,
      urgency: "MEDIUM",
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log("✓ Tech Mela Demo Data successfully seeded into MongoDB!");
  console.log("  - Demo Donor: donor@sharesphere.org / password123 (Connaught Place)");
  console.log("  - NGO A: hope@ngo.org / password123 (Hope Shelter Foundation, 40 Blankets CRITICAL)");
  console.log("  - NGO B: care@ngo.org / password123 (Care India Relief, 30 Blankets HIGH)");
  console.log("  - NGO C: seva@ngo.org / password123 (Seva Community Trust, 50 Blankets MEDIUM)");
  console.log("  - Admin: admin@sharesphere.org / password123");

  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
