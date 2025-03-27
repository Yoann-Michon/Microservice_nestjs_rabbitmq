import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  styled,
  InputAdornment,
  Paper,
  MenuItem,
} from "@mui/material";
import "react-multi-carousel/lib/styles.css";
import FestivalIcon from '@mui/icons-material/Festival';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Homepage from "../assets/images/yvette-de-wit-Kcx_YuUR-dw-unsplash.jpg";

const HeroSection = styled(Box)({
    height: "100vh",
    backgroundImage: `url(${Homepage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  });
  
  const SearchBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: theme.spacing(1),
    width: "100%",
    maxWidth: 850,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  }));

const destinations = [
  { label: "Paris, France", price: "$200-500" },
  { label: "New York, USA", price: "$300-700" },
  { label: "Tokyo, Japan", price: "$250-600" },
  { label: "London, UK", price: "$250-550" },
];

export default function Home() {
  const [destination, setDestination] = useState<string>("");

  return (
    <>
      <HeroSection>
        <Container>
          <Typography
            variant="h2"
            color="white"
            align="center"
            sx={{ position: "relative", mb: 4, fontWeight: "bold" }}
          >
            Find Your Event
          </Typography>
          <SearchBox elevation={3}>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                }
              }}
            >

              <TextField
                select
                fullWidth
                label="category"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ManageSearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: "1 1 200px" }}
              >
                {destinations.map((option) => (
                  <MenuItem key={option.label} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: "1 1 200px" }}
              >
                {destinations.map((option) => (
                  <MenuItem key={option.label} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Events name"
                type="text"
                value={name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FestivalIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: "1 1 100px" }}
              />             
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="primary"
              sx={{ 
                mt: 2, 
                py: 1.5,
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0"
                }
              }}
            >
              SEARCH EVENTS
            </Button>
          </SearchBox>
        </Container>
      </HeroSection>
    </>
  );
}
