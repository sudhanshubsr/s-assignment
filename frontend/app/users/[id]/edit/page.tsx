"use client";

import { api } from "@/app/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type UserFormState = {
  name: string;
  email: string;
  age: string;
  mobile: string;
  interests: string;
};

type ApiUser = {
  id: string;
  name: string;
  email: string;
  age: number;
  mobile: string;
  interests: string[];
};

type PageStatus =
  | "idle"
  | "loadingUser"
  | "userLoaded"
  | "submitting"
  | "submitted"
  | "error";

const EditUserPage = () => {
  const params = useParams();
  const router = useRouter();
  const idParam = params.id;
  const userId = Array.isArray(idParam) ? idParam[0] : idParam;

  const [userForm, setUserForm] = useState<UserFormState>({
    name: "",
    email: "",
    age: "",
    mobile: "",
    interests: "",
  });

  const [status, setStatus] = useState<PageStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initialUserName, setInitialUserName] = useState<string>("");

  const fetchUserById = useCallback(async (id: string) => {
    setStatus("loadingUser");
    setErrorMessage(null);
    try {
      const response = await api.get<ApiUser>(`/users/${id}`);
      const fetchedData = response.data;

      setUserForm({
        name: fetchedData.name,
        email: fetchedData.email,
        age: String(fetchedData.age),
        mobile: fetchedData.mobile,
        interests: fetchedData.interests.join(", "),
      });
      setInitialUserName(fetchedData.name);
      setStatus("userLoaded");
    } catch (err) {
      console.error("Error fetching user:", err);
      setErrorMessage(
        "Failed to fetch user data. The user might not exist or there was a network issue."
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (userId && typeof userId === "string") {
      fetchUserById(userId);
    } else if (userId) {
      setErrorMessage("Invalid user ID provided in the URL.");
      setStatus("error");
    } else {
      setErrorMessage("No user ID found. Cannot edit user.");
      setStatus("error");
    }
  }, [userId, fetchUserById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || typeof userId !== "string") {
      setErrorMessage("Cannot update: User ID is missing or invalid.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const interestsArray = userForm.interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload: Omit<ApiUser, "id"> = {
        name: userForm.name,
        email: userForm.email,
        age: parseInt(userForm.age, 10),
        mobile: userForm.mobile,
        interests: interestsArray,
      };

      if (isNaN(payload.age)) {
        setErrorMessage("Age must be a valid number.");
        setStatus("userLoaded");
        return;
      }

      await api.put(`/users/${userId}`, payload);
      setStatus("submitted");
    } catch (err) {
      console.error("Error updating user:", err);
      const apiError = 
        typeof err === 'object' && err !== null && 'response' in err && 
        typeof err.response === 'object' && err.response !== null && 
        'data' in err.response && typeof err.response.data === 'object' && 
        err.response.data !== null && 'message' in err.response.data ?
        String(err.response.data.message) :
        "Failed to update user. Please check your input or try again later.";
      setErrorMessage(apiError);
      setStatus("userLoaded");
    }
  };

  const isLoading = status === "loadingUser" || status === "submitting";

  if (status === "loadingUser" && !userForm.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (status === "error" && !userForm.name && errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{errorMessage}</p>
            <Button onClick={() => router.push("/")} className="mt-4 w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userId && status !== "loadingUser") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Invalid or missing User ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <Card className="w-[400px] md:w-[450px]">
        <CardHeader>
          <CardTitle>
            Edit User: {initialUserName || (userId ? `ID ${userId}` : "")}
          </CardTitle>
          <CardDescription>
            {status === "submitted"
              ? "User details updated successfully!"
              : `Modify the details for this user.${
                  errorMessage && !isLoading
                    ? " Please correct the errors below."
                    : ""
                }`}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {errorMessage && status !== "loadingUser" && (
              <p className="text-sm font-medium text-red-600 bg-red-100 p-3 rounded-md">
                {errorMessage}
              </p>
            )}
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                name="name"
                value={userForm.name}
                onChange={handleInputChange}
                disabled={isLoading || status === "submitted"}
                required
                aria-describedby={errorMessage ? "error-message" : undefined}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                name="email"
                value={userForm.email}
                onChange={handleInputChange}
                disabled={isLoading || status === "submitted"}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="age" className="text-sm font-medium">
                Age
              </label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 30"
                name="age"
                value={userForm.age}
                onChange={handleInputChange}
                disabled={isLoading || status === "submitted"}
                required
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="mobile" className="text-sm font-medium">
                Mobile
              </label>
              <Input
                id="mobile"
                type="tel"
                placeholder="e.g., 123-456-7890"
                name="mobile"
                value={userForm.mobile}
                onChange={handleInputChange}
                disabled={isLoading || status === "submitted"}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="interests" className="text-sm font-medium">
                Interests
              </label>
              <Input
                id="interests"
                type="text"
                placeholder="e.g., Coding, Reading, Hiking"
                name="interests"
                value={userForm.interests}
                onChange={handleInputChange}
                disabled={isLoading || status === "submitted"}
                aria-describedby="interests-description"
              />
              <p id="interests-description" className="text-xs text-gray-500">
                Comma-separated values.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading || status === "submitted"}
              className="w-full"
            >
              {status === "submitting"
                ? "Saving..."
                : status === "submitted"
                ? "Saved!"
                : "Save Changes"}
            </Button>
            {status === "submitted" && (
              <Button
                variant="outline"
                onClick={() => router.push(`/users`)}
                className="w-full"
              >
                Back to Users List
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditUserPage;
