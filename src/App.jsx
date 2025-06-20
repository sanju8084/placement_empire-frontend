import React, { useState } from "react";
import Admin from "./Admin";
import Login from "./Login";
import TicketForm from "./TicketForm";

function App() {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  return (
    <div>
      {isAdmin ? <Admin /> : <Login setIsAdmin={setIsAdmin} />}
      <TicketForm />
    </div>
  );
}

export default App;
