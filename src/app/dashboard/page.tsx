"use client";

import React, { useEffect } from "react";
import axios from "axios";
import TicketList from "../components/tickets/TicketList";
import TicketModal from "../components/tickets/TicketModal";
import Menu from "../components/Menu";
import { useRouter } from "next/navigation";

interface Ticket {
  _id: string;
  studentId: string;
  complaintType: string;
  description?: string; // optional for now
  status?: string;      // optional for now
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/complaints");
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
  
    fetchTickets();
  }, []);

  const handleCreateTicket = async (newTicket: any) => {
    try {
      const user = sessionStorage.getItem("user");
      if (!user) {
        console.error("No user found in sessionStorage.");
        return;
      }
  
      const parsedUser = JSON.parse(user);
      const studentId = parsedUser.studentId;
  
      const response = await axios.post("http://localhost:5000/api/complaints", {
        studentId: studentId,
        complaintType: newTicket.type,
        description: newTicket.description,
      });
  
      setTickets([response.data.complaint, ...tickets]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleEditTicket = async (updatedTicket: Ticket) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/complaints/${updatedTicket._id}`,
        updatedTicket
      );
      setTickets(
        tickets.map((ticket) =>
          ticket._id === updatedTicket._id ? response.data.complaint : ticket
        )
      );
      setSelectedTicket(null);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${ticketId}`);
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    console.log("View ticket", ticket);
  };

  const handleHistoryClick = () => router.push("/history");
  const handleProfileClick = () => router.push("/profile");
  const handleLogoutClick = () => router.push("/");

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your support tickets
            </p>
          </div>
          <Menu
            onHistoryClick={handleHistoryClick}
            onProfileClick={handleProfileClick}
            onLogoutClick={handleLogoutClick}
          />
        </header>

        <main>
          {tickets.length > 0 ? (
            <TicketList
              tickets={tickets}
              onCreateTicket={() => setIsModalOpen(true)}
              onViewTicket={handleViewTicket}
              onEditTicket={(ticket) => {
                setSelectedTicket(ticket);
                setIsEditMode(true);
                setIsModalOpen(true);
              }}
              onDeleteTicket={handleDeleteTicket}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tickets available</p>
            </div>
          )}

          {isModalOpen && (
            <TicketModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={isEditMode ? handleEditTicket : handleCreateTicket}
              ticket={selectedTicket}
              mode={isEditMode ? "edit" : "create"}
            />
          )}
        </main>
      </div>
    </div>
  );
}
