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

 