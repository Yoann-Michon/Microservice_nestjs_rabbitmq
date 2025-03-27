import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  styled,
  Typography,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import { eventService } from "../services/Event.service";
import { IEvent } from "../models/Event.interface";
import { useParams } from "react-router-dom";

const HEADER_HEIGHT = 64;

const ImageContainer = styled(Box)(() => ({
  width: "40%",
  height: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px 0 0 12px",
  },
}));

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const isAuthenticated = !!localStorage.getItem("token");

  const handleClick = () => {
    if (isAuthenticated) {
      setShowPayment(true);
    } else {
      window.location.href = "/signin";
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        if (id) {
          const eventData = await eventService.getEventById(id);
          setEvent(eventData);
        } else {
          setError("Invalid event ID");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch event details");
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container sx={{ py: 4, mt: `${HEADER_HEIGHT}px` }}>
        <Typography variant="h5" color="error" align="center">
          {error || "Event not found"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        mt: `${HEADER_HEIGHT}px`,
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "12px",
          width: 700,
          height: 400,
        }}
      >
        <ImageContainer>
          {event.images && <img src={event.images[0]} alt={event.name} />}
        </ImageContainer>

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            {event.name}
          </Typography>

          <Typography variant="h4" color="primary" fontWeight="bold">
            Price : ${event.price}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <LocationOnIcon />
            <Typography variant="body1">{event.address}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon />
            <Typography variant="body1">Start : {event.startDate.toLocaleDateString()}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon />
            <Typography variant="body1">End : {event.endDate.toLocaleDateString()}</Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {event.description || "No description available for this event."}
          </Typography>

          {/* Bouton d'achat */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleClick}
          >
            Buy Ticket
          </Button>
        </CardContent>
      </Card>

      {showPayment}
    </Container>
  );
};
