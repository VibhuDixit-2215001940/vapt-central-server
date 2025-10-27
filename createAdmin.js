// createAdmin.js

const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const Admin = require("./src/models/Admin");

// LOAD ENVIRONMENT VARIABLES AND CONNECT TO DATABASE
dotenv.config();
connectDB();

const createAdminUser = async (username, password) => {
  try {
    // STEP 1: DELETE ANY EXISTING ADMIN USER WITH SAME USERNAME
    await Admin.deleteOne({ username });
    console.log(`Previous admin user "${username}" cleaned up.`);

    // STEP 2: CREATE NEW ADMIN USER (PASSWORD WILL BE HASHED AUTOMATICALLY VIA MODEL HOOK)
    const newAdmin = await Admin.create({
      username: username,
      password: password,
    });

    console.log(
      `*** Admin user "${newAdmin.username}" created successfully! Please use password: ${password} ***`
    );
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    // WAIT 3 SECONDS BEFORE EXITING TO ENSURE DATA IS SAVED
    setTimeout(() => process.exit(), 3000);
  }
};

// DEFAULT ADMIN CREDENTIALS (CHANGE AFTER FIRST USE)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

createAdminUser(ADMIN_USERNAME, ADMIN_PASSWORD);
