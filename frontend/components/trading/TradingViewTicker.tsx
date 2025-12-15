"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewTickerProps {
  symbols?: Array<{
    proName: string;
    title: string;
  }>;
  displayMode?: "adaptive" | "regular" | "compact";
}

function TradingViewTicker({
  symbols = [
    { proName: "NASDAQ:AAPL", title: "Apple" },
    { proName: "NASDAQ:TSLA", title: "Tesla" },
    { proName: "NASDAQ:NVDA", title: "NVIDIA" },
    { proName: "NASDAQ:MSFT", title: "Microsoft" },
    { proName: "NASDAQ:GOOGL", title: "Google" },
    { proName: "NASDAQ:AMZN", title: "Amazon" },
    { proName: "NASDAQ:META", title: "Meta" },
  ],
  displayMode = "adaptive",
}: TradingViewTickerProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbols,
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: displayMode,
      locale: "en",
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbols, displayMode]);

  return (
    <div className="tradingview-widget-container w-full" ref={container}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(TradingViewTicker);
