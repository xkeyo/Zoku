"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewMiniChartProps {
  symbol: string;
  width?: string | number;
  height?: string | number;
}

function TradingViewMiniChart({
  symbol = "NASDAQ:AAPL",
  width = "100%",
  height = 220,
}: TradingViewMiniChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      height: height,
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      trendLineColor: "rgba(99, 102, 241, 1)",
      underLineColor: "rgba(99, 102, 241, 0.3)",
      underLineBottomColor: "rgba(99, 102, 241, 0)",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol, width, height]);

  return (
    <div className="tradingview-widget-container w-full" ref={container}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(TradingViewMiniChart);
