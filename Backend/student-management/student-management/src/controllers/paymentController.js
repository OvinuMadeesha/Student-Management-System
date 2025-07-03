const Payment = require("../models/Payment");
const User = require("../models/User");

// Add a payment
exports.addPayment = async (req, res) => {
  try {
    const { studentId, amount, method, status, description } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const payment = new Payment({
      studentId,
      amount,
      method,
      status,
      description,
    });

    await payment.save();
    res.status(201).json({ message: "Payment recorded", payment });
  } catch (error) {
    res.status(500).json({ message: "Error adding payment", error });
  }
};

// Get payments by student ID
exports.getPaymentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const payments = await Payment.find({ studentId }).sort({
      paymentDate: -1,
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

// Get all payments (admin use)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate(
      "studentId",
      "username fullName"
    );
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

// Update payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, amount, method, status, description } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { studentId, amount, method, status, description },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res
      .status(200)
      .json({ message: "Payment updated", payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error });
  }
};

// Delete payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error });
  }
};
