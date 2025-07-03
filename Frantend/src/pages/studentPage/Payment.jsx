import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/Payment.css";

const Payment = ({ onClose }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const studentId = localStorage.getItem("studentId"); // get from localStorage
        console.log("Student ID (Payment):", studentId);

        const response = await axios.get(
          `http://localhost:5000/api/payments/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPayments(response.data);
      } catch (err) {
        setError("Failed to load payment data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Payment Details</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount (Rs.)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.description}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payment;
