const User = require("../models/User");

// CHECK USER SUBSCRIPTION STATUS OR CREATE NEW USER
const checkSubscription = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // FIND USER IN DATABASE
    const user = await User.findOne({ username });

    if (!user) {
      // CREATE NEW USER WITH TRIAL SUBSCRIPTION IF NOT FOUND
      await User.create({ username, subscriptionStatus: "trial" });
      return res.json({
        status: "success",
        access: "trial",
        message: "New user registered with trial access.",
      });
    }

    // SEND BACK USER'S SUBSCRIPTION STATUS
    const access = user.subscriptionStatus;
    const scan_limit = access === "premium" ? "full" : "limited";

    res.json({
      status: "success",
      access,
      scan_limit,
      message: `Access granted: ${access}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during subscription check" });
  }
};

// STORE USER SCAN RESULTS
const uploadScanResult = async (req, res) => {
  const { username, scanResult } = req.body;

  if (!username || !scanResult) {
    return res
      .status(400)
      .json({ message: "Username and scan result data are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // GENERATE UNIQUE SCAN ID
    const newResult = {
      scanId: `SCAN-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      resultData: scanResult,
    };

    user.scanResults.push(newResult);
    await user.save();

    res.json({
      status: "success",
      message: "Scan result uploaded successfully",
      scanId: newResult.scanId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during result upload" });
  }
};

module.exports = { checkSubscription, uploadScanResult };
