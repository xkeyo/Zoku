import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceDisplayProps {
  price: number;
  change?: number;
  percentChange?: number;
  size?: "sm" | "md" | "lg";
  showTrend?: boolean;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function PriceDisplay({ 
  price, 
  change, 
  percentChange, 
  size = "md",
  showTrend = true 
}: PriceDisplayProps) {
  const isPositive = (change ?? 0) >= 0;
  const colorClass = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="flex items-center gap-2">
      <span className={`${sizeClasses[size]} font-bold`}>
        ${price.toFixed(2)}
      </span>
      {change !== undefined && percentChange !== undefined && (
        <span className={`${sizeClasses[size]} font-semibold flex items-center ${colorClass}`}>
          {showTrend && (
            isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )
          )}
          {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
        </span>
      )}
    </div>
  );
}

interface PriceGridProps {
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open?: number;
  previousClose?: number;
}

export function PriceGrid({ 
  currentPrice, 
  change, 
  percentChange, 
  high, 
  low,
  open,
  previousClose 
}: PriceGridProps) {
  const isPositive = change >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <div className="text-sm text-muted-foreground">Current Price</div>
        <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Change</div>
        <div className={`text-xl font-semibold flex items-center ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
        </div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">High</div>
        <div className="text-xl font-semibold">${high.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Low</div>
        <div className="text-xl font-semibold">${low.toFixed(2)}</div>
      </div>
      {open !== undefined && (
        <div>
          <div className="text-sm text-muted-foreground">Open</div>
          <div className="text-xl font-semibold">${open.toFixed(2)}</div>
        </div>
      )}
      {previousClose !== undefined && (
        <div>
          <div className="text-sm text-muted-foreground">Previous Close</div>
          <div className="text-xl font-semibold">${previousClose.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
