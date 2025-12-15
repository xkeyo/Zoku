"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewSymbolInfoProps {
  symbol: string;
  width?: string | number;
  height?: string | number;
  colorTheme?: "light" | "dark";
  isTransparent?: boolean;
}

function TradingViewSymbolInfo({
  symbol = "NASDAQ:AAPL",
  width = "100%",
  height = 400,
  colorTheme = "dark",
  isTransparent = true,
}: TradingViewSymbolInfoProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      locale: "en",
      colorTheme: colorTheme,
      isTransparent: isTransparent,
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol, width, colorTheme, isTransparent]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: `${height}px` }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewSymbolInfo);
