import React, { useState } from "react";
import "../components/ticketForm.css";

const categoryPrices = {
  "Tech Job": 1500,
  "Non Tech Job": 1000,
  "Unskilled Job": 500,
};

const TicketForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    category: "",
    price: "",
  });
  const [paymentStatus, setPaymentStatus] = useState("Not Done");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    if (name === "category") {
      const selectedPrice = categoryPrices[value] || "";
      setFormData({ ...formData, [name]: value, price: selectedPrice });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!mobileRegex.test(formData.mobile)) newErrors.mobile = "Mobile must be 10 digits";
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.category) newErrors.category = "Select a category";

    return newErrors;
  };

  const submitTicket = async (paymentId = null, status = "Not Done") => {
    try {
      const ticketData = {
        ...formData,
        razorpay_payment_id: paymentId || "",
        paymentStatus: status,
      };

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const err = await response.text();
        alert("Ticket generation failed: " + err);
        return;
      }

      alert("Ticket submitted. Check your email.");
      setFormData({ name: "", mobile: "", email: "", category: "", price: "" });
      setErrors({});
      setPaymentStatus("Not Done");
    } catch (error) {
      console.error(error);
      alert("Failed to submit ticket.");
    }
  };

  const handlePayment = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Temporarily disable payment logic, just show message
    alert("Payment integration is currently disabled. You can still generate a ticket without payment.");
  };

  const handleGenerateWithoutPayment = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await submitTicket(null, "Not Done");
  };

  return (
    <form className="ticket-form" noValidate>
      <h2>Generate Ticket</h2>

      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className={errors.name ? "invalid" : ""} />
      {errors.name && <p className="error">{errors.name}</p>}

      <input name="mobile" placeholder="Mobile (10 digits)" value={formData.mobile} onChange={handleChange} type="tel" className={errors.mobile ? "invalid" : ""} />
      {errors.mobile && <p className="error">{errors.mobile}</p>}

      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} type="email" className={errors.email ? "invalid" : ""} />
      {errors.email && <p className="error">{errors.email}</p>}

      <select name="category" value={formData.category} onChange={handleChange} className={errors.category ? "invalid" : ""}>
        <option value="">Select Category</option>
        {Object.keys(categoryPrices).map((category) => (
          <option key={category} value={category}>{`${category} (₹${categoryPrices[category]})`}</option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      {formData.price && <p className="price-display">Price: ₹{formData.price}</p>}

      <button type="button" onClick={handlePayment} disabled={submitting}>
        Pay & Submit (Coming Soon)
      </button>

      <button type="button" onClick={handleGenerateWithoutPayment} className="secondary-button">
        Generate Ticket without Payment
      </button>
    </form>
  );
};

export default TicketForm;
