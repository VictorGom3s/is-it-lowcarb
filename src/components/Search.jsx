import React, { useState } from "react";
import axios from "axios";
import * as apiKeys from "../api-keys.json";

const Axios = axios.create({
  baseURL: "https://isitlowcarbapi.herokuapp.com/food/",
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
        const { data: res } = await Axios.post(`${searchTerm}`);

        const newObj = { ...memo };
        newObj[searchTerm] = res;
        setMemo(newObj);

        if (!res.isCached) {
          await Axios.post("new/save", {
            food: searchTerm,
            id: res.id,
            lowcarb: isItLowCarb(res),
          });
        }
        console.log(res);
        if (res.lowcarb === "1") return setIsLowcarb("Yep!");
        if (res.lowcarb === "2")
          return setIsLowcarb("Maybe. You can eat it, but with cautious.");
        if (res.lowcarb === "0") return setIsLowcarb("Nope!");

        return isItLowCarb(res);
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
    const netCarbs = food.carbs - food.fiber;

    if (netCarbs > 15 || food.sugar > 5) {
      setIsLowcarb("Nope!");
      return 0;
    } else if (netCarbs >= 10 && netCarbs <= 15 && food.nf_sugars < 5) {
      setIsLowcarb("Maybe. You can eat it, but with cautious.");
      return 2;
    }

    setIsLowcarb("Yep!");
    return 1;
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
      <a href="https://platform.fatsecret.com">Powered by FatSecret</a>
      {showResult ? resultDiv : ""}
    </section>
  );
};

export default Search;
