"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Ticket {
  id?: string;
  type: string;
  description: string;
  status?: string;
  createdAt?: Date;
}

interface TicketModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (ticket: Ticket) => void;
  ticket?: Ticket;
  mode?: "create" | "edit" | "view"; // Add "view" mode
}

export default function TicketModal({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  ticket = { type: "", description: "" }, // Ensure default values for ticket
  mode = "create",
}: TicketModalProps) {
  const [formData, setFormData] = useState<Ticket>({ type: "", description: "" });
  const [errors, setErrors] = useState<{ type?: string; description?: string }>({}); 

  // Update form data when ticket prop changes (to handle editing)
  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    }
  }, [ticket]);

  const handleChange = (field: keyof Ticket, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { type?: string; description?: string } = {};

    if (!formData.type) {
      newErrors.type = "Please select a complaint type";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/complaints", {
          studentId: "123456", // Replace with actual studentId from auth context
          complaintType: formData.type,
          description: formData.description,
        });

        const savedComplaint = response.data.complaint;
        onSubmit(savedComplaint); // Send to parent (Dashboard)
        onClose();
      } catch (error) {
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Submit New Ticket"}
            {mode === "edit" && "Edit Ticket"}
            {mode === "view" && "View Ticket"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type" className="text-left">
              Complaint Type
            </Label>
            <Select
              value={formData.type || ""} // Default to an empty string if formData.type is undefined
              onValueChange={(value) => handleChange("type", value)}
              disabled={mode === "view"} // Disable editing if in view mode
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select complaint type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bullying">Bullying</SelectItem>
                <SelectItem value="cafeteria">Cafeteria Food</SelectItem>
                <SelectItem value="grade">Grade Consultation</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your complaint in detail"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[120px]"
              disabled={mode === "view"} // Disable editing if in view mode
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          
            <Button onClick={handleSubmit}>
              {mode === "create" ? "Submit" : "Save Changes"}
            </Button>
        
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
