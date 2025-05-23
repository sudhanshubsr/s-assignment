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
import React, { useState } from "react";

type UserFormState = {
  name: string;
  email: string;
  age: string;
  mobile: string;
  interests: string;
};

const AddUserPage = () => {
  const [user, setUser] = useState<UserFormState>({
    name: "",
    email: "",
    age: "",
    mobile: "",
    interests: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const interestArray = user.interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        name: user.name,
        email: user.email,
        age: user.age ? parseInt(user.age, 10) : undefined,
        mobile: user.mobile,
        interests: interestArray,
      };

      if (user.age && isNaN(payload.age as number)) {
        setMessage("Error: Age must be a valid number.");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post("/users", payload);
      console.log("User added successfully:", response.data);
      setMessage("User added successfully!");
      setUser({
        name: "",
        email: "",
        age: "",
        mobile: "",
        interests: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>
            Enter the details to add a new user to the system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {message && (
              <p
                className={`text-sm p-2 rounded ${
                  message.startsWith("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </p>
            )}
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
            <Input
              type="number"
              name="age"
              placeholder="Age"
              value={user.age}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            <Input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={user.mobile}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            <Input
              type="text"
              name="interests"
              placeholder="Interests (comma-separated)"
              value={user.interests}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding User..." : "Add User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddUserPage;
