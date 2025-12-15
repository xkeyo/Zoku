/**
 * Watchlist API client
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface WatchlistItem {
  id: number;
  user_id: number;
  list_name: string;
  symbol: string;
  name: string;
  added_at: string;
}

export interface WatchlistListsResponse {
  lists: string[];
  count: number;
}

export interface WatchlistResponse {
  items: WatchlistItem[];
  count: number;
}

/**
 * Get all watchlist names
 */
export async function getWatchlistNames(): Promise<WatchlistListsResponse> {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/watchlist/lists`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { lists: [], count: 0 };
      }
      throw new Error("Failed to fetch watchlist names");
    }

    return response.json();
  } catch (error) {
    console.error("Watchlist names fetch error:", error);
    return { lists: [], count: 0 };
  }
}

/**
 * Get user's watchlist for a specific list
 */
export async function getWatchlist(listName: string = "My Watchlist"): Promise<WatchlistResponse> {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/watchlist/?list_name=${encodeURIComponent(listName)}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Not authenticated for watchlist");
        return { items: [], count: 0 };
      }
      throw new Error("Failed to fetch watchlist");
    }

    return response.json();
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    return { items: [], count: 0 };
  }
}

/**
 * Add stock to watchlist
 */
export async function addToWatchlist(
  symbol: string,
  name: string,
  listName: string = "My Watchlist"
): Promise<WatchlistItem> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/watchlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
    body: JSON.stringify({ symbol, name, list_name: listName }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to add to watchlist" }));
    throw new Error(error.detail || "Failed to add to watchlist");
  }

  return response.json();
}

/**
 * Remove stock from watchlist
 */
export async function removeFromWatchlist(symbol: string, listName: string = "My Watchlist"): Promise<void> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/watchlist/${symbol}?list_name=${encodeURIComponent(listName)}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove from watchlist");
  }
}

/**
 * Check if stock is in watchlist
 */
export async function checkInWatchlist(symbol: string, listName: string = "My Watchlist"): Promise<boolean> {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/watchlist/check/${symbol}?list_name=${encodeURIComponent(listName)}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.in_watchlist;
  } catch (error) {
    console.error("Check watchlist error:", error);
    return false;
  }
}

/**
 * Rename a watchlist
 */
export async function renameWatchlist(oldName: string, newName: string): Promise<void> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/watchlist/rename`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ old_name: oldName, new_name: newName }),
  });

  if (!response.ok) {
    throw new Error("Failed to rename watchlist");
  }
}

/**
 * Delete a watchlist
 */
export async function deleteWatchlist(listName: string): Promise<void> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/watchlist/list`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ list_name: listName }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete watchlist");
  }
}
