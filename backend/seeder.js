/**
 * ShopNexus Database Seeder
 *
 * Usage:
 *   node seeder.js --import    → seed database
 *   node seeder.js --destroy   → wipe database
 */

 const mongoose = require("mongoose");
 const dotenv   = require("dotenv");
 const colors   = require("colors");
 const bcrypt   = require("bcryptjs");
 
 dotenv.config({ path: "./.env" });
 
 const User    = require("./models/User");
 const Product = require("./models/Product");
 const Order   = require("./models/Order");
 
 mongoose.connect(process.env.MONGO_URI);
 
 // ── Seed Data ─────────────────────────────────────────────
 
 const users = [
   {
     name:     "Admin User",
     email:    "admin@shopnexus.com",
     password: "admin123",
     role:     "admin",
     phone:    "+92-300-0000001",
     address:  { street: "123 Admin St", city: "Karachi", state: "Sindh", zip: "74000", country: "Pakistan" },
   },
   {
     name:     "Alice Johnson",
     email:    "alice@example.com",
     password: "password123",
     role:     "user",
     phone:    "+1-555-0101",
     address:  { street: "456 Oak Ave", city: "New York", state: "NY", zip: "10001", country: "USA" },
   },
   {
     name:     "Bob Smith",
     email:    "bob@example.com",
     password: "password123",
     role:     "user",
     phone:    "+44-20-0000001",
     address:  { street: "789 Baker Street", city: "London", state: "England", zip: "NW1 6XE", country: "UK" },
   },
   {
     name:     "Sara Khan",
     email:    "sara@example.com",
     password: "password123",
     role:     "user",
     phone:    "+92-321-0000002",
     address:  { street: "12 Gulshan Ave", city: "Lahore", state: "Punjab", zip: "54000", country: "Pakistan" },
   },
 ];
 
 // Products will be seeded after admin user is created (needs user._id)
 const getProducts = (adminId) => [
   {
     name:          "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
     description:   "Industry-leading noise cancellation technology with auto-optimise. Precise voice pickup with 4 microphones for crystal-clear calls. Up to 30-hour battery life with quick charging. Lightweight and foldable design for easy travel.",
     price:         299.99,
     originalPrice: 349.99,
     category:      "electronics",
     brand:         "Sony",
     stock:         45,
     sold:          128,
     rating:        4.8,
     numReviews:    2340,
     badge:         "SALE",
     isFeatured:    true,
     isActive:      true,
     features:      ["30hr battery life", "ANC technology", "USB-C charging", "Hi-Res Audio", "Multipoint connect"],
     images:        ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
     tags:          ["headphones", "wireless", "noise-cancelling", "sony", "audio"],
     weight:        0.25,
     user:          adminId,
   },
   {
     name:          "Apple MacBook Air M2 13-inch",
     description:   "The redesigned MacBook Air is thinner, lighter and faster than ever. The M2 chip brings extraordinary performance. With up to 18 hours battery life, it handles demanding tasks effortlessly.",
     price:         1099.00,
     originalPrice: 1199.00,
     category:      "electronics",
     brand:         "Apple",
     stock:         18,
     sold:          562,
     rating:        4.9,
     numReviews:    5610,
     badge:         "HOT",
     isFeatured:    true,
     isActive:      true,
     features:      ["Apple M2 chip", "18hr battery", "8GB Unified Memory", "256GB SSD", "13.6\" Liquid Retina"],
     images:        ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
     tags:          ["laptop", "macbook", "apple", "m2", "computer"],
     weight:        1.24,
     user:          adminId,
   },
   {
     name:          "Samsung 65\" 4K QLED Smart TV QN65Q80C",
     description:   "Quantum Dot technology delivers brilliant color and contrast. Neo QLED with Quantum Matrix Technology for precise backlighting. Object Tracking Sound+ for immersive audio. Built-in Alexa and Google Assistant.",
     price:         799.99,
     originalPrice: 999.99,
     category:      "electronics",
     brand:         "Samsung",
     stock:         12,
     sold:          87,
     rating:        4.6,
     numReviews:    1876,
     badge:         "SALE",
     isFeatured:    false,
     isActive:      true,
     features:      ["4K QLED 120Hz", "Quantum Matrix Tech", "Dolby Atmos", "4 HDMI ports", "Built-in Alexa"],
     images:        ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80",
     tags:          ["tv", "television", "samsung", "4k", "qled", "smart tv"],
     weight:        22.5,
     user:          adminId,
   },
   {
     name:          "Nike Air Max 270 Running Shoes",
     description:   "The Nike Air Max 270 delivers unrivaled, all-day cushioning. The tallest Air unit in Nike history is paired with a lightweight foam midsole. Breathable mesh upper ensures all-day comfort.",
     price:         129.99,
     originalPrice: 149.99,
     category:      "fashion",
     brand:         "Nike",
     stock:         85,
     sold:          321,
     rating:        4.7,
     numReviews:    3210,
     badge:         "NEW",
     isFeatured:    true,
     isActive:      true,
     features:      ["Max Air heel unit", "Breathable mesh", "Rubber outsole", "Pull tab", "Foam midsole"],
     images:        ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
     tags:          ["shoes", "nike", "running", "sneakers", "air max"],
     weight:        0.34,
     user:          adminId,
   },
   {
     name:          "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt",
     description:   "7-in-1 multi-use appliance: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer. 14 one-touch smart programs for everyday meals.",
     price:         89.99,
     originalPrice: 119.99,
     category:      "kitchen",
     brand:         "Instant Pot",
     stock:         60,
     sold:          1250,
     rating:        4.8,
     numReviews:    12500,
     badge:         "HOT",
     isFeatured:    true,
     isActive:      true,
     features:      ["7-in-1 multi-use", "6Qt capacity", "14 smart programs", "10+ safety features", "Easy clean"],
     images:        ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
     tags:          ["instant pot", "pressure cooker", "kitchen", "appliance", "cooking"],
     weight:        5.4,
     user:          adminId,
   },
   {
     name:          "Levi's 501 Original Fit Jeans",
     description:   "The original jean since 1873. Sits at the waist, straight through hip and thigh with a regular leg opening. Made from heavyweight denim that softens with wear.",
     price:         59.99,
     originalPrice: 79.99,
     category:      "fashion",
     brand:         "Levi's",
     stock:         120,
     sold:          892,
     rating:        4.5,
     numReviews:    8920,
     badge:         "SALE",
     isFeatured:    false,
     isActive:      true,
     features:      ["100% cotton denim", "Button fly", "Straight fit", "Classic 5-pocket", "Machine washable"],
     images:        ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&q=80",
     tags:          ["jeans", "levi's", "denim", "fashion", "pants"],
     weight:        0.65,
     user:          adminId,
   },
   {
     name:          "Kindle Paperwhite (16 GB) – 6.8\" Display, Adjustable Warm Light",
     description:   "A larger 6.8\" display with thinner borders, adjustable warm light, and wireless charging capability. Waterproof, so you can read in the bath, at the pool, or on the beach.",
     price:         139.99,
     originalPrice: 149.99,
     category:      "books",
     brand:         "Amazon",
     stock:         35,
     sold:          423,
     rating:        4.7,
     numReviews:    4231,
     badge:         "NEW",
     isFeatured:    false,
     isActive:      true,
     features:      ["6.8\" 300 ppi display", "Adjustable warm light", "Waterproof IPX8", "10 weeks battery", "Wireless charging"],
     images:        ["https://images.unsplash.com/photo-1592899424704-51c30e74af24?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1592899424704-51c30e74af24?w=600&q=80",
     tags:          ["kindle", "e-reader", "amazon", "books", "ebook"],
     weight:        0.205,
     user:          adminId,
   },
   {
     name:          "Dyson V15 Detect Absolute Cordless Vacuum Cleaner",
     description:   "The most powerful, intelligent cordless vacuum. Laser reveals microscopic dust. The piezo sensor counts and sizes dust particles, automatically optimising suction.",
     price:         649.99,
     originalPrice: 749.99,
     category:      "home",
     brand:         "Dyson",
     stock:         15,
     sold:          98,
     rating:        4.8,
     numReviews:    987,
     badge:         "HOT",
     isFeatured:    true,
     isActive:      true,
     features:      ["230 AW max suction", "Laser Slim Fluffy head", "Piezo sensor display", "60min run time", "HEPA filtration"],
     images:        ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
     tags:          ["vacuum", "dyson", "cordless", "home", "cleaning"],
     weight:        3.1,
     user:          adminId,
   },
   {
     name:          "LEGO Icons Eiffel Tower 10307 Building Set",
     description:   "Build a beautifully detailed replica of the Eiffel Tower with 10,001 pieces. Stands at over 149cm tall, making it one of the largest LEGO sets ever created.",
     price:         199.99,
     originalPrice: 229.99,
     category:      "toys",
     brand:         "LEGO",
     stock:         22,
     sold:          54,
     rating:        4.9,
     numReviews:    543,
     badge:         "NEW",
     isFeatured:    false,
     isActive:      true,
     features:      ["10,001 pieces", "149cm tall", "Ages 18+", "No stickers — only printed tiles", "Display stand included"],
     images:        ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80",
     tags:          ["lego", "eiffel tower", "building", "toys", "adult"],
     weight:        2.7,
     user:          adminId,
   },
   {
     name:          "Nespresso Vertuo Next Coffee and Espresso Machine",
     description:   "Brew 5 cup sizes at the touch of a button. Centrifusion technology for barista-quality coffee at home. Compatible with 30+ Vertuo capsules for the ultimate coffee experience.",
     price:         149.99,
     originalPrice: 179.99,
     category:      "kitchen",
     brand:         "Nespresso",
     stock:         40,
     sold:          342,
     rating:        4.6,
     numReviews:    3420,
     badge:         "SALE",
     isFeatured:    false,
     isActive:      true,
     features:      ["5 cup sizes", "One-touch brewing", "15-sec heat-up", "Auto power-off", "Recyclable pods"],
     images:        ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80",
     tags:          ["coffee", "nespresso", "espresso", "kitchen", "machine"],
     weight:        3.8,
     user:          adminId,
   },
   {
     name:          "Adidas Ultraboost 22 Running Shoes",
     description:   "Experience incredible energy return with Boost midsole cushioning. The Primeknit+ upper adapts to your foot for a sock-like fit. Ideal for long runs and everyday training.",
     price:         179.99,
     originalPrice: 199.99,
     category:      "sports",
     brand:         "Adidas",
     stock:         50,
     sold:          189,
     rating:        4.7,
     numReviews:    1890,
     badge:         "NEW",
     isFeatured:    false,
     isActive:      true,
     features:      ["Boost midsole", "Primeknit+ upper", "Continental rubber outsole", "Linear Energy Push", "SL Light Strike"],
     images:        ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
     tags:          ["adidas", "ultraboost", "running", "shoes", "sports"],
     weight:        0.32,
     user:          adminId,
   },
   {
     name:          "Charlotte Tilbury Pillow Talk Lipstick",
     description:   "The iconic pinky-nude rose lip colour that flatters every skin tone. Infused with hyaluronic acid and jojoba oil for a moisturising, long-lasting finish.",
     price:         34.00,
     originalPrice: 34.00,
     category:      "beauty",
     brand:         "Charlotte Tilbury",
     stock:         80,
     sold:          675,
     rating:        4.8,
     numReviews:    6750,
     badge:         "HOT",
     isFeatured:    true,
     isActive:      true,
     features:      ["8hr long-lasting", "Hyaluronic acid", "Jojoba oil formula", "Cruelty-free", "Iconic nude shade"],
     images:        ["https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=600&q=80"],
     image:         "https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=600&q=80",
     tags:          ["lipstick", "charlotte tilbury", "beauty", "makeup", "cosmetics"],
     weight:        0.04,
     user:          adminId,
   },
 ];
 
 // ── Import data ───────────────────────────────────────────
 const importData = async () => {
   try {
     // Clear existing data
     await Order.deleteMany();
     await Product.deleteMany();
     await User.deleteMany();
     console.log("✓ Database cleared".yellow);
 
     // Create users
     const createdUsers = await User.create(users);
     const adminUser    = createdUsers.find((u) => u.role === "admin");
     const regularUsers = createdUsers.filter((u) => u.role === "user");
     console.log(`✓ ${createdUsers.length} users seeded`.green);
 
     // Create products
     const productData    = getProducts(adminUser._id);
     const createdProducts = await Product.create(productData);
     console.log(`✓ ${createdProducts.length} products seeded`.green);
 
     // Create sample orders
     const sampleOrders = [
       {
         user:            regularUsers[0]._id,
         orderItems: [
           {
             product:    createdProducts[0]._id,
             name:       createdProducts[0].name,
             image:      createdProducts[0].image,
             price:      createdProducts[0].price,
             qty:        1,
             totalPrice: createdProducts[0].price,
           },
         ],
         shippingAddress: {
           fullName: regularUsers[0].name,
           address:  "456 Oak Ave",
           city:     "New York",
           zip:      "10001",
           country:  "USA",
           email:    regularUsers[0].email,
           phone:    regularUsers[0].phone,
         },
         paymentMethod: "card",
         itemsPrice:    createdProducts[0].price,
         shippingPrice: 0,
         taxPrice:      parseFloat((createdProducts[0].price * 0.08).toFixed(2)),
         totalPrice:    parseFloat((createdProducts[0].price * 1.08).toFixed(2)),
         status:        "delivered",
         isPaid:        true,
         paidAt:        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
         isDelivered:   true,
         deliveredAt:   new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
         trackingNumber: "TRK-28471-US",
       },
       {
         user:            regularUsers[1]._id,
         orderItems: [
           {
             product:    createdProducts[3]._id,
             name:       createdProducts[3].name,
             image:      createdProducts[3].image,
             price:      createdProducts[3].price,
             qty:        2,
             totalPrice: createdProducts[3].price * 2,
           },
         ],
         shippingAddress: {
           fullName: regularUsers[1].name,
           address:  "789 Baker Street",
           city:     "London",
           zip:      "NW1 6XE",
           country:  "UK",
           email:    regularUsers[1].email,
           phone:    regularUsers[1].phone,
         },
         paymentMethod: "paypal",
         itemsPrice:    createdProducts[3].price * 2,
         shippingPrice: 0,
         taxPrice:      parseFloat((createdProducts[3].price * 2 * 0.08).toFixed(2)),
         totalPrice:    parseFloat((createdProducts[3].price * 2 * 1.08).toFixed(2)),
         status:        "shipped",
         isPaid:        true,
         paidAt:        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
         trackingNumber: "TRK-28106-UK",
       },
       {
         user:            regularUsers[2]._id,
         orderItems: [
           {
             product:    createdProducts[4]._id,
             name:       createdProducts[4].name,
             image:      createdProducts[4].image,
             price:      createdProducts[4].price,
             qty:        1,
             totalPrice: createdProducts[4].price,
           },
           {
             product:    createdProducts[9]._id,
             name:       createdProducts[9].name,
             image:      createdProducts[9].image,
             price:      createdProducts[9].price,
             qty:        1,
             totalPrice: createdProducts[9].price,
           },
         ],
         shippingAddress: {
           fullName: regularUsers[2].name,
           address:  "12 Gulshan Ave",
           city:     "Lahore",
           zip:      "54000",
           country:  "Pakistan",
           email:    regularUsers[2].email,
           phone:    regularUsers[2].phone,
         },
         paymentMethod: "cod",
         itemsPrice:    createdProducts[4].price + createdProducts[9].price,
         shippingPrice: 9.99,
         taxPrice:      parseFloat(((createdProducts[4].price + createdProducts[9].price) * 0.08).toFixed(2)),
         totalPrice:    parseFloat(((createdProducts[4].price + createdProducts[9].price) * 1.08 + 9.99).toFixed(2)),
         status:        "processing",
       },
     ];
 
     await Order.create(sampleOrders);
     console.log(`✓ ${sampleOrders.length} orders seeded`.green);
 
     console.log("\n" + "=".repeat(50).green);
     console.log("  ✓ Database seeded successfully!".green.bold);
     console.log("=".repeat(50).green);
     console.log("\n  Admin credentials:".cyan);
     console.log("  Email:    admin@shopnexus.com".white);
     console.log("  Password: admin123".white);
     console.log("\n  User credentials:".cyan);
     console.log("  Email:    alice@example.com".white);
     console.log("  Password: password123\n".white);
 
     process.exit(0);
   } catch (err) {
     console.error(`\n✗ Seeder Error: ${err.message}`.red.bold);
     console.error(err);
     process.exit(1);
   }
 };
 
 // ── Destroy data ──────────────────────────────────────────
 const destroyData = async () => {
   try {
     await Order.deleteMany();
     await Product.deleteMany();
     await User.deleteMany();
     console.log("\n  ✓ All data destroyed!".red.bold);
     process.exit(0);
   } catch (err) {
     console.error(`\n✗ Error: ${err.message}`.red.bold);
     process.exit(1);
   }
 };
 
 // ── Run ───────────────────────────────────────────────────
 if (process.argv[2] === "--import") {
   importData();
 } else if (process.argv[2] === "--destroy") {
   destroyData();
 } else {
   console.log("Usage: node seeder.js --import | --destroy".yellow);
   process.exit(1);
 }
 