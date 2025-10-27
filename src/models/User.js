const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptionStatus: {
      type: String,
      required: true,
      enum: ["trial", "premium"], // ONLY THESE TWO VALUES ARE ALLOWED
      default: "trial",
    },
    scanResults: [
      // ARRAY TO STORE FUTURE SCAN RESULTS
      {
        scanId: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        resultData: mongoose.Schema.Types.Mixed, // STORES JSON RESULT DATA
      },
    ],
  },
  {
    timestamps: true, // AUTOMATICALLY ADDS createdAt AND updatedAt FIELDS
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
