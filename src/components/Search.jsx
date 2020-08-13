import React, { useState } from "react";

const Search = () => {
  const [showResult, setShowResult] = useState(true);
  const [isLC, setIsLC] = useState("Yep!");

  const resultDiv = (
    <div className="result">
      <p>{isLC}</p>
    </div>
  );

  return (
    <section id="search">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search for a food"
      />
      {showResult ? resultDiv : ""}
    </section>
  );
};

export default Search;
