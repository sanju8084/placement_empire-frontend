import React, { useEffect, useState } from "react";
import "./admin.css";

const Admin = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("https://placement-empire-backend-1.onrender.com/api/admin/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      alert("Failed to load tickets");
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await fetch(`https://placement-empire-backend-1.onrender.com/api/admin/tickets/${id}`, {
        method: "DELETE",
      });
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Ticket Management</h2>
      <div className="table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Category</th>
              <th>Price</th>
              <th>Payment</th>
              <th>Screenshot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.ticketNo}</td>
                <td>{ticket.name}</td>
                <td>{ticket.mobile}</td>
                <td>{ticket.email}</td>
                <td>{ticket.category}</td>
                <td>₹{ticket.price}</td>
                <td>{ticket.paymentStatus}</td>
                <td>
  {ticket.screenshot ? (
    <a
      href={`https://placement-empire-backend-1.onrender.com/uploads/${ticket.screenshot}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View
    </a>
  ) : "N/A"}
</td>
<td>
                  <button className="delete-btn" onClick={() => deleteTicket(ticket._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("isAdmin");
          window.location.reload();
        }}
      >Logout</button>
    </div>
  );
};

export default Admin;
