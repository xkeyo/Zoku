'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { analyzePatterns, formatConfidence, getPatternColor, type PatternDetection } from '@/api/stocks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';

const POPULAR_STOCKS = ['AAPL', 'TSLA', 'NVDA'];
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function StockPatternsWidget() {
  const [patterns, setPatterns] = useState<{ symbol: string; pattern: PatternDetection }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastFetch > CACHE_DURATION) {
      loadPatterns();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPatterns() {
    try {
      const results = await Promise.allSettled(
        POPULAR_STOCKS.map(async (symbol) => {
          try {
            const analysis = await analyzePatterns(symbol, 'D', 90);
            return analysis.patterns_found
              .filter(p => p.confidence > 0.6)
              .slice(0, 1)
              .map(pattern => ({ symbol, pattern }));
          } catch (error) {
            console.error(`Failed to load patterns for ${symbol}:`, error);
            return [];
          }
        })
      );
      
      const successfulPatterns = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value)
        .slice(0, 3);
      
      setPatterns(successfulPatterns);
      setLastFetch(Date.now());
    } catch (error) {
      console.error('Failed to load patterns:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Top Patterns</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/stocks">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <CardDescription>High-confidence patterns detected</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState size="md" />
        ) : patterns.length === 0 ? (
          <EmptyState message="No high-confidence patterns found" />
        ) : (
          <div className="space-y-3">
            {patterns.map(({ symbol, pattern }, index) => (
              <Link
                key={index}
                href={`/stocks?symbol=${symbol}`}
                className="block p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{symbol}</div>
                    <div className="text-sm text-muted-foreground">{pattern.pattern}</div>
                  </div>
                  <Badge className={getPatternColor(pattern.direction)}>
                    {pattern.direction}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold">{formatConfidence(pattern.confidence)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
