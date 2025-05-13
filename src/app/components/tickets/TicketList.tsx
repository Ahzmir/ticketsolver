"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle, AlertCircle, FileText, Clock } from "lucide-react";
import { Badge } from "../ui/badge";

interface Ticket {
  id: string;
  type: "bullying" | "cafeteria" | "grade";
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
}

interface TicketListProps {
  tickets?: Ticket[];
  onCreateTicket?: () => void;
  onViewTicket?: (ticket: Ticket) => void;
}

const getTicketTypeIcon = (type: Ticket["type"]) => {
  switch (type) {
    case "bullying":
      return <AlertCircle className="h-4 w-4 mr-1" />;
    case "cafeteria":
      return <FileText className="h-4 w-4 mr-1" />;
    case "grade":
      return <Clock className="h-4 w-4 mr-1" />;
    default:
      return <FileText className="h-4 w-4 mr-1" />;
  }
};

const getTicketTypeLabel = (type: Ticket["type"]) => {
  switch (type) {
    case "bullying":
      return "Bullying";
    case "cafeteria":
      return "Cafeteria Food";
    case "grade":
      return "Grade Consultation";
    default:
      return "Unknown";
  }
};

const getStatusBadgeVariant = (status: Ticket["status"]) => {
  switch (status) {
    case "open":
      return "default";
    case "in-progress":
      return "secondary";
    case "resolved":
      return "outline";
    default:
      return "default";
  }
};

export default function TicketList({
  tickets = [],
  onCreateTicket = () => {},
  onViewTicket = () => {},
}: TicketListProps) {
  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't submitted any tickets yet.
          </p>
          <Button onClick={onCreateTicket}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewTicket(ticket)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {getTicketTypeIcon(ticket.type)}
                      <CardTitle className="text-lg">
                        {getTicketTypeLabel(ticket.type)}
                      </CardTitle>
                    </div>
                    <Badge variant={getStatusBadgeVariant(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() +
                        ticket.status.slice(1).replace("-", " ")}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Submitted on{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm">{ticket.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={onCreateTicket}
        >
          <PlusCircle className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
