// src/components/TicketForm.jsx
import React, { useState } from "react";
import "./ticketForm.css";

const categoryPrices = {
  "Tech Job": 1500,
  "Non Tech Job": 1000,
  "Unskilled Job": 500,
};

const upiId = "7079887439@jio";
const payeeName = "Placement Empire";

const TicketForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    category: "",
    price: "",
    screenshot: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    if (name === "category") {
      const selectedPrice = categoryPrices[value] || "";
      setFormData((prev) => ({ ...prev, category: value, price: selectedPrice }));
    } else if (name === "screenshot") {
      setFormData((prev) => ({ ...prev, screenshot: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^[0-9]{10}$/.test(formData.mobile)) newErrors.mobile = "Mobile must be 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.category) newErrors.category = "Select a category";
    return newErrors;
  };

  const handleUPIRedirect = () => {
    if (!formData.price) {
      alert("Please select a category first.");
      return;
    }

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${formData.price}&cu=INR`;
    window.location.href = upiUrl;

    setTimeout(() => {
      alert("If UPI app didn’t open, please open GPay/PhonePe and pay manually.");
    }, 3000);
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!formData.screenshot) {
      alert("Please upload the payment screenshot before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        formDataToSend.append(key, val);
      });

      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Ticket generation failed: " + err);
        return;
      }

      alert("Ticket submitted successfully. Check your email.");

      setFormData({
        name: "",
        mobile: "",
        email: "",
        category: "",
        price: "",
        screenshot: null,
      });
      document.querySelector('input[type="file"]').value = "";
      setErrors({});
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ticket-form" noValidate>
      <h2>Generate Ticket</h2>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      {errors.name && <p className="error">{errors.name}</p>}

      <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} />
      {errors.mobile && <p className="error">{errors.mobile}</p>}

      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      {errors.email && <p className="error">{errors.email}</p>}

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Select Category</option>
        {Object.keys(categoryPrices).map((c) => (
          <option key={c} value={c}>
            {c} (₹{categoryPrices[c]})
          </option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      {formData.price && (
        <>
          <p className="price-display">Pay ₹{formData.price} to UPI ID: <strong>{upiId}</strong></p>
          <button type="button" onClick={handleUPIRedirect} className="pay-now">Pay Now</button>
        </>
      )}

      <p className="notice">
        After clicking <strong>Pay Now</strong>, your UPI app should open.
        If not, pay manually to <strong>{upiId}</strong>.
      </p>

      <label>Upload Payment Screenshot</label>
      <input type="file" name="screenshot" accept="image/*" onChange={handleChange} />

      <button type="button" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
};

export default TicketForm;
