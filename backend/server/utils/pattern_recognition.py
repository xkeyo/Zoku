import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional
from scipy.signal import argrelextrema
from datetime import datetime


class PatternRecognizer:
    """
    Advanced chart pattern recognition for technical analysis.
    Detects common patterns like Head & Shoulders, Double Top/Bottom,
    Triangles, Flags, Wedges, and more.
    """
    
    def __init__(self, df: pd.DataFrame):
        """
        Initialize with OHLCV DataFrame
        
        Args:
            df: DataFrame with columns: timestamp, open, high, low, close, volume
        """
        self.df = df.copy()
        self.patterns_found = []
        
    def detect_all_patterns(self) -> List[Dict]:
        """Detect all available patterns"""
        patterns = []
        
        # Check if we have enough data
        if len(self.df) < 20:
            return patterns
        
        try:
            # Trend patterns
            patterns.extend(self._detect_head_and_shoulders())
            patterns.extend(self._detect_inverse_head_and_shoulders())
            patterns.extend(self._detect_double_top())
            patterns.extend(self._detect_double_bottom())
            patterns.extend(self._detect_triple_top())
            patterns.extend(self._detect_triple_bottom())
            
            # Continuation patterns
            patterns.extend(self._detect_ascending_triangle())
            patterns.extend(self._detect_descending_triangle())
            patterns.extend(self._detect_symmetrical_triangle())
            patterns.extend(self._detect_bull_flag())
            patterns.extend(self._detect_bear_flag())
            patterns.extend(self._detect_rising_wedge())
            patterns.extend(self._detect_falling_wedge())
            
            # Candlestick patterns
            patterns.extend(self._detect_bullish_engulfing())
            patterns.extend(self._detect_bearish_engulfing())
            patterns.extend(self._detect_hammer())
            patterns.extend(self._detect_shooting_star())
            patterns.extend(self._detect_doji())
            
            # Support/Resistance
            patterns.extend(self._detect_support_resistance())
        except Exception as e:
            print(f"Error detecting patterns: {e}")
        
        # Sort by confidence and recency
        patterns.sort(key=lambda x: (x["confidence"], -x["end_index"]), reverse=True)
        
        return patterns
    
    def _find_peaks_and_troughs(self, order: int = 5) -> Tuple[np.ndarray, np.ndarray]:
        """Find local maxima (peaks) and minima (troughs)"""
        highs = self.df["high"].values
        lows = self.df["low"].values
        
        peaks = argrelextrema(highs, np.greater, order=order)[0]
        troughs = argrelextrema(lows, np.less, order=order)[0]
        
        return peaks, troughs
    
    def _detect_head_and_shoulders(self) -> List[Dict]:
        """Detect Head and Shoulders pattern (bearish reversal)"""
        patterns = []
        peaks, _ = self._find_peaks_and_troughs(order=3)
        
        if len(peaks) < 3:
            return patterns
        
        for i in range(len(peaks) - 2):
            left_shoulder = peaks[i]
            head = peaks[i + 1]
            right_shoulder = peaks[i + 2]
            
            left_price = self.df.iloc[left_shoulder]["high"]
            head_price = self.df.iloc[head]["high"]
            right_price = self.df.iloc[right_shoulder]["high"]
            
            # Head should be higher than shoulders
            if head_price > left_price and head_price > right_price:
                # Shoulders should be roughly equal (within 5%)
                shoulder_diff = abs(left_price - right_price) / left_price
                
                if shoulder_diff < 0.05:
                    # Calculate neckline
                    neckline_level = min(
                        self.df.iloc[left_shoulder:head]["low"].min(),
                        self.df.iloc[head:right_shoulder]["low"].min()
                    )
                    
                    confidence = 0.8 - (shoulder_diff * 2)
                    
                    patterns.append({
                        "pattern": "Head and Shoulders",
                        "type": "reversal",
                        "direction": "bearish",
                        "start_index": int(left_shoulder),
                        "end_index": int(right_shoulder),
                        "start_date": str(self.df.iloc[left_shoulder]["timestamp"]),
                        "end_date": str(self.df.iloc[right_shoulder]["timestamp"]),
                        "confidence": round(confidence, 2),
                        "key_levels": {
                            "left_shoulder": float(left_price),
                            "head": float(head_price),
                            "right_shoulder": float(right_price),
                            "neckline": float(neckline_level)
                        },
                        "target_price": float(neckline_level - (head_price - neckline_level)),
                        "description": "Bearish reversal pattern indicating potential downtrend"
                    })
        
        return patterns
    
    def _detect_inverse_head_and_shoulders(self) -> List[Dict]:
        """Detect Inverse Head and Shoulders pattern (bullish reversal)"""
        patterns = []
        _, troughs = self._find_peaks_and_troughs(order=3)
        
        if len(troughs) < 3:
            return patterns
        
        for i in range(len(troughs) - 2):
            left_shoulder = troughs[i]
            head = troughs[i + 1]
            right_shoulder = troughs[i + 2]
            
            left_price = self.df.iloc[left_shoulder]["low"]
            head_price = self.df.iloc[head]["low"]
            right_price = self.df.iloc[right_shoulder]["low"]
            
            if head_price < left_price and head_price < right_price:
                shoulder_diff = abs(left_price - right_price) / left_price
                
                if shoulder_diff < 0.05:
                    neckline_level = max(
                        self.df.iloc[left_shoulder:head]["high"].max(),
                        self.df.iloc[head:right_shoulder]["high"].max()
                    )
                    
                    confidence = 0.8 - (shoulder_diff * 2)
                    
                    patterns.append({
                        "pattern": "Inverse Head and Shoulders",
                        "type": "reversal",
                        "direction": "bullish",
                        "start_index": int(left_shoulder),
                        "end_index": int(right_shoulder),
                        "start_date": str(self.df.iloc[left_shoulder]["timestamp"]),
                        "end_date": str(self.df.iloc[right_shoulder]["timestamp"]),
                        "confidence": round(confidence, 2),
                        "key_levels": {
                            "left_shoulder": float(left_price),
                            "head": float(head_price),
                            "right_shoulder": float(right_price),
                            "neckline": float(neckline_level)
                        },
                        "target_price": float(neckline_level + (neckline_level - head_price)),
                        "description": "Bullish reversal pattern indicating potential uptrend"
                    })
        
        return patterns
    
    def _detect_double_top(self) -> List[Dict]:
        """Detect Double Top pattern (bearish reversal)"""
        patterns = []
        peaks, _ = self._find_peaks_and_troughs(order=3)
        
        if len(peaks) < 2:
            return patterns
        
        for i in range(len(peaks) - 1):
            first_peak = peaks[i]
            second_peak = peaks[i + 1]
            
            first_price = self.df.iloc[first_peak]["high"]
            second_price = self.df.iloc[second_peak]["high"]
            
            # Peaks should be roughly equal (within 3%)
            price_diff = abs(first_price - second_price) / first_price
            
            if price_diff < 0.03:
                # Find the trough between peaks
                trough_idx = self.df.iloc[first_peak:second_peak]["low"].idxmin()
                trough_price = self.df.iloc[trough_idx]["low"]
                
                # Trough should be significantly lower (at least 5%)
                if (first_price - trough_price) / first_price > 0.05:
                    confidence = 0.75 - (price_diff * 5)
                    
                    patterns.append({
                        "pattern": "Double Top",
                        "type": "reversal",
                        "direction": "bearish",
                        "start_index": int(first_peak),
                        "end_index": int(second_peak),
                        "start_date": str(self.df.iloc[first_peak]["timestamp"]),
                        "end_date": str(self.df.iloc[second_peak]["timestamp"]),
                        "confidence": round(confidence, 2),
                        "key_levels": {
                            "first_top": float(first_price),
                            "second_top": float(second_price),
                            "support": float(trough_price)
                        },
                        "target_price": float(trough_price - (first_price - trough_price)),
                        "description": "Bearish reversal pattern with two peaks at similar levels"
                    })
        
        return patterns
    
    def _detect_double_bottom(self) -> List[Dict]:
        """Detect Double Bottom pattern (bullish reversal)"""
        patterns = []
        _, troughs = self._find_peaks_and_troughs(order=3)
        
        if len(troughs) < 2:
            return patterns
        
        for i in range(len(troughs) - 1):
            first_trough = troughs[i]
            second_trough = troughs[i + 1]
            
            first_price = self.df.iloc[first_trough]["low"]
            second_price = self.df.iloc[second_trough]["low"]
            
            price_diff = abs(first_price - second_price) / first_price
            
            if price_diff < 0.03:
                peak_idx = self.df.iloc[first_trough:second_trough]["high"].idxmax()
                peak_price = self.df.iloc[peak_idx]["high"]
                
                if (peak_price - first_price) / first_price > 0.05:
                    confidence = 0.75 - (price_diff * 5)
                    
                    patterns.append({
                        "pattern": "Double Bottom",
                        "type": "reversal",
                        "direction": "bullish",
                        "start_index": int(first_trough),
                        "end_index": int(second_trough),
                        "start_date": str(self.df.iloc[first_trough]["timestamp"]),
                        "end_date": str(self.df.iloc[second_trough]["timestamp"]),
                        "confidence": round(confidence, 2),
                        "key_levels": {
                            "first_bottom": float(first_price),
                            "second_bottom": float(second_price),
                            "resistance": float(peak_price)
                        },
                        "target_price": float(peak_price + (peak_price - first_price)),
                        "description": "Bullish reversal pattern with two troughs at similar levels"
                    })
        
        return patterns
    
    def _detect_triple_top(self) -> List[Dict]:
        """Detect Triple Top pattern"""
        patterns = []
        peaks, _ = self._find_peaks_and_troughs(order=2)
        
        if len(peaks) < 3:
            return patterns
        
        for i in range(len(peaks) - 2):
            p1, p2, p3 = peaks[i], peaks[i + 1], peaks[i + 2]
            prices = [self.df.iloc[p]["high"] for p in [p1, p2, p3]]
            avg_price = np.mean(prices)
            
            if all(abs(p - avg_price) / avg_price < 0.03 for p in prices):
                support = self.df.iloc[p1:p3]["low"].min()
                
                patterns.append({
                    "pattern": "Triple Top",
                    "type": "reversal",
                    "direction": "bearish",
                    "start_index": int(p1),
                    "end_index": int(p3),
                    "start_date": str(self.df.iloc[p1]["timestamp"]),
                    "end_date": str(self.df.iloc[p3]["timestamp"]),
                    "confidence": 0.7,
                    "key_levels": {
                        "resistance": float(avg_price),
                        "support": float(support)
                    },
                    "target_price": float(support - (avg_price - support)),
                    "description": "Strong bearish reversal with three resistance tests"
                })
        
        return patterns
    
    def _detect_triple_bottom(self) -> List[Dict]:
        """Detect Triple Bottom pattern"""
        patterns = []
        _, troughs = self._find_peaks_and_troughs(order=2)
        
        if len(troughs) < 3:
            return patterns
        
        for i in range(len(troughs) - 2):
            t1, t2, t3 = troughs[i], troughs[i + 1], troughs[i + 2]
            prices = [self.df.iloc[t]["low"] for t in [t1, t2, t3]]
            avg_price = np.mean(prices)
            
            if all(abs(p - avg_price) / avg_price < 0.03 for p in prices):
                resistance = self.df.iloc[t1:t3]["high"].max()
                
                patterns.append({
                    "pattern": "Triple Bottom",
                    "type": "reversal",
                    "direction": "bullish",
                    "start_index": int(t1),
                    "end_index": int(t3),
                    "start_date": str(self.df.iloc[t1]["timestamp"]),
                    "end_date": str(self.df.iloc[t3]["timestamp"]),
                    "confidence": 0.7,
                    "key_levels": {
                        "support": float(avg_price),
                        "resistance": float(resistance)
                    },
                    "target_price": float(resistance + (resistance - avg_price)),
                    "description": "Strong bullish reversal with three support tests"
                })
        
        return patterns
    
    def _detect_ascending_triangle(self) -> List[Dict]:
        """Detect Ascending Triangle (bullish continuation)"""
        patterns = []
        peaks, troughs = self._find_peaks_and_troughs(order=3)
        
        if len(peaks) < 2 or len(troughs) < 2:
            return patterns
        
        # Look for flat resistance and rising support
        for i in range(len(peaks) - 1):
            p1, p2 = peaks[i], peaks[i + 1]
            peak_prices = [self.df.iloc[p]["high"] for p in [p1, p2]]
            
            # Resistance should be flat (within 2%)
            if abs(peak_prices[0] - peak_prices[1]) / peak_prices[0] < 0.02:
                # Find troughs in this range
                range_troughs = [t for t in troughs if p1 < t < p2]
                
                if len(range_troughs) >= 1:
                    # Check if support is rising
                    trough_before = [t for t in troughs if t < p1]
                    if trough_before:
                        t1 = trough_before[-1]
                        t2 = range_troughs[0]
                        
                        if self.df.iloc[t2]["low"] > self.df.iloc[t1]["low"]:
                            patterns.append({
                                "pattern": "Ascending Triangle",
                                "type": "continuation",
                                "direction": "bullish",
                                "start_index": int(t1),
                                "end_index": int(p2),
                                "start_date": str(self.df.iloc[t1]["timestamp"]),
                                "end_date": str(self.df.iloc[p2]["timestamp"]),
                                "confidence": 0.65,
                                "key_levels": {
                                    "resistance": float(np.mean(peak_prices)),
                                    "support_start": float(self.df.iloc[t1]["low"]),
                                    "support_end": float(self.df.iloc[t2]["low"])
                                },
                                "description": "Bullish continuation pattern with flat resistance and rising support"
                            })
        
        return patterns
    
    def _detect_descending_triangle(self) -> List[Dict]:
        """Detect Descending Triangle (bearish continuation)"""
        patterns = []
        peaks, troughs = self._find_peaks_and_troughs(order=3)
        
        if len(peaks) < 2 or len(troughs) < 2:
            return patterns
        
        for i in range(len(troughs) - 1):
            t1, t2 = troughs[i], troughs[i + 1]
            trough_prices = [self.df.iloc[t]["low"] for t in [t1, t2]]
            
            if abs(trough_prices[0] - trough_prices[1]) / trough_prices[0] < 0.02:
                range_peaks = [p for p in peaks if t1 < p < t2]
                
                if len(range_peaks) >= 1:
                    peak_before = [p for p in peaks if p < t1]
                    if peak_before:
                        p1 = peak_before[-1]
                        p2 = range_peaks[0]
                        
                        if self.df.iloc[p2]["high"] < self.df.iloc[p1]["high"]:
                            patterns.append({
                                "pattern": "Descending Triangle",
                                "type": "continuation",
                                "direction": "bearish",
                                "start_index": int(p1),
                                "end_index": int(t2),
                                "start_date": str(self.df.iloc[p1]["timestamp"]),
                                "end_date": str(self.df.iloc[t2]["timestamp"]),
                                "confidence": 0.65,
                                "key_levels": {
                                    "support": float(np.mean(trough_prices)),
                                    "resistance_start": float(self.df.iloc[p1]["high"]),
                                    "resistance_end": float(self.df.iloc[p2]["high"])
                                },
                                "description": "Bearish continuation pattern with flat support and falling resistance"
                            })
        
        return patterns
    
    def _detect_symmetrical_triangle(self) -> List[Dict]:
        """Detect Symmetrical Triangle"""
        patterns = []
        peaks, troughs = self._find_peaks_and_troughs(order=3)
        
        if len(peaks) < 2 or len(troughs) < 2:
            return patterns
        
        for i in range(len(peaks) - 1):
            for j in range(len(troughs) - 1):
                p1, p2 = peaks[i], peaks[i + 1]
                t1, t2 = troughs[j], troughs[j + 1]
                
                # Check if they overlap in time
                if t1 < p1 < t2 < p2 or p1 < t1 < p2 < t2:
                    peak_slope = (self.df.iloc[p2]["high"] - self.df.iloc[p1]["high"]) / (p2 - p1)
                    trough_slope = (self.df.iloc[t2]["low"] - self.df.iloc[t1]["low"]) / (t2 - t1)
                    
                    # Converging lines
                    if peak_slope < 0 and trough_slope > 0:
                        patterns.append({
                            "pattern": "Symmetrical Triangle",
                            "type": "continuation",
                            "direction": "neutral",
                            "start_index": int(min(p1, t1)),
                            "end_index": int(max(p2, t2)),
                            "start_date": str(self.df.iloc[min(p1, t1)]["timestamp"]),
                            "end_date": str(self.df.iloc[max(p2, t2)]["timestamp"]),
                            "confidence": 0.6,
                            "description": "Consolidation pattern with converging trendlines"
                        })
        
        return patterns
    
    def _detect_bull_flag(self) -> List[Dict]:
        """Detect Bull Flag pattern"""
        patterns = []
        
        # Look for strong uptrend followed by consolidation
        for i in range(20, len(self.df) - 10):
            # Check for pole (strong uptrend)
            pole_start = i - 20
            pole_end = i
            pole_gain = (self.df.iloc[pole_end]["close"] - self.df.iloc[pole_start]["close"]) / self.df.iloc[pole_start]["close"]
            
            if pole_gain > 0.1:  # At least 10% gain
                # Check for flag (consolidation with slight downward drift)
                flag_end = min(i + 10, len(self.df) - 1)
                flag_data = self.df.iloc[pole_end:flag_end]
                
                if len(flag_data) > 5:
                    flag_slope = np.polyfit(range(len(flag_data)), flag_data["close"].values, 1)[0]
                    
                    # Slight downward or sideways movement
                    if -0.01 < flag_slope < 0.005:
                        patterns.append({
                            "pattern": "Bull Flag",
                            "type": "continuation",
                            "direction": "bullish",
                            "start_index": int(pole_start),
                            "end_index": int(flag_end),
                            "start_date": str(self.df.iloc[pole_start]["timestamp"]),
                            "end_date": str(self.df.iloc[flag_end]["timestamp"]),
                            "confidence": 0.65,
                            "key_levels": {
                                "pole_start": float(self.df.iloc[pole_start]["close"]),
                                "pole_end": float(self.df.iloc[pole_end]["close"]),
                                "flag_high": float(flag_data["high"].max()),
                                "flag_low": float(flag_data["low"].min())
                            },
                            "description": "Bullish continuation after consolidation"
                        })
        
        return patterns[:3]  # Limit to most recent
    
    def _detect_bear_flag(self) -> List[Dict]:
        """Detect Bear Flag pattern"""
        patterns = []
        
        for i in range(20, len(self.df) - 10):
            pole_start = i - 20
            pole_end = i
            pole_loss = (self.df.iloc[pole_start]["close"] - self.df.iloc[pole_end]["close"]) / self.df.iloc[pole_start]["close"]
            
            if pole_loss > 0.1:
                flag_end = min(i + 10, len(self.df) - 1)
                flag_data = self.df.iloc[pole_end:flag_end]
                
                if len(flag_data) > 5:
                    flag_slope = np.polyfit(range(len(flag_data)), flag_data["close"].values, 1)[0]
                    
                    if -0.005 < flag_slope < 0.01:
                        patterns.append({
                            "pattern": "Bear Flag",
                            "type": "continuation",
                            "direction": "bearish",
                            "start_index": int(pole_start),
                            "end_index": int(flag_end),
                            "start_date": str(self.df.iloc[pole_start]["timestamp"]),
                            "end_date": str(self.df.iloc[flag_end]["timestamp"]),
                            "confidence": 0.65,
                            "key_levels": {
                                "pole_start": float(self.df.iloc[pole_start]["close"]),
                                "pole_end": float(self.df.iloc[pole_end]["close"]),
                                "flag_high": float(flag_data["high"].max()),
                                "flag_low": float(flag_data["low"].min())
                            },
                            "description": "Bearish continuation after consolidation"
                        })
        
        return patterns[:3]
    
    def _detect_rising_wedge(self) -> List[Dict]:
        """Detect Rising Wedge (bearish)"""
        patterns = []
        peaks, troughs = self._find_peaks_and_troughs(order=3)
        
        if len(peaks) < 2 or len(troughs) < 2:
            return patterns
        
        for i in range(len(peaks) - 1):
            for j in range(len(troughs) - 1):
                p1, p2 = peaks[i], peaks[i + 1]
                t1, t2 = troughs[j], troughs[j + 1]
                
                if t1 < p1 < t2 < p2:
                    peak_slope = (self.df.iloc[p2]["high"] - self.df.iloc[p1]["high"]) / (p2 - p1)
                    trough_slope = (self.df.iloc[t2]["low"] - self.df.iloc[t1]["low"]) / (t2 - t1)
                    
                    # Both rising, but converging
                    if peak_slope > 0 and trough_slope > 0 and trough_slope > peak_slope:
                        patterns.append({
                            "pattern": "Rising Wedge",
                            "type": "reversal",
                            "direction": "bearish",
                            "start_index": int(t1),
                            "end_index": int(p2),
                            "start_date": str(self.df.iloc[t1]["timestamp"]),
                            "end_date": str(self.df.iloc[p2]["timestamp"]),
                            "confidence": 0.6,
                            "description": "Bearish pattern with converging upward trendlines"
                        })
        
        return patterns
    
    def _detect_falling_wedge(self) -> List[Dict]:
        """Detect Falling Wedge (bullish)"""
        patterns = []
        peaks, troughs = self._find_peaks_and_troughs(order=3)
        
        if len(peaks) < 2 or len(troughs) < 2:
            return patterns
        
        for i in range(len(peaks) - 1):
            for j in range(len(troughs) - 1):
                p1, p2 = peaks[i], peaks[i + 1]
                t1, t2 = troughs[j], troughs[j + 1]
                
                if t1 < p1 < t2 < p2:
                    peak_slope = (self.df.iloc[p2]["high"] - self.df.iloc[p1]["high"]) / (p2 - p1)
                    trough_slope = (self.df.iloc[t2]["low"] - self.df.iloc[t1]["low"]) / (t2 - t1)
                    
                    # Both falling, but converging
                    if peak_slope < 0 and trough_slope < 0 and peak_slope < trough_slope:
                        patterns.append({
                            "pattern": "Falling Wedge",
                            "type": "reversal",
                            "direction": "bullish",
                            "start_index": int(t1),
                            "end_index": int(p2),
                            "start_date": str(self.df.iloc[t1]["timestamp"]),
                            "end_date": str(self.df.iloc[p2]["timestamp"]),
                            "confidence": 0.6,
                            "description": "Bullish pattern with converging downward trendlines"
                        })
        
        return patterns
    
    def _detect_bullish_engulfing(self) -> List[Dict]:
        """Detect Bullish Engulfing candlestick pattern"""
        patterns = []
        
        for i in range(1, len(self.df)):
            prev = self.df.iloc[i - 1]
            curr = self.df.iloc[i]
            
            # Previous candle is bearish
            if prev["close"] < prev["open"]:
                # Current candle is bullish and engulfs previous
                if (curr["close"] > curr["open"] and
                    curr["open"] < prev["close"] and
                    curr["close"] > prev["open"]):
                    
                    patterns.append({
                        "pattern": "Bullish Engulfing",
                        "type": "reversal",
                        "direction": "bullish",
                        "start_index": int(i - 1),
                        "end_index": int(i),
                        "start_date": str(prev["timestamp"]),
                        "end_date": str(curr["timestamp"]),
                        "confidence": 0.7,
                        "description": "Strong bullish reversal candlestick pattern"
                    })
        
        return patterns[-5:]  # Return last 5
    
    def _detect_bearish_engulfing(self) -> List[Dict]:
        """Detect Bearish Engulfing candlestick pattern"""
        patterns = []
        
        for i in range(1, len(self.df)):
            prev = self.df.iloc[i - 1]
            curr = self.df.iloc[i]
            
            # Previous candle is bullish
            if prev["close"] > prev["open"]:
                # Current candle is bearish and engulfs previous
                if (curr["close"] < curr["open"] and
                    curr["open"] > prev["close"] and
                    curr["close"] < prev["open"]):
                    
                    patterns.append({
                        "pattern": "Bearish Engulfing",
                        "type": "reversal",
                        "direction": "bearish",
                        "start_index": int(i - 1),
                        "end_index": int(i),
                        "start_date": str(prev["timestamp"]),
                        "end_date": str(curr["timestamp"]),
                        "confidence": 0.7,
                        "description": "Strong bearish reversal candlestick pattern"
                    })
        
        return patterns[-5:]
    
    def _detect_hammer(self) -> List[Dict]:
        """Detect Hammer candlestick pattern (bullish)"""
        patterns = []
        
        for i in range(len(self.df)):
            candle = self.df.iloc[i]
            body = abs(candle["close"] - candle["open"])
            lower_shadow = min(candle["open"], candle["close"]) - candle["low"]
            upper_shadow = candle["high"] - max(candle["open"], candle["close"])
            
            # Lower shadow at least 2x body, small upper shadow
            if lower_shadow > 2 * body and upper_shadow < body * 0.3:
                patterns.append({
                    "pattern": "Hammer",
                    "type": "reversal",
                    "direction": "bullish",
                    "start_index": int(i),
                    "end_index": int(i),
                    "start_date": str(candle["timestamp"]),
                    "end_date": str(candle["timestamp"]),
                    "confidence": 0.65,
                    "description": "Bullish reversal with long lower shadow"
                })
        
        return patterns[-5:]
    
    def _detect_shooting_star(self) -> List[Dict]:
        """Detect Shooting Star candlestick pattern (bearish)"""
        patterns = []
        
        for i in range(len(self.df)):
            candle = self.df.iloc[i]
            body = abs(candle["close"] - candle["open"])
            lower_shadow = min(candle["open"], candle["close"]) - candle["low"]
            upper_shadow = candle["high"] - max(candle["open"], candle["close"])
            
            # Upper shadow at least 2x body, small lower shadow
            if upper_shadow > 2 * body and lower_shadow < body * 0.3:
                patterns.append({
                    "pattern": "Shooting Star",
                    "type": "reversal",
                    "direction": "bearish",
                    "start_index": int(i),
                    "end_index": int(i),
                    "start_date": str(candle["timestamp"]),
                    "end_date": str(candle["timestamp"]),
                    "confidence": 0.65,
                    "description": "Bearish reversal with long upper shadow"
                })
        
        return patterns[-5:]
    
    def _detect_doji(self) -> List[Dict]:
        """Detect Doji candlestick pattern (indecision)"""
        patterns = []
        
        for i in range(len(self.df)):
            candle = self.df.iloc[i]
            body = abs(candle["close"] - candle["open"])
            total_range = candle["high"] - candle["low"]
            
            # Very small body relative to range
            if total_range > 0 and body / total_range < 0.1:
                patterns.append({
                    "pattern": "Doji",
                    "type": "reversal",
                    "direction": "neutral",
                    "start_index": int(i),
                    "end_index": int(i),
                    "start_date": str(candle["timestamp"]),
                    "end_date": str(candle["timestamp"]),
                    "confidence": 0.5,
                    "description": "Market indecision, potential reversal"
                })
        
        return patterns[-5:]
    
    def _detect_support_resistance(self) -> List[Dict]:
        """Detect key support and resistance levels"""
        patterns = []
        
        try:
            # Check if we have enough data
            if len(self.df) < 20:
                return patterns
            
            # Use recent data (up to 50 points or all available)
            recent_count = min(50, len(self.df))
            recent_data = self.df.tail(recent_count)
            
            if len(recent_data) == 0:
                return patterns
            
            # Find resistance (price struggled to break above)
            resistance_level = recent_data["high"].quantile(0.95)
            touches_resistance = sum(1 for h in recent_data["high"] if abs(h - resistance_level) / resistance_level < 0.02)
            
            if touches_resistance >= 2:
                start_idx = max(0, len(self.df) - recent_count)
                patterns.append({
                    "pattern": "Resistance Level",
                    "type": "support_resistance",
                    "direction": "neutral",
                    "start_index": int(start_idx),
                    "end_index": int(len(self.df) - 1),
                    "start_date": str(recent_data.iloc[0]["timestamp"]),
                    "end_date": str(recent_data.iloc[-1]["timestamp"]),
                    "confidence": 0.7,
                    "key_levels": {
                        "level": float(resistance_level),
                        "touches": int(touches_resistance)
                    },
                    "description": f"Strong resistance at {resistance_level:.2f}"
                })
            
            # Find support
            support_level = recent_data["low"].quantile(0.05)
            touches_support = sum(1 for l in recent_data["low"] if abs(l - support_level) / support_level < 0.02)
            
            if touches_support >= 2:
                start_idx = max(0, len(self.df) - recent_count)
                patterns.append({
                    "pattern": "Support Level",
                    "type": "support_resistance",
                    "direction": "neutral",
                    "start_index": int(start_idx),
                    "end_index": int(len(self.df) - 1),
                    "start_date": str(recent_data.iloc[0]["timestamp"]),
                    "end_date": str(recent_data.iloc[-1]["timestamp"]),
                    "confidence": 0.7,
                    "key_levels": {
                        "level": float(support_level),
                        "touches": int(touches_support)
                    },
                    "description": f"Strong support at {support_level:.2f}"
                })
        except Exception as e:
            print(f"Error in support/resistance detection: {e}")
        
        return patterns
