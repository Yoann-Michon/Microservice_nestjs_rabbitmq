import { IUser } from "../models/User.interface";
import { AuthService } from "./Auth.service";

export const userService = {
  async getAllUsers() {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }

      const data = await response.json();
      return data.users as IUser[];
    } catch (error) {
      throw error;
    }
  },

  async getUserByMail(email: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/users/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching user with ID ${email}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data as IUser;
    } catch (error) {
      throw error;
    }
  },

  async getUserById(id: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/users/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching user with ID ${id}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data as IUser;
    } catch (error) {
      throw error;
    }
  },

  async searchUsers(query: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/users/search/${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error searching for users: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as IUser[];
    } catch (error) {
      throw error;
    }
  },

  async createUser(user: IUser) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error(`Error creating user: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as IUser;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(id: string, userData: Partial<IUser>) {
    try {
      console.log(userData);
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error updating user with ID ${id}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data as IUser;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error deleting user with ID ${id}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
