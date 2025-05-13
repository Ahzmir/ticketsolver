"use client";

import React from "react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import axios from "axios";

export default function ProfilePage() {
  const router = useRouter();

  // Mock user data - in a real app, this would come from authentication context
  const user = {
    id: "2022303115",
    name: "Ahzmir de Gracia",
    email: "ahzmir.degracia@gmail.com",
    grade: "Junior",
    joinedDate: "April 2025",
    avatarUrl: "",
  };

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage your account information
          </p>
        </header>

        <main>
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Student ID
                      </p>
                      <p>{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </p>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Grade
                      </p>
                      <p>{user.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Joined
                      </p>
                      <p>{user.joinedDate}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Password
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Notifications
                  </p>
                  <Button variant="outline">Manage Notifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
