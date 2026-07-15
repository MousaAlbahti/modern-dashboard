import PocketBase, { RecordModel } from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

// Helper to clear existing data in relational order
async function clearCollection(name: string) {
  try {
    const records = await pb.collection(name).getFullList({ fields: "id" });
    for (const record of records) {
      await pb.collection(name).delete(record.id);
    }
    console.log(`✓ Cleared collection: ${name}`);
  } catch (error) {
    console.log(`⚠ Failed to clear collection ${name} (it may not exist yet)`);
  }
}

// Helper to get random dates in past 3 months
function getRandomDateInPast3Months() {
  const start = new Date("2026-05-01T00:00:00").getTime();
  const end = new Date("2026-07-13T23:59:59").getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString();
}

async function runSeed() {
  console.log("Checking connection to PocketBase on http://127.0.0.1:8090...");
  try {
    const health = await fetch("http://127.0.0.1:8090/api/health")
      .then((res) => res.json())
      .catch(() => null);
    if (!health) {
      throw new Error(
        "Could not connect to PocketBase database. Please ensure it is running on port 8090.",
      );
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Connection failed:", errorMsg);
    process.exit(1);
  }

  // First admin setup / authentication
  console.log("Authenticating as admin...");
  try {
    try {
      await pb.admins.create({
        email: "admin@promage.com",
        password: "admin123456",
        passwordConfirm: "admin123456",
      });
      console.log("✓ Created default admin credentials (admin@promage.com)");
    } catch (e) {
      // Admin account already exists, which is expected
    }

    await pb.admins.authWithPassword("admin@promage.com", "admin123456");
    console.log("✓ Successfully authenticated as admin.");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      "Authentication failed. Please verify admin credentials:",
      errorMsg,
    );
    process.exit(1);
  }

  console.log("\nPurging old data...");
  await clearCollection("orders");
  await clearCollection("products");
  await clearCollection("tags");

  // For users, we clean the non-admin users collection
  await clearCollection("users");

  console.log("\nSeeding Tags...");
  const tagsToCreate = ["Electronics", "Accessories", "Home", "Fitness"];
  const createdTags: RecordModel[] = [];
  for (const name of tagsToCreate) {
    const tag = await pb.collection("tags").create({ name });
    createdTags.push(tag);
  }
  console.log(`✓ Seeded ${createdTags.length} tags.`);

  console.log("\nSeeding Products...");
  const productsToCreate = [
    {
      name: "SuperSound Headphones",
      price: 199.99,
      stock: 15,
      description: "Wireless noise-canceling headphones",
      tags: ["Electronics"],
    },
    {
      name: "FitBit Ultra Smartwatch",
      price: 249.99,
      stock: 3,
      description: "Fitness tracker and smartwatch",
      tags: ["Electronics", "Fitness"],
    },
    {
      name: "Ergonomic Office Chair",
      price: 349.99,
      stock: 8,
      description: "High-back mesh ergonomic chair",
      tags: ["Home"],
    },
    {
      name: "Dumbbell Set (20kg)",
      price: 89.99,
      stock: 20,
      description: "Adjustable dumbbell set with stand",
      tags: ["Fitness"],
    },
    {
      name: "USB-C Hub Multiport",
      price: 49.99,
      stock: 5,
      description: "8-in-1 USB-C dongle accessories",
      tags: ["Accessories", "Electronics"],
    },
    {
      name: "LED Desk Lamp",
      price: 29.99,
      stock: 2,
      description: "Dimmable desk lamp with wireless charger",
      tags: ["Home", "Accessories"],
    },
    {
      name: "Mechanical Keyboard",
      price: 129.99,
      stock: 12,
      description: "Hot-swappable RGB mechanical keyboard",
      tags: ["Electronics", "Accessories"],
    },
    {
      name: "Yoga Mat Pro",
      price: 39.99,
      stock: 25,
      description: "Eco-friendly non-slip exercise yoga mat",
      tags: ["Fitness"],
    },
    {
      name: "Smart LED Light Bulb",
      price: 19.99,
      stock: 35,
      description: "RGB smart bulb compatible with Alexa",
      tags: ["Home", "Electronics"],
    },
    {
      name: "Leather Wallet Minimalist",
      price: 59.99,
      stock: 18,
      description: "RFID blocking slim leather card holder",
      tags: ["Accessories"],
    },
  ];

  const createdProducts: RecordModel[] = [];
  for (const p of productsToCreate) {
    const tagIds = p.tags
      .map((tName) => createdTags.find((t) => t.name === tName)?.id)
      .filter(Boolean);
    const product = await pb.collection("products").create({
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description,
      tags: tagIds,
    });
    createdProducts.push(product);
  }
  console.log(`✓ Seeded ${createdProducts.length} products.`);

  console.log("\nSeeding Users...");
  const createdUsers: RecordModel[] = [];
  for (let i = 1; i <= 20; i++) {
    const email = `user${i}@example.com`;
    const createdDate = getRandomDateInPast3Months();
    const user = await pb.collection("users").create({
      email,
      emailVisibility: true,
      password: "password123456",
      passwordConfirm: "password123456",
      name: `Test User ${i}`,
      created: createdDate,
      verified: true,
    });
    createdUsers.push(user);
  }
  console.log(`✓ Seeded ${createdUsers.length} users.`);

  console.log("\nSeeding Orders...");
  const createdOrders: RecordModel[] = [];
  const statuses = ["pending", "shipped", "delivered"];

  for (let i = 1; i <= 35; i++) {
    const randomUser =
      createdUsers[Math.floor(Math.random() * createdUsers.length)];

    // Select 1 to 3 random products
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const selectedProducts: string[] = [];
    let total_price = 0;

    for (let j = 0; j < numProducts; j++) {
      const prod =
        createdProducts[Math.floor(Math.random() * createdProducts.length)];
      selectedProducts.push(prod.id);
      total_price += prod.price;
    }

    // Make order date random between user's registration date and end of July
    const userRegTime = new Date(randomUser.created).getTime();
    const endTime = new Date("2026-07-13T23:59:59").getTime();
    const orderTime = userRegTime + Math.random() * (endTime - userRegTime);
    const createdDate = new Date(orderTime).toISOString();
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const order = await pb.collection("orders").create({
      user: randomUser.id,
      products: selectedProducts,
      status,
      total_price: parseFloat(total_price.toFixed(2)),
      created: createdDate,
    });
    createdOrders.push(order);
  }
  console.log(`✓ Seeded ${createdOrders.length} orders.`);

  console.log("\n=================================");
  console.log("Database Seeding Successful!");
  console.log(`- Tags: ${createdTags.length}`);
  console.log(`- Products: ${createdProducts.length}`);
  console.log(`- Users: ${createdUsers.length}`);
  console.log(`- Orders: ${createdOrders.length}`);
  console.log("=================================\n");
}

runSeed().catch((error) => {
  console.error("Seeding script failed with unexpected error:", error);
  process.exit(1);
});
