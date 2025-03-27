import { useState, ChangeEvent, useEffect } from "react";
import { styled } from "@mui/system";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageUpload from "./ImageUpload";
import { EventSchema } from "../schema/EventSchema";
import { IEvent } from "../models/Event.interface";
import { SlideSnackbar } from "./SlideSnackbar";
import { eventService } from "../services/Event.service";
import { AuthService } from "../services/Auth.service";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const user = AuthService.decodeToken();

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
  borderRadius: "8px",
  padding: "24px",
  width: "90%",
  maxWidth: "800px",
  maxHeight: "90vh",
  overflow: "auto",
  position: "relative",
}));

interface EventModalProps {
  onSuccess?: () => void;
  eventToEdit?: IEvent | null;
  open: boolean;
  onClose: () => void;
}

export const EventModal = ({
  onSuccess,
  eventToEdit,
  open,
  onClose,
}: EventModalProps) => {
  const [formData, setFormData] = useState<IEvent>({
    name: "",
    address:"",
    price: 0,
    description: "",
    images: [],
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
    maxCapacity: 0,
    availableSeat: 0,
    createdBy: user.id.toString(),
    creationDate: new Date(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type?: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        ...eventToEdit,
        images: [],
      });
      setImageFiles([]);
    } else {
      setFormData({
        name: "",
        address:"",
        price: 0,
        description: "",
        images: [],
        startDate: new Date(),
        endDate: new Date(),
        isActive: true,
        maxCapacity: 0,
        availableSeat: 0,
        createdBy: user.id.toString(),
        creationDate: new Date(),
      });
      setImageFiles([]);
    }
  }, [eventToEdit]);

  const validateForm = () => {
    const { error } = EventSchema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors: { [key: string]: string } = {};
      error.details.forEach((detail) => {
        const fieldName = String(detail.path[0]);
        newErrors[fieldName] = detail.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleDelete = async (id: number) => {
    try {
      await eventService.deleteEvent(id);
      setSnackbar({
        open: true,
        message: "Event deleted successfully!",
        type: "success",
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "Failed to delete event",
        type: "error",
      });
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const dataToSubmit = {
          ...formData,
          images: [],
        };

        if (eventToEdit) {
          if (eventToEdit.id) {
            await eventService.updateEvent(eventToEdit.id, dataToSubmit, imageFiles[0], imageFiles.slice(1));
            setSnackbar({
              open: true,
              message: "Event updated successfully!",
              type: "success",
            });
          } else {
            throw new Error("Event ID is undefined");
          }
        } else {
          await eventService.createEvent(formData, imageFiles[0], imageFiles.slice(1));
          setSnackbar({
            open: true,
            message: "Event created successfully!",
            type: "success",
          });
        }

        if (onSuccess) onSuccess();
        onClose();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error instanceof Error ? error.message : "Failed to save event",
          type: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleImageUpload = (files: File[]) => {
    setImageFiles(files);
    setFormData((prev) => ({
      ...prev,
      images: [],
    }));
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);
    setFormData({
      ...formData,
      price: inputValue === "" || isNaN(parsedValue) ? 0 : parsedValue,
    });
  };

  const handleMaxCapacityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseInt(inputValue, 10);
    setFormData({
      ...formData,
      maxCapacity: inputValue === "" || isNaN(parsedValue) ? 0 : parsedValue,
    });
  };

  return (
    <>
      <StyledModal open={open} onClose={onClose} aria-labelledby="event-modal-title">
        <ModalContent>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" component="h2" id="event-modal-title" gutterBottom>
            {eventToEdit ? "Edit Event Information" : "Add Event Information"}
          </Typography>

          <Box component="form" sx={{ mt: 2 }}>
            <ImageUpload onUpload={handleImageUpload} initialImages={formData.images} />

            <TextField
              fullWidth
              label="Event Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Street"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={!!errors.street}
              helperText={errors.street}
              margin="normal"
              required
            />

            <TextField
              label="Start date"
              type="date"
              value={formData.startDate.toISOString().split("T")[0]}
              onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End date"
              type="date"
              value={formData.endDate.toISOString().split("T")[0]}
              onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 2, mb: 1 }}>
              <InputLabel htmlFor="price">Price</InputLabel>
              <OutlinedInput
                id="price"
                value={formData.price === 0 ? "" : formData.price}
                onChange={handlePriceChange}
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                startAdornment={<InputAdornment position="start">USD</InputAdornment>}
                error={!!errors.price}
                label="Price"
                placeholder="0"
              />
              {errors.price && (
                <Typography variant="caption" color="error">
                  {errors.price}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 2, mb: 1 }}>
              <InputLabel htmlFor="maxCapacity">Max capacity</InputLabel>
              <OutlinedInput
                id="maxCapacity"
                value={formData.maxCapacity === 0 ? "" : formData.maxCapacity}
                onChange={handleMaxCapacityChange}
                type="number"
                inputProps={{ min: 0, step: "1" }}
                startAdornment={<InputAdornment position="start">Seats</InputAdornment>}
                error={!!errors.maxCapacity}
                label="Max capacity"
                placeholder="0"
              />
              {errors.maxCapacity && (
                <Typography variant="caption" color="error">
                  {errors.maxCapacity}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
              margin="normal"
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button variant="outlined" onClick={onClose} color="secondary">
                Cancel
              </Button>

              <Box>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ mr: 2 }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Save"}
                </Button>

                {eventToEdit && (
                  <Button
                    variant="contained"
                    onClick={() => eventToEdit?.id && handleDelete(eventToEdit.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </ModalContent>
      </StyledModal>

      <SlideSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })} severity={"error"}      />
    </>
  );
};
