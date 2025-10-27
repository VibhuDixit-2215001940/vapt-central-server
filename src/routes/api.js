const express = require("express");
const router = express.Router();

// === CONTROLLERS ===
const {
  checkSubscription,
  uploadScanResult,
} = require("../controllers/userController");

const {
  authAdmin,
  getUsers,
  updateSubscription,
  renderLoginPage,
  renderDashboard,
  createUser,
  deleteUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

// ====================
// USER API ROUTES
// ====================
router.post("/check-subscription", checkSubscription);
router.post("/upload-result", uploadScanResult);

// ====================
// ADMIN UI PAGE ROUTES
// ====================
router.get("/admin/login", renderLoginPage); // GET: ADMIN LOGIN PAGE
router.get("/admin/dashboard", renderDashboard); // GET: ADMIN DASHBOARD (PROTECTED)

// ====================
// ADMIN API ROUTES
// ====================
router.post("/admin/login", authAdmin); // POST: ADMIN LOGIN LOGIC
router.get("/admin/users", protect, getUsers); // GET: ALL USERS (PROTECTED)
router.put("/admin/user-status", protect, updateSubscription); // PUT: UPDATE USER SUBSCRIPTION (PROTECTED)
router.post("/admin/users", protect, createUser); // POST: CREATE USER (PROTECTED)
router.delete("/admin/users/:userId", protect, deleteUser); // DELETE: REMOVE USER BY ID (PROTECTED)

module.exports = router;
