"use client";

import { useState } from "react";

export default function Home() {
  const [ticker, setTicker] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", ticker);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <h1 className="mb-2 text-4xl font-bold text-zinc-900">
        AI Stock Research Assistant
      </h1>
      <p className="mb-8 text-zinc-600">
        Enter a stock ticker to generate an AI-powered research summary
      </p>

      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="e.g. AAPL, TSLA, MSFT"
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 outline-none focus:border-zinc-900"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700"
        >
          Search
        </button>
      </div>
    </div>
  );
}