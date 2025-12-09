import authRequest from "@/lib/authRequest";
import request from "@/lib/request";

// API Response Interfaces
export interface UserInfo {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  profile_image?: string | null;
  created_at?: string;
  last_login?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Authentication APIs
export const userLogin = (loginData: LoginRequest): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    // Convert to FormData for backend compatibility
    const formData = new FormData();
    formData.append("username", loginData.email);
    formData.append("password", loginData.password);

    request({
      url: "/auth/login",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const userRegister = (registerData: RegisterRequest): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    request({
      url: "/auth/register",
      method: "post",
      data: registerData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getCurrentUser = (): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/auth/me",
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const refreshToken = (refreshData: RefreshRequest): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    request({
      url: "/auth/refresh",
      method: "post",
      data: refreshData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Future User Management APIs (when implemented in backend)
export const filterUsers = (params: {
  offset: number;
  limit: number;
  global_search?: string | null;
}): Promise<{ data: UserInfo[]; count: number }> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/users/filter",
      method: "get",
      params,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const getUserById = (params: { user_id: number }): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/users/get-by-id",
      method: "get",
      params,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const createUser = (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/users/create-user",
      method: "post",
      data,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const updateUser = (data: {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/users/update-user",
      method: "put",
      data,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const deleteUser = (id: number): Promise<{ message: string }> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/users/delete",
      method: "delete",
      params: { user_id: id },
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const updateUserPassword = (data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<{ message: string }> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/users/update-password",
      method: "put",
      data,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const updateUserInfo = (data: {
  user_id: number;
  first_name?: string;
  last_name?: string;
}): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/users/update-user-info",
      method: "put",
      data,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

// Password Reset APIs (for future implementation)
export const forgotPassword = (data: { email: string }): Promise<{ message: string }> => {
  return new Promise((resolve, reject) => {
    request({
      url: "/auth/forgot-password",
      method: "post",
      data,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const resetPassword = (data: {
  token: string;
  new_password: string;
}): Promise<{ message: string }> => {
  return new Promise((resolve, reject) => {
    request({
      url: "/auth/reset-password",
      method: "post",
      data,
    })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};
