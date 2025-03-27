import { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IEvent } from "../models/Event.interface";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from '@mui/icons-material/Event';

interface EventCardsProps {
  events: IEvent[];
  isAdmin?: boolean;
  onDelete?: (eventId: number) => void;
  onEdit?: (eventId: number, updatedEvent: IEvent) => void;
  onDashboard?: boolean;
}

export const EventCards = ({
  events,
  isAdmin,
  onDelete,
  onEdit,
  onDashboard,
}: EventCardsProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (eventId: number) => {
    setFavorites((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {events.map((event)  => (
          
          <Card
            key={event.id}
            elevation={3}
            sx={{
              width: 400,
              borderRadius: "12px",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-8px)",
              },
            }}
          >
            <CardMedia
              component="img"
              height="250"
              image={event.images[0]}
              alt={event.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                height="25px"
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {event.name}
                </Typography>
                <Box display="flex" flexDirection="row">
                  <IconButton
                    onClick={() => event.id && toggleFavorite(event.id)}
                  >
                    {event.id && favorites.includes(event.id) ? (
                      <FavoriteIcon sx={{ color: "#ff1744", fontSize: 20 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                  {isAdmin && (
                    <Box display="flex" justifyContent="space-between">
                      <IconButton
                        name="edit"
                        onClick={() =>
                          event.id && onEdit && onEdit(event.id, event)
                        }
                        color="primary"
                      >
                        <EditIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        name="delete"
                        onClick={() =>
                          event.id && onDelete && onDelete(event.id)
                        }
                        color="error"
                      >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                my={1}
                height={30}
              >
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {event.address}
                </Typography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                my={1}
                height={5}
              >
                <EventIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {event.startDate.toLocaleString()}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                height={50}
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                }}
              >
                {event.description}
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${event.price}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    /ticket
                  </Typography>
                </Typography>
                <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {event.availableSeat}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    /{event.maxCapacity} seats
                  </Typography>
                </Typography>
              </Box>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none", borderRadius: "8px" }}
                  component={Link}
                  to={onDashboard ? `/dashboard/event/${event.id}` : `/event/${event.id}`}
                >
                  See more
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
