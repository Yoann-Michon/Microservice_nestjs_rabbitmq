import { useEffect, useState } from "react";
import { EventCards } from "../components/EventCards";
import { eventService } from "../services/Event.service";
import Search from "../components/Search";
import { IEvent } from "../models/Event.interface";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";

export const Event = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      fetchEvents();
      return;
    }
    searchEventsService(query); 
  };

  const searchEventsService = async (query: string) => {
    setLoading(true);
    try {
      const eventsData = await eventService.searchEvents(query);
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
      } else {
        setError("Unexpected response format from the API.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching events"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await eventService.getAllEvents();
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
      } else {
        setError("Unexpected response format from the API.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="end"
        sx={{ mt: 11, width: "100%" }}
      >
        <Search onSearch={handleSearch} searchService={searchEventsService} searchQuery={searchQuery} />
        <Divider sx={{ width: "100%", my: 2 }} />
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {error && (
          <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {events.length > 0 ? (
              <EventCards events={events} />
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No events available
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};
