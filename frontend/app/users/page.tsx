"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { api } from "../services/api";
import { User } from "../types";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HomePage = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users");
        console.log(response.data);
        setUsers(response.data);
        setLoading(false);
      } catch {
        setError("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Interest</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>
                  {user.interests.map((interest: string, index: number) => (
                    <span key={interest} className="text-blue-500">
                      {interest}
                      {index < user.interests.length - 1 && ", "}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  <Button variant="link" className="text-blue-500">
                    <a href={`/users/${user._id}/edit`}>Edit</a>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    className="text-red-500"
                    onClick={async () => {
                      try {
                        await api.delete(`/users/${user._id}`);
                        setUsers(users.filter((u) => u._id !== user._id));
                      } catch (error) {
                        console.error("Error deleting user:", error);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>A list of users with their details.</TableCaption>
        </Table>
      )}
    </div>
  );
};

export default HomePage;
