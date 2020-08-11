import React from "react";
import "./App.scss";
import Header from "./components/Header";
import Search from "./components/Search";
import Footer from "./components/Footer";

const ROOT_URL = "https://trackapi.nutritionix.com/v2";

function App() {
  return (
    <>
      <Header />
      <Search />
      <Footer />
    </>
  );
}

export default App;
