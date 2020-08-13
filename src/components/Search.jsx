import React, { useState } from "react";
import axios from "axios";

const Axios = axios.create({
  baseURL: "https://trackapi.nutritionix.com/v2",
  headers: {
    "x-app-id": "c937f8d2",
    "x-remote-user-id": 0,
    "x-app-key": "fbed950f6236f6164b21346cedeb6492",
  },
});

const Search = () => {
  const [showResult, setShowResult] = useState(false);
  const [isLC, setIsLC] = useState("Yep!");
  const [searchTerm, setSearchTerm] = useState("");

  const resultDiv = (
    <div className="result">
      <p>{isLC}</p>
    </div>
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await Axios.post("/natural/nutrients", {
        query: `100 grams of ${searchTerm}`,
      });
      isItLowCarb(res.foods[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const isItLowCarb = (food) => {
    const netCarbs = food.nf_total_carbohydrate - food.nf_dietary_fiber;

    if (netCarbs > 15 || food.nf_sugars > 5) setIsLC("Nope!");
    else setIsLC("Yep!");

    setShowResult(true);
  };

  return (
    <section id="search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for a food and press enter"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {showResult ? resultDiv : ""}
    </section>
  );
};

export default Search;
