# AI Stock Research Assistant

An AI-powered stock research tool that analyzes any stock globally and generates professional equity research reports.

## Features
- Real-time stock data for US, Indian (NSE/BSE), and global markets
- 30-day price history chart
- AI-generated bull case, bear case, confidence score, price target
- Peer comparison with live competitor data
- Voice search — say a company name, get results
- PDF report download
- Dark mode
- Live price auto-refresh every 30 seconds
- Search history

## Tech Stack
- Next.js 16, TypeScript, Tailwind CSS
- Yahoo Finance API (global stock data)
- Google Gemini AI (analysis generation)
- Recharts (data visualization)
- jsPDF (report generation)

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` with:
   GEMINI_API_KEY=your_key_here
4. Run `npm run dev`
5. Open `localhost:3000`

## Supported Stocks
- US: AAPL, MSFT, TSLA, NVDA, etc.
- India NSE: RELIANCE.NS, TCS.NS, INFY.NS, etc.
- India BSE: RELIANCE.BO, TCS.BO, etc.
- Crypto: BTC-USD, ETH-USD
- ETFs: SPY, QQQ, VTI