import React, { useState, useEffect } from "react";
import TicketForm from "./TicketForm";
import Admin from "./Admin";
import Login from "./Login";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Placement Empire Ticketing</h1>
      </header>

      <main className="app-main">
        <section className="ticket-section">
          <TicketForm />
        </section>

        <div className="admin-divider">
          <hr />
          <p className="admin-title">
            {isAdmin ? "Admin Panel" : "Admin Access Only"}
          </p>
        </div>

        <section className="admin-section">
          {isAdmin ? <Admin /> : <Login setIsAdmin={setIsAdmin} />}
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Placement Empire</p>
      </footer>
    </div>
  );
}

export default App;
