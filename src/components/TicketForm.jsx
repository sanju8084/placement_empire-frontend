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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.text();
      console.log("Server response:", data);
      alert("Ticket Submitted. Check your email!");
      setFormData({ name: "", mobile: "", email: "", category: "" });
      setErrors({});
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <h2>Generate Ticket</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <input
        name="mobile"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={handleChange}
      />
      {errors.mobile && <p className="error">{errors.mobile}</p>}

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Select Category</option>
        <option value="Coding">Coding</option>
        <option value="Design">Design</option>
        <option value="Robotics">Robotics</option>
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      <button type="submit">Send Ticket</button>
    </form>
  );
};

export default TicketForm;
