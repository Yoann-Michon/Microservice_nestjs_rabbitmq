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
  InputAdornment,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { eventService } from "../../services/Event.service"; 
import { IEvent } from "../../models/Event.interface";
import { useParams, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SlideSnackbar } from "../../components/SlideSnackbar";
import dayjs from "dayjs";
import { ticketService } from "../../services/Ticket.service";

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    "& img": {
      transform: "scale(1.05)",
      transition: "transform 0.3s ease-in-out",
    },
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const DashboardEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");
  const [checkIn, setCheckIn] = useState<dayjs.Dayjs | null>(null);

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleBooking = async () => {
    try {
      if (!id) {
        showSnackbar("Invalid event ID", "error");
        return;
      }

      const eventIdNumber = parseInt(id, 10);
      if (isNaN(eventIdNumber)) {
        showSnackbar("Invalid event ID format", "error");
        return;
      }

      await ticketService.createTicket(eventIdNumber);
      showSnackbar("ticket buy successfully", "success");
      setTimeout(() => {
        navigate("/dashboard/tickets");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Booking failed";
      showSnackbar(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container sx={{ py: 4 }}>
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <SlideSnackbar open={snackbarOpen} onClose={handleSnackbarClose} message={snackbarMessage} severity={snackbarSeverity} />

      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" maxHeight="500px" sx={{ width: "100%" }}>
        <Typography variant="h3" component="h3" gutterBottom fontWeight="semi-bold" height="50px" fontSize="30px">
          {event.name}
        </Typography>
        <ImageContainer>
          {event.images && (
            <img
              src={Array.isArray(event.images) ? event.images[0] : event.images}
              alt={event.name}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          )}
        </ImageContainer>
      </Box>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="flex-start" sx={{ width: "100%" }}>
        <Card elevation={3} sx={{ mt: 4, borderRadius: "12px", width: { xs: "100%", md: "auto" } }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "100%", width: "100%" }}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" gutterBottom>
                  Price per night
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ${event.price}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon />
                <Typography variant="body1">{event.address}</Typography>
              </Box>
            </Box>

            <Typography variant="body1" mt={2}>
              {event.description || "No description available for this event."}
            </Typography>

            <Box mt={2} mb={2} display="flex" flexDirection="column" gap={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="checkIn"
                  label="Check-in"
                  value={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                
              </LocalizationProvider>

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  py: 2,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  borderRadius: "8px",
                }}
                onClick={handleBooking}
              >
                Book Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
