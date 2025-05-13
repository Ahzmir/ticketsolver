"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [ticketHistory, setTicketHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/complaints");
        setTicketHistory(res.data);
      } catch (err) {
        setError("Failed to load complaints");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

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
            <h1 className="text-3xl font-bold tracking-tight">
              Ticket History
            </h1>
          </div>
          <p className="text-muted-foreground">
            View the history of all your ticket activities
          </p>
        </header>

        <main>
          {loading ? (
            <p className="text-muted-foreground">Loading complaints...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : ticketHistory.length > 0 ? (
            <div className="space-y-6">
              {ticketHistory.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-card rounded-lg border p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">Submitted</span>
                      <span className="text-muted-foreground">
                        {" "}
                        -{" "}
                        {item.type.charAt(0).toUpperCase() +
                          item.type.slice(1).replace("-", " ")}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Status: {item.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No complaints found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
