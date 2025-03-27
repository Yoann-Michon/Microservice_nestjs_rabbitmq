import { Box, Typography, CircularProgress, Divider, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { IEvent } from "../../models/Event.interface";
import { eventService } from "../../services/Event.service";
import { EventCards } from "../../components/EventCards";
import { EventModal } from "../../components/EventModal";
import { AuthService } from "../../services/Auth.service";

export const DashboardEvent = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getAllEvents();
      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await eventService.deleteEvent(id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the event");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventId: number) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (eventToEdit) {
      setSelectedEvent(eventToEdit);
      setOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setOpen(false);
  };

  const handleSuccess = () => {
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
    setIsAdmin(AuthService.isAdmin());
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          height: "100vh",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            Events
          </Typography>
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Box>
          {loading && <CircularProgress />}
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
          {!loading && !error && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                padding: 2,
                overflow: "auto",
              }}
            >
              {events.length === 0 ? (
                <Typography variant="body1">No events found</Typography>
              ) : (
                <EventCards 
                  events={events} 
                  isAdmin={isAdmin} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onDashboard={true}
                />
              )}
            </Box>
          )}
        </Box>

        {isAdmin && (
          <Button 
            variant="contained" 
            onClick={() => {
              setSelectedEvent(null); 
              setOpen(true);
            }}
          >
            Add Event
          </Button>
        )}

        <EventModal 
          open={open} 
          onClose={handleCloseModal} 
          eventToEdit={selectedEvent}
          onSuccess={handleSuccess}
        />
      </Box>
    </>
  );
};
