import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Return from "./Return";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/return/:connectedAccountId" element={<Return />} />
        {/* Add more routes here in future if needed */}
      </Routes>
    </Router>
  );
}

export default App;
