"use client";

import { useState } from "react";

interface StockData {
  "Global Quote"?: {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!ticker) return;

    setLoading(true);
    setError("");
    setStockData(null);

    try {
      const response = await fetch(`/api/stock?ticker=${ticker}`);
      const data = await response.json();

      if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
        setError(`No data found for "${ticker}". Check the ticker symbol.`);
      } else {
        setStockData(data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quote = stockData?.["Global Quote"];

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-12">
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. AAPL, TSLA, MSFT"
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 outline-none focus:border-zinc-900"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="mt-6 text-red-600">{error}</p>
      )}

      {quote && (
        <div className="mt-8 w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900">
            {quote["01. symbol"]}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500">Price</p>
              <p className="text-lg font-semibold text-zinc-900">
                ${quote["05. price"]}
              </p>
            </div>
            <div>
              <p className="text-zinc-500">Change</p>
              <p
                className={`text-lg font-semibold ${
                  quote["09. change"].startsWith("-")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {quote["09. change"]} ({quote["10. change percent"]})
              </p>
            </div>
            <div>
              <p className="text-zinc-500">Open</p>
              <p className="font-medium text-zinc-900">${quote["02. open"]}</p>
            </div>
            <div>
              <p className="text-zinc-500">Previous Close</p>
              <p className="font-medium text-zinc-900">
                ${quote["08. previous close"]}
              </p>
            </div>
            <div>
              <p className="text-zinc-500">High</p>
              <p className="font-medium text-zinc-900">${quote["03. high"]}</p>
            </div>
            <div>
              <p className="text-zinc-500">Low</p>
              <p className="font-medium text-zinc-900">${quote["04. low"]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}