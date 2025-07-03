const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ADMIN_USERNAME = "admin123";
const ADMIN_PASSWORD = "adminpass"; // You can use bcrypt to hash if needed

exports.login = async (req, res) => {
  const { username, password } = req.body;



  
  // Hardcoded admin login
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET);
    return res.json({ token, role: "admin" });
  }




  // Student login via database
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({ token, role: user.role, studentId: user._id });
};
