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
  const [isLowcarb, setIsLowcarb] = useState("Yep!");
  const [searchTerm, setSearchTerm] = useState("");
  const [memo, setMemo] = useState({});

  const resultDiv = (
    <div className="result">
      <p>{isLowcarb}</p>
    </div>
  );

  const isLoading = () => {
    setIsLowcarb("Just a sec...");
  };

  const notFound = () => {
    setIsLowcarb("Not found!");
  };

  const handleSearch = async (e) => {
    try {
      e.preventDefault();

      setShowResult(true);
      isLoading();

      if (!memo[searchTerm]) {
        const { data: res } = await Axios.post("/natural/nutrients", {
          query: `100 grams of ${searchTerm}`,
        });

        const newObj = { ...memo };
        newObj[searchTerm] = res.foods[0];
        setMemo(newObj);
        return isItLowCarb(res.foods[0]);
      }

      setTimeout(() => {
        return isItLowCarb(memo[searchTerm]);
      }, 400);
    } catch (error) {
      notFound();
      console.error(error);
    }
  };

  const isItLowCarb = (food) => {
    const netCarbs = food.nf_total_carbohydrate - food.nf_dietary_fiber;

    if (netCarbs > 15 || food.nf_sugars > 5) {
      return setIsLowcarb("Nope!");
    } else if (netCarbs >= 10 && netCarbs <= 15 && food.nf_sugars < 5) {
      return setIsLowcarb("Maybe. You can eat it, but with cautious.");
    }

    setIsLowcarb("Yep!");
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
