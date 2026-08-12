const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User'); // Model direct import kar liya

async function recreateAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas...");

    // 1. Purana admin delete karein
    await User.deleteOne({ username: 'admin' });
    console.log("Old admin deleted.");

    // 2. Naya admin banayein (Mongoose khud password hash karega)
    const newAdmin = new User({
      fullName: 'Muhammad Ayyan',
      username: 'admin',
      email: 'admin@tabarak.com',
      password: 'admin123', // Plain text dein, model khud hash karega
      phone: '03001234567',
      role: 'admin'
    });

    await newAdmin.save();
    console.log("✅ Fresh Admin created successfully! Username: admin, Password: admin123");

    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

recreateAdmin();