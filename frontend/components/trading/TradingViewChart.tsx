"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  height?: number;
}

function TradingViewChart({
  symbol = "NASDAQ:AAPL",
  interval = "D",
  height = 500,
}: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol, interval]);

  return (
    <div 
      className="tradingview-widget-container rounded-lg overflow-hidden w-full" 
      ref={container} 
      style={{ 
        height: `${height}px`,
        minHeight: "400px",
        width: "100%" 
      }}
    >
      <div 
        className="tradingview-widget-container__widget w-full h-full" 
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

export default memo(TradingViewChart);
