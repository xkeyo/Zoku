/**
 * User Settings API client
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserSettings {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  is_google_account: boolean;
  created_at: string;
  last_login: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export interface ProfilePictureResponse {
  profile_image: string | null;
  is_google_account: boolean;
}

/**
 * Get user settings
 */
export async function getUserSettings(): Promise<UserSettings> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/settings/`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user settings");
  }

  return response.json();
}

/**
 * Update user profile
 */
export async function updateProfile(data: ProfileUpdateData): Promise<UserSettings> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/settings/profile`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to update profile" }));
    throw new Error(error.detail || "Failed to update profile");
  }

  return response.json();
}

/**
 * Change password
 */
export async function changePassword(data: PasswordChangeData): Promise<void> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/settings/change-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to change password" }));
    throw new Error(error.detail || "Failed to change password");
  }
}

/**
 * Get profile picture
 */
export async function getProfilePicture(): Promise<ProfilePictureResponse> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/settings/profile-picture`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile picture");
  }

  return response.json();
}

/**
 * Update profile picture
 */
export async function updateProfilePicture(imageUrl: string): Promise<{ message: string; profile_image: string }> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/settings/profile-picture?profile_image_url=${encodeURIComponent(imageUrl)}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to update profile picture" }));
    throw new Error(error.detail || "Failed to update profile picture");
  }

  return response.json();
}

/**
 * Delete profile picture
 */
export async function deleteProfilePicture(): Promise<void> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/settings/profile-picture`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to delete profile picture" }));
    throw new Error(error.detail || "Failed to delete profile picture");
  }
}

/**
 * Delete account
 */
export async function deleteAccount(): Promise<void> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/settings/account`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to delete account" }));
    throw new Error(error.detail || "Failed to delete account");
  }
}
