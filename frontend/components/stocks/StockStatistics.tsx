"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Globe, Calendar, DollarSign, TrendingUp, BarChart3 } from "lucide-react";

interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  current_price: number;
  change: number;
  percent_change: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
  timestamp: number;
}

interface CompanyProfile {
  name: string | null;
  ticker: string | null;
  exchange: string | null;
  industry: string | null;
  logo: string | null;
  market_cap: number | null;
  country: string | null;
  currency: string | null;
  ipo: string | null;
  weburl: string | null;
}

interface StockStatisticsProps {
  symbol: string;
}

export function StockStatistics({ symbol }: StockStatisticsProps) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch quote
        const quoteResponse = await fetch(
          `http://localhost:8000/stocks/quote/${symbol}`,
          { credentials: "include" }
        );
        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json();
          setQuote(quoteData);
        }

        // Fetch profile
        const profileResponse = await fetch(
          `http://localhost:8000/stocks/profile/${symbol}`,
          { credentials: "include" }
        );
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        }
      } catch (err) {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !quote) {
    return null;
  }

  const formatMarketCap = (value: number | null) => {
    if (!value) return "N/A";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const dayRange = `$${quote.low.toFixed(2)} - $${quote.high.toFixed(2)}`;
  const fiftyTwoWeekRange = "N/A"; // Would need additional API data

  return (
    <div className="space-y-3">
      {/* Company Info */}
      {profile && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              {profile.logo && (
                <img
                  src={profile.logo}
                  alt={profile.name || symbol}
                  className="h-12 w-12 rounded-lg object-contain bg-muted p-2"
                />
              )}
              <div className="flex-1">
                <CardTitle className="text-lg">{profile.name || symbol}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  {profile.exchange && (
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {profile.exchange}
                    </span>
                  )}
                  {profile.industry && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {profile.industry}
                    </span>
                  )}
                  {profile.country && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {profile.country}
                    </span>
                  )}
                </div>
              </div>
              {profile.weburl && (
                <a
                  href={profile.weburl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Visit Website →
                </a>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Statistics Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Key Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Previous Close */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Previous Close</div>
              <div className="text-lg font-semibold">${quote.previous_close.toFixed(2)}</div>
            </div>

            {/* Open */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Open</div>
              <div className="text-lg font-semibold">${quote.open.toFixed(2)}</div>
            </div>

            {/* Day's Range */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Day's Range</div>
              <div className="text-sm font-semibold">{dayRange}</div>
            </div>

            {/* 52 Week Range */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">52 Week Range</div>
              <div className="text-sm font-semibold">{fiftyTwoWeekRange}</div>
            </div>

            {/* Market Cap */}
            {profile?.market_cap && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Market Cap</div>
                <div className="text-lg font-semibold">{formatMarketCap(profile.market_cap)}</div>
              </div>
            )}

            {/* Volume */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="text-sm font-semibold">N/A</div>
            </div>

            {/* Avg Volume */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Avg Volume</div>
              <div className="text-sm font-semibold">N/A</div>
            </div>

            {/* P/E Ratio */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">P/E Ratio</div>
              <div className="text-sm font-semibold">N/A</div>
            </div>

            {/* Beta */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Beta (1Y)</div>
              <div className="text-sm font-semibold">N/A</div>
            </div>

            {/* EPS */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">EPS (TTM)</div>
              <div className="text-sm font-semibold">N/A</div>
            </div>

            {/* Dividend Yield */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Dividend Yield</div>
              <div className="text-sm font-semibold">N/A</div>
            </div>

            {/* Currency */}
            {profile?.currency && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Currency</div>
                <div className="text-lg font-semibold">{profile.currency}</div>
              </div>
            )}

            {/* IPO Date */}
            {profile?.ipo && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  IPO Date
                </div>
                <div className="text-sm font-semibold">{profile.ipo}</div>
              </div>
            )}

            {/* Exchange */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Exchange</div>
              <div className="text-sm font-semibold">{quote.exchange}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Trading Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Current Price */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Current Price</div>
              <div className="text-2xl font-bold">${quote.current_price.toFixed(2)}</div>
            </div>

            {/* Change */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Change</div>
              <div className="text-lg font-semibold">
                {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}
              </div>
            </div>

            {/* Change % */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Change %</div>
              <div className="text-lg font-semibold">
                {quote.percent_change >= 0 ? '+' : ''}{quote.percent_change.toFixed(2)}%
              </div>
            </div>

            {/* Day High */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Day High</div>
              <div className="text-lg font-semibold">${quote.high.toFixed(2)}</div>
            </div>

            {/* Day Low */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Day Low</div>
              <div className="text-lg font-semibold">${quote.low.toFixed(2)}</div>
            </div>

            {/* Last Updated */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="text-sm font-semibold">
                {new Date(quote.timestamp * 1000).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
