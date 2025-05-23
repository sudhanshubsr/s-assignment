import axios from "axios";
import { User } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/users");
    // Ensure that we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);

    // Ensure interest is always an array
    if (response.data && !response.data.interest) {
      response.data.interest = [];
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  try {
    // Ensure interest is always an array
    const userData = {
      ...user,
      interest: user.interests || [],
    };

    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  user: Omit<User, "id">
): Promise<User> => {
  try {
    // Ensure interest is always an array
    const userData = {
      ...user,
      interest: user.interests || [],
    };

    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};
