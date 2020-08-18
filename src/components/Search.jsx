import React, { useState } from "react";
import axios from "axios";
import * as apiKeys from "../api-keys.json";

const Axios = axios.create({
  baseURL: "https://trackapi.nutritionix.com/v2",
  headers: {
    "x-app-id": apiKeys["APP_ID"],
    "x-app-key": apiKeys["API_KEY"],
    "x-remote-user-id": 0,
  },
});

const Search = () => {
  const [showResult, setShowResult] = useState(false);
  const [isLC, setIsLC] = useState("Yep!");
  const [searchTerm, setSearchTerm] = useState("");
  const [apiKey, setApiKey] = useState("");

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
    else if (netCarbs >= 10 && netCarbs <= 15 && food.nf_sugars < 5)
      setIsLC("Maybe. You can eat it, but with cautious.");
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
