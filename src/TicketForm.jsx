import React, { useState, useEffect } from "react";
import "./ticketForm.css";

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    if (name === "category") {
      const selectedPrice = categoryPrices[value] || "";
      setFormData((prev) => ({ ...prev, category: value, price: selectedPrice }));
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

  const submitTicket = async (paymentId, status = "Done") => {
    try {
      const ticketData = {
        ...formData,
        razorpay_payment_id: paymentId || "",
        paymentStatus: status,
      };

      const response = await fetch("https://placement-empire-backend-1.onrender.com/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const err = await response.text();
        alert("Ticket generation failed: " + err);
        return;
      }

      alert("Ticket submitted successfully. Please check your email.");
      setFormData({ name: "", mobile: "", email: "", category: "", price: "" });
      setErrors({});
    } catch (error) {
      console.error("Submit ticket error:", error);
      alert("Failed to submit ticket.");
    }
  };

  const handlePayment = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("https://placement-empire-backend-1.onrender.com/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: formData.price }),
      });

      const data = await res.json();

      if (!data || !data.id) {
        alert("Invalid Razorpay order response.");
        return;
      }

      const options = {
        key: "rzp_test_UaBnVFB3C4EDxK", // Use your actual Razorpay test/live key
        amount: data.amount,
        currency: "INR",
        name: "Placement Empire",
        description: "Job Ticket Payment",
        order_id: data.id,
        handler: async function (response) {
          await submitTicket(response.razorpay_payment_id, "Done");
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#00bfa6",
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            alert("Payment cancelled. Ticket not submitted.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment could not be initiated. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ticket-form" noValidate>
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
        {Object.keys(categoryPrices).map((category) => (
          <option key={category} value={category}>
            {`${category} (₹${categoryPrices[category]})`}
          </option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      {formData.price && <p className="price-display">Price: ₹{formData.price}</p>}

      <button type="button" onClick={handlePayment} disabled={submitting}>
        {submitting ? "Processing..." : "Pay & Submit"}
      </button>
    </form>
  );
};

export default TicketForm;
