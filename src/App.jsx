import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";

function App() {

  return (
    <>
      <Navbar />
      <div className="[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="min-h-[87vh]">
        <Manager />
      </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
