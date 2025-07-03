const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "student"], default: "student" },
  fullName: String,
  address: String,
  email: { type: String, unique: true },
  NIC: { type: String, unique: true },
  mobileNumber: String,
  parentName: String,
  image: String, // this will store the image filename or URL
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
