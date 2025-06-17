import React, { useState } from "react";
import "../components/ticketForm.css";

const TicketForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent more than 10 digits
    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });

    // Clear validation error on change
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
            const res = await fetch("http://localhost:5000/api/tickets", {
// const res = await fetch("http:// 192.168.58.216:5000/api/tickets", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("Backend error:", text);
        alert("Server error: " + text); // This runs on 500 internal error etc.
        return;
      }

      alert("Ticket Submitted. Check your email!");
      setFormData({ name: "", mobile: "", email: "", category: "" });
      setErrors({});
    } catch (err) {
      console.error("Request failed:", err.message);
      alert("Network or server error!"); // This shows for no connection / mobile failure
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form" noValidate>
      <h2>Generate Ticket</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className={errors.name ? "invalid" : ""}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <input
        name="mobile"
        placeholder="Mobile (10 digits)"
        value={formData.mobile}
        onChange={handleChange}
        type="tel"
        inputMode="numeric"
        className={errors.mobile ? "invalid" : ""}
      />
      {errors.mobile && <p className="error">{errors.mobile}</p>}

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        className={errors.email ? "invalid" : ""}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className={errors.category ? "invalid" : ""}
      >
        <option value="">Select Category</option>
        <option value="Tech job">Tech Job</option>
        <option value="Non Tech Job">Non Tech Job</option>
        <option value="Un Skilled Job">Unskilled Job</option>
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send Ticket"}
      </button>
    </form>
  );
};

export default TicketForm;


