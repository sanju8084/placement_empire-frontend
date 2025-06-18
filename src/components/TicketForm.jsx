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

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    setSubmitting(true);

    try {
<<<<<<< HEAD
      const res = await fetch("http://localhost:5000/api/payment/create-order", {
=======
            const res = await fetch("https://placement-empire-backend-1.onrender.com/api/tickets", {
// const res = await fetch("http:// 192.168.58.216:5000/api/tickets", {

>>>>>>> 87db2b19d767225d5c62b3f8d173801f6d9849e2
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: formData.price }),
      });

      const orderData = await res.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "RAZORPAY_KEY_ID", // or use env
        amount: orderData.amount,
        currency: "INR",
        name: "Placement Empire",
        description: `Payment for ${formData.category}`,
        order_id: orderData.id,
        handler: async function (response) {
          const finalData = {
            ...formData,
            razorpay_payment_id: response.razorpay_payment_id,
          };

          const ticketRes = await fetch("http://localhost:5000/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalData),
          });

          if (!ticketRes.ok) {
            const ticketText = await ticketRes.text();
            alert("Ticket error: " + ticketText);
            return;
          }

          alert("Payment successful. Ticket sent to your email.");
          setFormData({ name: "", mobile: "", email: "", category: "", price: "" });
          setErrors({});
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: { color: "#00bfa6" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment error:", err.message);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form" noValidate>
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

      <button type="submit" disabled={submitting}>{submitting ? "Processing..." : "Pay & Submit"}</button>
    </form>
  );
};

export default TicketForm;
