import { ITicket } from "../models/Ticket.interface";
import { AuthService } from "./Auth.service";
import { IPayment } from "../models/Payment.interface";

export const ticketService = {
  async getAllTickets() {
    try {
      const token = AuthService.getToken();
      const decodedToken = AuthService.decodeToken();
      const userRole = decodedToken?.role;
      if (!userRole) {
        throw new Error("Role not found in token");
      }

      const url =
        userRole === "ADMIN" || userRole === "EVENTCREATOR"
          ? `${import.meta.env.VITE_BACK_API_URL}/api/tickets`
          : `${import.meta.env.VITE_BACK_API_URL}/api/tickets/me`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching tickets");
      }

      const data = await response.json();
      return data.data as ITicket[];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async getTicketById(ticketId: number) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/tickets/${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching ticket");
      }

      const data = await response.json();
      return data.data as ITicket;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async createTicket(eventId: number) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const payload = { eventId };

      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error creating ticket");
      }

      const data = await response.json();
      return data.data as ITicket;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async updateTicketStatus(ticketId: number, status: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const payload = { status };

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/tickets/${ticketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating ticket status");
      }

      const data = await response.json();
      return data.data as ITicket;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async processPayment(paymentData: IPayment) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const decodedToken = AuthService.decodeToken();
      const userId = decodedToken.sub;

      const payload = { paymentData, user: { id: userId } };

      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/api/tickets/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error processing payment");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async deleteTicket(ticketId: number) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/tickets/${ticketId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting ticket");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },
};
