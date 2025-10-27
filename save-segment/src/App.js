import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Segment from "./pages/segment/segment";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Segment />
    </div>
  );
}

export default App;
