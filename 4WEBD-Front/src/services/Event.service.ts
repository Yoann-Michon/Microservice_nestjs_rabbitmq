import { IEvent } from "../models/Event.interface";
import { AuthService } from "./Auth.service";

export const eventService = {
  async getAllEvents() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/events`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching events: ${response.statusText}`);
      }

      const data = await response.json();
      return data as IEvent[];
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching events"
      );
    }
  },


  async searchEvents(query: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/events/search/${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error searching for events: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as IEvent[];
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while searching for events"
      );
    }
  },

  async createEvent(eventData: IEvent, mainImage: File, images: File[]) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append("description", eventData.description || "");
      formData.append("startDate", eventData.startDate.toISOString());
      formData.append("endDate", eventData.endDate.toISOString());
      formData.append("address", eventData.address);
      formData.append("maxCapacity", eventData.maxCapacity.toString());
      formData.append("availableSeats", eventData.availableSeat.toString());
      formData.append("price", eventData.price.toString());
      formData.append("creationDate", eventData.creationDate.toISOString());
      formData.append("isActive", String(true));


      formData.append("images", mainImage);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Error creating event: ${data.message || response.statusText}`
        );
      }

      return data.data;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the event"
      );
    }
  },

  async updateEvent(id: number, updateData: IEvent, mainImage?: File, newImages: File[] = []) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const formData = new FormData();

      if (updateData.name) formData.append("name", updateData.name);
      if (updateData.description) formData.append("description", updateData.description);
      if (updateData.startDate) formData.append("startDate", updateData.startDate.toISOString());
      if (updateData.endDate) formData.append("endDate", updateData.endDate.toISOString());
      if (updateData.address) formData.append("location", updateData.address);
      if (updateData.maxCapacity !== undefined) 
        formData.append("maxCapacity", updateData.maxCapacity.toString());
      if (updateData.availableSeat !== undefined) 
        formData.append("availableSeats", updateData.availableSeat.toString());
      if (updateData.price !== undefined)
        formData.append("price", updateData.price.toString());
      if (updateData.creationDate)
        formData.append("creationDate", updateData.creationDate.toISOString());
      if (updateData.isActive !== undefined)
        formData.append("isActive", updateData.isActive.toString());

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      newImages.forEach((image) => formData.append("images", image));

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/events/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok)
        throw new Error(`Error updating event: ${response.statusText}`);

      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the event"
      );
    }
  },

  async deleteEvent(id: number) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/events/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting event: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the event"
      );
    }
  },

  async getEventById(id: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/api/events/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error getting event: ${response.statusText}`);
      }

      const data = await response.json();
      return data.event;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while getting the event"
      );
    }
  },
};
